import { Injectable, Logger } from '@nestjs/common';
import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IExcelService } from 'application/ports/IExcelService';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { IGradeRepository } from 'application/ports/IGradeRepository';
import { INotificationService } from 'application/ports/INotificationService';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { InvalidValueException } from 'domain/exceptions/InvalidValueException';
import { Assignment } from 'domain/models/Assignment';
import { ClassStudent } from 'domain/models/ClassStudent';
import { Grade } from 'domain/models/Grade';
import { NotificationType } from 'domain/models/NotificationType';

@Injectable()
export class GradeManagementUseCase {
  private readonly logger = new Logger(GradeManagementUseCase.name);
  private readonly columnsStudentList = ['Student ID', 'Full name'];
  private readonly columnsGradeAssignment = ['Student ID', 'Grade'];
  constructor(
    private readonly excelService: IExcelService,
    private readonly studentRepository: IStudentRepository,
    private readonly grandeCompositionRepository: IGradeCompositionRepository,
    private readonly assignmentRepository: IAssignmentRepository,
    private readonly gradeRepository: IGradeRepository,
    private readonly notificationService: INotificationService,
    private readonly classRepository: IClassRepository,
  ) {}

  async downloadStudentListTemplate(): Promise<Buffer> {
    this.logger.log(`Downloading student list template`);

    const buffer = await this.excelService.generateExcelTemplate(
      'Student List',
      this.columnsStudentList,
    );

    return buffer;
  }

  async uploadStudentListTemplate(buffer: Buffer, classId: number) {
    this.logger.log(`Uploading student list template`);

    const excelStudents = await this.excelService.excelToEntities(
      buffer,
      this.columnsStudentList,
    );

    const existingStudents = await this.studentRepository.find({
      where: { classId },
    });
    const existingStudentIds = new Set(
      existingStudents.map((s) => s.studentId),
    );

    const updatedStudents = excelStudents.map((student) => {
      const studentId = student[this.columnsStudentList[0]]?.toString();
      const fullName = student[this.columnsStudentList[1]];
      if (studentId === undefined || studentId === null) {
        throw new InvalidValueException(
          `Existed student ID is empty or invalid`,
        );
      }

      const existingStudentIndex = existingStudentIds.has(studentId)
        ? existingStudents.findIndex((s) => s.studentId === studentId)
        : -1;

      if (existingStudentIndex !== -1) {
        return existingStudents[existingStudentIndex].setFullName(fullName);
      } else {
        return new ClassStudent(classId, null, studentId, fullName);
      }
    });

    const duplicateStudentIds = Array.from(
      new Set(updatedStudents.map((s) => s.studentId)),
    ).filter((studentId) => {
      const studentIds = updatedStudents.map((s) => s.studentId);
      return (
        studentIds.indexOf(studentId) !== studentIds.lastIndexOf(studentId)
      );
    });

    if (duplicateStudentIds.length > 0) {
      throw new EntityAlreadyExistException(
        `Duplicate student IDs found: ${duplicateStudentIds.join(', ')}`,
      );
    }

    await this.studentRepository.save(updatedStudents);
  }

  async createAssignment(classId: number, assignment: Assignment) {
    this.logger.log(`Creating assignment`);

    const findGradeComposition = await this.grandeCompositionRepository.find({
      where: { classId },
    });

    // if composition id of assignment is not found in grade composition => throw error
    if (
      !findGradeComposition.find(
        (gradeComposition) =>
          gradeComposition.id === assignment.gradeCompositionId,
      )
    ) {
      throw new EntityNotFoundException(
        `The grade composition {${assignment.gradeCompositionId}} has not found`,
      );
    }

    await this.assignmentRepository.save(assignment);
  }

