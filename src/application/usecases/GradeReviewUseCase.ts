import { Injectable, Logger } from '@nestjs/common';
import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { IGradeRepository } from 'application/ports/IGradeRepository';
import { IGradeReviewRepository } from 'application/ports/IGradeReviewRepository';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { GradeReview } from 'domain/models/GradeReview';
import { ReviewVM } from 'presentation/view-model/gradereviews/ReviewVM';

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

  async teacherReviewGradeReview(
    reviewVM: ReviewVM,
    classId: number,
    currentUserId: number,
  ) {
    this.logger.log('Teacher review grade review');

    const gradeReview = await this.gradeReviewRepository.findOne({
      where: {
        id: reviewVM.id,
      },
    });

    if (!gradeReview) {
      throw new EntityNotFoundException('Grade review not found');
    }

    if (gradeReview.isReviewed) {
      throw new EntityAlreadyExistException('Grade review already reviewed');
    }

    if (gradeReview.teacherId != currentUserId) {
      throw new EntityNotFoundException('Grade review is not belong to you');
    }

    const findAssignment = await this.assignmentRepository.findOne({
      where: {
        id: gradeReview.assignmentId,
      },
    });

    if (!findAssignment) {
      throw new EntityNotFoundException('Assignment not found');
    }

    const gradeComposition = await this.gradeComposition.findOne({
      where: {
        id: findAssignment.gradeCompositionId,
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

    if (reviewVM.isReject) {
      gradeReview.reject(reviewVM.commentReject);
    } else {
      gradeReview.approve(reviewVM.commentApprove);

      const findAssignment = await this.assignmentRepository.findOne({
        where: {
          id: gradeReview.assignmentId,
        },
      });

      if (!findAssignment) {
        throw new EntityNotFoundException('Assignment not found');
      }

      if (gradeReview.value > findAssignment.maxScore) {
        throw new EntityNotFoundException(
          'Grade review value is greater than max value',
        );
      }

      const findGrade = await this.gradeRepository.findOne({
        where: {
          assignmentId: gradeReview.assignmentId,
          studentId: gradeReview.studentId,
        },
      });

      if (!findGrade) {
        throw new EntityNotFoundException('Grade not found');
      }

      findGrade.updateValue(reviewVM.value);

      await this.gradeRepository.save(findGrade);
    }

    await this.gradeReviewRepository.save(gradeReview);
  }

  async studentViewReviewOfTeacher(
    currentUserId: number,
    classId: number,
    assignmentId: number,
  ) {
    this.logger.log('Student view review of teacher');

    const student = await this.studentRepository.findOne({
      where: {
        userId: currentUserId,
        classId,
      },
    });

    if (!student) {
      throw new EntityNotFoundException('Student not found');
    }

    const gradeReviewsForAssignment = await this.gradeReviewRepository.find({
      where: {
        assignmentId,
        studentId: student.studentId,
      },
    });

    const gradeReviews = [];

    for (const gradeReview of gradeReviewsForAssignment) {
      const isReviewed = gradeReview.isReviewed;

      const studentComment = gradeReview.message;

      if (!isReviewed) {
        gradeReviews.push({
          isReviewed,
          isApproved: null,
          studentComment,
          teacherComment: null,
        });
        continue;
      }

      const isApproved = gradeReview.commentApprove != null;

      const teacherComment = isApproved
        ? gradeReview.commentApprove
        : gradeReview.commentReject;

      gradeReviews.push({
        isReviewed,
        isApproved,
        studentComment,
        teacherComment,
      });
    }

    return gradeReviews;
  }
}
