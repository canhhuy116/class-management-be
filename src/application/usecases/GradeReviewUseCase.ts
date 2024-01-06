import { Injectable, Logger } from '@nestjs/common';
import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { IGradeRepository } from 'application/ports/IGradeRepository';
import { IGradeReviewRepository } from 'application/ports/IGradeReviewRepository';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { GradeReview } from 'domain/models/GradeReview';

@Injectable()
export class GradeReviewUseCase {
  private readonly logger = new Logger(GradeReviewUseCase.name);

  constructor(
    private readonly gradeReviewRepository: IGradeReviewRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly gradeRepository: IGradeRepository,
    private readonly assignmentRepository: IAssignmentRepository,
    private readonly gradeComposition: IGradeCompositionRepository,
  ) {}

  async studentRequestReview(
    gradeReview: GradeReview,
    classId: number,
    currentUserId: number,
  ) {
    this.logger.log('Student request review');

    const student = await this.studentRepository.findOne({
      where: {
        userId: currentUserId,
        classId,
      },
    });

    if (!student) {
      throw new EntityNotFoundException('Student not found');
    }

    const assignment = await this.assignmentRepository.findOne({
      where: {
        id: gradeReview.assignmentId,
      },
    });

    if (!assignment) {
      throw new EntityNotFoundException('Assignment not found');
    }

    if (gradeReview.expectedValue > assignment.maxScore) {
      throw new EntityNotFoundException(
        'Expected value is greater than max value',
      );
    }

    const gradeComposition = await this.gradeComposition.findOne({
      where: {
        id: assignment.gradeCompositionId,
      },
    });

    if (!gradeComposition) {
      throw new EntityNotFoundException('Grade composition not found');
    }

    if (!gradeComposition.viewable) {
      throw new EntityNotFoundException('Grade composition is not viewable');
    }

    if (gradeComposition.classId != classId) {
      throw new EntityNotFoundException(
        'Grade composition is not in this class',
      );
    }

    const findGradeReview = await this.gradeReviewRepository.findOne({
      where: {
        assignmentId: gradeReview.assignmentId,
        studentId: student.studentId,
        isReviewed: false,
      },
    });

    if (findGradeReview) {
      throw new EntityAlreadyExistException('Grade review already exists');
    }

    gradeReview.forStudent(student.studentId);

    const findGrade = await this.gradeRepository.findOne({
      where: {
        assignmentId: gradeReview.assignmentId,
        studentId: student.studentId,
      },
    });

    if (!findGrade) {
      throw new EntityNotFoundException('Grade not found');
    }

    gradeReview.withCurrentValue(findGrade.value);
    gradeReview.requestTo(findGrade.teacherId);

    await this.gradeReviewRepository.save(gradeReview);
  }

  async teacherViewGradeReview(classId: number, currentUserId: number) {
    this.logger.log('Teacher view grade review');

    const gradeCompositions = await this.gradeComposition.find({
      where: {
        classId,
      },
    });

    const assignmentIds: number[] = [];

    for (const gradeComposition of gradeCompositions) {
      const assignments = await this.assignmentRepository.find({
        where: {
          gradeCompositionId: gradeComposition.id,
        },
      });

      for (const assignment of assignments) {
        assignmentIds.push(assignment.id);
      }
    }

    const gradeReviewOfUser = await this.gradeReviewRepository.find({
      where: {
        teacherId: currentUserId,
        isReviewed: false,
      },
      relations: ['assignment'],
    });

    const gradeReviews = gradeReviewOfUser.filter((gradeReview) =>
      assignmentIds.includes(gradeReview.assignmentId),
    );

    return gradeReviews;
  }
}