  async previewStudentGradeBoard(classId: number) {
    this.logger.log(`Preview student grade board`);

    const students = await this.studentRepository.find({
      where: { classId },
    });

    const gradeCompositionInClass = await this.grandeCompositionRepository.find(
      {
        where: { classId },
      },
    );

    const gradeBoard = [];
    for (const gradeComposition of gradeCompositionInClass) {
      const assignments = await this.assignmentRepository.find({
        where: { gradeCompositionId: gradeComposition.id },
      });

      const gradeCompositionBoard = {
        compositionId: gradeComposition.id,
        compositionName: gradeComposition.name,
        compositionWeight: gradeComposition.weight,
        assignmentsBoard: [],
      };

      const assignmentBoard = assignments.map((assignment) => {
        return {
          assignmentId: assignment.id,
          assignmentName: assignment.name,
          maxScore: assignment.maxScore,
        };
      });

      gradeCompositionBoard.assignmentsBoard = assignmentBoard;

      gradeBoard.push(gradeCompositionBoard);
    }

    const studentList = students.map((student) => {
      return {
        studentId: student.studentId,
        fullName: student.fullName,
      };
    });

    return {
      studentList,
      gradeBoard,
    };
  }

  async inputGradeStudentAssignment(
    currentUserId: number,
    classId: number,
    input: Grade,
  ) {
    this.logger.log(`Input grade student assignment`);

    const student = await this.studentRepository.findOne({
      where: { studentId: input.studentId, classId },
    });

    if (!student) {
      throw new EntityNotFoundException(
        `The student ${input.studentId} has not found`,
      );
    }

    const assignment = await this.assignmentRepository.findOne({
      where: { id: input.assignmentId },
    });

    if (!assignment) {
      throw new EntityNotFoundException(
        `The assignment ${input.assignmentId} has not found`,
      );
    }

    if (input.value > assignment.maxScore) {
      throw new InvalidValueException(
        `The score ${input.value} is greater than max score ${assignment.maxScore}`,
      );
    }

    const findGrade = await this.gradeRepository.findOne({
      where: { studentId: input.studentId, assignmentId: input.assignmentId },
    });

    if (findGrade) {
      findGrade.value = input.value;
      findGrade.byTeacher(currentUserId);
      await this.gradeRepository.save(findGrade);
    } else {
      input.byTeacher(currentUserId);
      await this.gradeRepository.save(input);
    }
  }

  async downloadGradeAssignmentTemplate(classId: number, assignmentId: number) {
    this.logger.log(`Downloading grade assignment template`);

    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new EntityNotFoundException(
        `The assignment ${assignmentId} has not found`,
      );
    }

    const gradeComposition = await this.grandeCompositionRepository.findOne({
      where: { id: assignment.gradeCompositionId },
    });

    if (!gradeComposition) {
      throw new EntityNotFoundException(
        `The grade composition ${assignment.gradeCompositionId} has not found`,
      );
    }

    if (gradeComposition.classId != classId) {
      throw new EntityNotFoundException(
        `The grade composition ${assignment.gradeCompositionId} has not found in class ${classId}`,
      );
    }

    const students = await this.studentRepository.find({
      where: { classId },
    });

    const studentIds = students
      .filter((student) => student.studentId)
      .map((student) => student.studentId);

    const dataMap = new Map<number, any[]>();
    dataMap.set(0, studentIds);

    const buffer = await this.excelService.generateExcelTemplate(
      `Grade Assignment ${assignment.name}`,
      this.columnsGradeAssignment,
      dataMap,
    );

