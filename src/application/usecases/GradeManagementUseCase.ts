import { Injectable, Logger } from '@nestjs/common';
import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { IExcelService } from 'application/ports/IExcelService';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { Assignment } from 'domain/models/Assignment';
import { ClassStudent } from 'domain/models/ClassStudent';

@Injectable()
export class GradeManagementUseCase {
  private readonly logger = new Logger(GradeManagementUseCase.name);
  private readonly columns = ['Student ID', 'Full name'];
  constructor(
    private readonly excelService: IExcelService,
    private readonly studentRepository: IStudentRepository,
    private readonly grandeCompositionRepository: IGradeCompositionRepository,
    private readonly assignmentRepository: IAssignmentRepository,
  ) {}

  async downloadStudentListTemplate(): Promise<Buffer> {
    this.logger.log(`Downloading student list template`);

    const buffer = await this.excelService.generateExcelTemplate(
      'Student List',
      this.columns,
    );

    return buffer;
  }

  async uploadStudentListTemplate(buffer: Buffer, classId: number) {
    this.logger.log(`Uploading student list template`);

    const excelStudents = await this.excelService.excelToEntities(
      buffer,
      this.columns,
    );

    const existingStudents = await this.studentRepository.find({
      where: { classId },
    });
    const existingStudentIds = new Set(
      existingStudents.map((s) => s.studentId),
    );

    const updatedStudents = excelStudents.map((student) => {
      const studentId = student[this.columns[0]].toString();
      const fullName = student[this.columns[1]];

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
        compositionName: gradeComposition.name,
        compositionWeight: gradeComposition.weight,
        assignmentsBoard: [],
      };

      const assignmentBoard = assignments.map((assignment) => {
        return {
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
}
