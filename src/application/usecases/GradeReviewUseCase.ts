import { Injectable, Logger } from '@nestjs/common';
import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { IGradeRepository } from 'application/ports/IGradeRepository';
import { IGradeReviewCommentRepository } from 'application/ports/IGradeReviewCommentRepository';
import { IGradeReviewRepository } from 'application/ports/IGradeReviewRepository';
import { INotificationService } from 'application/ports/INotificationService';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { GradeReview } from 'domain/models/GradeReview';
import { GradeReviewComment } from 'domain/models/GradeReviewComment';
import { NotificationType } from 'domain/models/NotificationType';
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
    private readonly notificationService: INotificationService,
    private readonly classRepository: IClassRepository,
    private readonly gradeReviewComment: IGradeReviewCommentRepository,
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

    const titleNotification = `Student ${student.studentId} request review grade for assignment ${assignment.name}`;
    const notificationType = NotificationType.REQUEST_REVIEW;
    const data = { classId, assignmentId: assignment.id };
    const receiverId = findGrade.teacherId;

    await this.notificationService.pushNotification(
      titleNotification,
      notificationType,
      data,
      receiverId,
    );
  }

  async teacherViewGradeReview(currentUserId: number) {
    this.logger.log('Teacher view grade review');

    const classes = await this.classRepository.find({
      where: { isActive: true },
      relations: ['teachers.teacher', 'students.student'],
    });

    const classIds = classes
      .filter((classDetail) => classDetail.isTeacher(currentUserId))
      .map((classDetail) => classDetail.id);

    const result = [];

    for (const classId of classIds) {
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

      for (const gradeReview of gradeReviews) {
        const student = classes
          .find((classDetail) => classDetail.id == classId)
          .students.find(
            (studentDetail) => studentDetail.studentId == gradeReview.studentId,
          );

        gradeReview['avatar'] = student
          ? student.student
            ? student.student.avatar
            : null
          : null;
      }

      result.push({
        classId,
        className: classes.find((classDetail) => classDetail.id == classId)
          .name,
        reviews: gradeReviews,
      });
    }

    return result;
  }

  async teacherReviewGradeReview(reviewVM: ReviewVM, currentUserId: number) {
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

    gradeReview.markAsReviewed();

    if (reviewVM.isApprove) {
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
    const classId = gradeComposition.classId;
    const titleNotification = `Teacher review grade review for assignment ${findAssignment.name}`;
    const notificationType = NotificationType.REVIEW_REQUEST;
    const data = { classId, assignmentId: findAssignment.id };
    const studentAccount = await this.studentRepository.findOne({
      where: {
        studentId: gradeReview.studentId,
        classId,
      },
    });
    const receiverId = studentAccount.userId;

    await this.notificationService.pushNotification(
      titleNotification,
      notificationType,
      data,
      receiverId,
    );
  }

  async commentInGradeReview(
    gradeReviewComment: GradeReviewComment,
    currentUserId: number,
  ) {
    this.logger.log('Comment in grade review');

    const gradeReview = await this.gradeReviewRepository.findOne({
      where: {
        id: gradeReviewComment.gradeReviewId,
      },
    });

    if (!gradeReview) {
      throw new EntityNotFoundException('Grade review not found');
    }

    const assignment = await this.assignmentRepository.findOne({
      where: {
        id: gradeReview.assignmentId,
      },
    });

    if (!assignment) {
      throw new EntityNotFoundException('Assignment not found');
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

    const findClass = await this.classRepository.findOne({
      where: {
        id: gradeComposition.classId,
      },
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!findClass) {
      throw new EntityNotFoundException('Class not found');
    }

    if (!findClass.hasMember(currentUserId)) {
      throw new EntityNotFoundException('You are not in this class');
    }

    const student = await this.studentRepository.findOne({
      where: {
        studentId: gradeReview.studentId,
        classId: findClass.id,
      },
    });

    gradeReviewComment.byUser(currentUserId);

    await this.gradeReviewComment.save(gradeReviewComment);

    const titleNotification = findClass.isTeacher(currentUserId)
      ? `Teacher comment in grade review for assignment ${assignment.name}`
      : `Student comment in grade review for assignment ${assignment.name}`;
    const notificationType = NotificationType.REVIEW_COMMENT;
    const data = { classId: findClass.id, assignmentId: assignment.id };
    const receiverId = findClass.isTeacher(currentUserId)
      ? student
        ? student.userId
        : null
      : gradeReview.teacherId;

    await this.notificationService.pushNotification(
      titleNotification,
      notificationType,
      data,
      receiverId,
    );
  }

  async viewGradeReviewDetail(currentUserId: number, gradeReviewId: number) {
    this.logger.log('Student view review of teacher');

    const gradeReview = await this.gradeReviewRepository.findOne({
      where: {
        id: gradeReviewId,
      },
      relations: ['assignment'],
    });

    if (!gradeReview) {
      throw new EntityNotFoundException('Grade review not found');
    }

    const assignment = await this.assignmentRepository.findOne({
      where: {
        id: gradeReview.assignmentId,
      },
    });

    if (!assignment) {
      throw new EntityNotFoundException('Assignment not found');
    }

    const gradeComposition = await this.gradeComposition.findOne({
      where: {
        id: assignment.gradeCompositionId,
      },
    });

    if (!gradeComposition) {
      throw new EntityNotFoundException('Grade composition not found');
    }

    const findClass = await this.classRepository.findOne({
      where: {
        id: gradeComposition.classId,
      },
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!findClass) {
      throw new EntityNotFoundException('Class not found');
    }

    const student = findClass.students.find(
      (studentDetail) => studentDetail.studentId == gradeReview.studentId,
    );

    if (!student) {
      throw new EntityNotFoundException('Student not found');
    }

    if (
      gradeReview.teacherId != currentUserId &&
      student.userId != currentUserId
    ) {
      throw new EntityNotFoundException('You are not in this grade review');
    }

    gradeReview['avatar'] = student
      ? student.student
        ? student.student.avatar
        : null
      : null;

    gradeReview['className'] = findClass.name;
    gradeReview['nameOfStudent'] = student
      ? student.student
        ? student.student.name
        : null
      : null;

    const comments = await this.gradeReviewComment.find({
      where: {
        gradeReviewId,
      },
      relations: ['user'],
    });

    return {
      info: gradeReview,
      comments,
      gradeComposition,
    };
  }
}
