import { Injectable, Logger } from '@nestjs/common';
import { IExcelService } from 'application/ports/IExcelService';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { ClassStudent } from 'domain/models/ClassStudent';

@Injectable()
export class GradeManagementUseCase {
  private readonly logger = new Logger(GradeManagementUseCase.name);
  private readonly columns = ['Student ID', 'Full name'];
  constructor(
    private readonly excelService: IExcelService,
    private readonly studentRepository: IStudentRepository,
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
}