    return buffer;
  }

  async uploadGradeAssignment(
    buffer: Buffer,
    classId: number,
    assignmentId: number,
    currentUserId: number,
  ) {
    this.logger.log(`Uploading grade assignment`);

    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new EntityNotFoundException(
        `The assignment ${assignmentId} has not found`,
      );
    }

    const gradeComposition = await this.grandeCompositionRepository.findOne({
      where: { id: assignment.gradeCompositionId },
    });

    if (!gradeComposition) {
      throw new EntityNotFoundException(
        `The grade composition ${assignment.gradeCompositionId} has not found`,
      );
    }

    if (gradeComposition.classId != classId) {
      throw new EntityNotFoundException(
        `The grade composition ${assignment.gradeCompositionId} has not found in class ${classId}`,
      );
    }

    const excelGrades = await this.excelService.excelToEntities(
      buffer,
      this.columnsGradeAssignment,
    );

    const students = await this.studentRepository.find({
      where: { classId },
    });

    const studentIds = students.map((student) => student.studentId);

    const grades = [];
    for (const excelGrade of excelGrades) {
      const studentId = excelGrade[this.columnsGradeAssignment[0]].toString();
      const value = excelGrade[this.columnsGradeAssignment[1]];

      if (!studentIds.includes(studentId)) {
        throw new EntityNotFoundException(
          `The student ${studentId} has not found`,
        );
      }

      if (value > assignment.maxScore || value < 0 || !value) {
        throw new InvalidValueException(
          `The score ${value} is greater than max score ${assignment.maxScore} or less than 0`,
        );
      }

      const gradeExist = await this.gradeRepository.findOne({
        where: { studentId, assignmentId },
      });

      if (gradeExist) {
        gradeExist.value = value;
        gradeExist.byTeacher(currentUserId);
        grades.push(gradeExist);
      } else {
        const grade = new Grade(value, studentId, assignmentId);
        grade.byTeacher(currentUserId);
        grades.push(grade);
      }
    }

    await this.gradeRepository.save(grades);
  }

  async showTotalGrade(classId: number) {
    this.logger.log(`Show total grade`);

    const students = await this.studentRepository.find({
      where: { classId },
    });

    const studentList = students.map((student) => {
      return {
        studentId: student.studentId,
        fullName: student.fullName,
      };
    });

    const gradeCompositionInClass = await this.grandeCompositionRepository.find(
      {
        where: { classId },
      },
    );

    const totalGradeBoard = [];
    for (const gradeComposition of gradeCompositionInClass) {
      const assignments = await this.assignmentRepository.find({
        where: { gradeCompositionId: gradeComposition.id },
      });

      const gradeCompositionBoard = {
        compositionId: gradeComposition.id,
        compositionName: gradeComposition.name,
        compositionWeight: gradeComposition.weight,
        viewable: gradeComposition.viewable,
        assignmentsBoard: [],
      };

      for (const assignment of assignments) {
        const grades = await this.gradeRepository.find({
          where: { assignmentId: assignment.id },
        });

        const assignmentBoard = {
          assignmentId: assignment.id,
          assignmentName: assignment.name,
          maxScore: assignment.maxScore,
          gradesBoard: [],
        };

        grades.forEach((grade) => {
          assignmentBoard.gradesBoard.push({
            indexStudent: studentList.findIndex(
              (student) => student.studentId === grade.studentId,
            ),
            value: grade.value,
          });
        });

        gradeCompositionBoard.assignmentsBoard.push(assignmentBoard);
      }

      totalGradeBoard.push(gradeCompositionBoard);
    }

    return {
      studentList,
      totalGradeBoard,
    };
  }

  async studentViewGradeBoard(classId: number, userId: number) {
    this.logger.log(`Student view grade board`);

    const student = await this.studentRepository.findOne({
      where: { userId, classId },
    });

    if (!student || !student.studentId) {
      throw new EntityNotFoundException(`The student has not found`);
    }

    const studentId = student.studentId;

    const gradeCompositionInClass = await this.grandeCompositionRepository.find(
      {
        where: { classId },
      },
    );

    const totalGradeBoard = [];
    for (const gradeComposition of gradeCompositionInClass) {
      const assignments = await this.assignmentRepository.find({
        where: { gradeCompositionId: gradeComposition.id },
      });

      const gradeCompositionBoard = {
        compositionId: gradeComposition.id,
        compositionName: gradeComposition.name,
        compositionWeight: gradeComposition.weight,
        assignmentsBoard: [],
      };

      for (const assignment of assignments) {
        const grade = await this.gradeRepository.findOne({
          where: { studentId, assignmentId: assignment.id },
        });

        gradeCompositionBoard.assignmentsBoard.push({
          assignmentId: assignment.id,
          assignmentName: assignment.name,
          maxScore: assignment.maxScore,
          value: gradeComposition.viewable && grade && grade.value,
        });
      }

      totalGradeBoard.push(gradeCompositionBoard);
    }

    return {
      student: [{ studentId, fullName: student.fullName }],
      totalGradeBoard,
    };
  }

  async markViewableGradeComposition(classId: number, compositionId: number) {
    this.logger.log(`Mark viewable grade composition`);

    const gradeComposition = await this.grandeCompositionRepository.findOne({
      where: { id: compositionId },
    });

    if (!gradeComposition) {
      throw new EntityNotFoundException(
        `The grade composition ${compositionId} has not found`,
      );
    }

    if (gradeComposition.classId != classId) {
      throw new EntityNotFoundException(
        `The grade composition ${compositionId} has not found in class ${classId}`,
      );
    }

    if (gradeComposition.viewable) {
      throw new EntityAlreadyExistException(
        `The grade composition ${compositionId} is viewable`,
      );
    }

    gradeComposition.enableView();
    await this.grandeCompositionRepository.save(gradeComposition);

    const titleNotification = `The grade composition ${gradeComposition.name} has been viewable`;
    const notificationType = NotificationType.MARK_FINAl_GRADE;
    const data = { classId };
    const resourceId = classId;

    await this.notificationService.pushNotification(
      titleNotification,
      notificationType,
      data,
      resourceId,
    );
  }

  async viewGrade(classId: number, userId: number, gradeCompositionId: number) {
    this.logger.log(`Show student grade board`);

    const student = await this.studentRepository.findOne({
      where: { userId, classId },
    });

    if (!student || !student.studentId) {
      throw new EntityNotFoundException(`The student has not found`);
    }

    const studentId = student.studentId;

    const gradeComposition = await this.grandeCompositionRepository.findOne({
      where: { id: gradeCompositionId },
    });

    if (!gradeComposition) {
      throw new EntityNotFoundException(
        `The grade composition ${gradeCompositionId} has not found`,
      );
    }

    if (gradeComposition.classId != classId) {
      throw new EntityNotFoundException(
        `The grade composition ${gradeCompositionId} has not found in class ${classId}`,
      );
    }

    if (!gradeComposition.viewable) {
      throw new InvalidValueException(`The grade composition is not viewable`);
    }

    const assignments = await this.assignmentRepository.find({
      where: { gradeCompositionId },
    });

    const gradeBoard = [];
    let totalScore = 0;
    let totalMaxScore = 0;
    for (const assignment of assignments) {
      const grade = await this.gradeRepository.findOne({
        where: { studentId, assignmentId: assignment.id },
      });

      gradeBoard.push({
        assignmentId: assignment.id,
        assignmentName: assignment.name,
        maxScore: assignment.maxScore,
        value: grade ? grade.value : null,
      });

      totalScore += grade ? grade.value : 0;
      totalMaxScore += assignment.maxScore;
    }

    return {
      studentId,
      gradeBoard,
      totalScore,
      totalMaxScore,
      weight: gradeComposition.weight,
    };
  }

  async getListAssignment(classId: number, currentUserId: number) {
    const findClass = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!findClass) {
      throw new EntityNotFoundException(`The class ${classId} has not found`);
    }

    if (!findClass.hasMember(currentUserId)) {
      throw new EntityNotFoundException(
        `The user ${currentUserId} has not found in class ${classId}`,
      );
    }

    const findGradeComposition = await this.grandeCompositionRepository.find({
      where: { classId },
    });

    const listAssignment = [];

    for (const gradeComposition of findGradeComposition) {
      const assignments = await this.assignmentRepository.find({
        where: { gradeCompositionId: gradeComposition.id },
      });

      for (const assignment of assignments) {
        listAssignment.push({
          assignmentId: assignment.id,
          assignmentName: assignment.name,
          maxScore: assignment.maxScore,
          time: assignment.createdAt,
        });
      }
    }

    return listAssignment;
  }
}
