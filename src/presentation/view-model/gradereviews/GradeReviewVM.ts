import { Expose, plainToClass } from 'class-transformer';
import { GradeReview } from 'domain/models/GradeReview';

export class GradeReviewVM {
  @Expose()
  id: number;

  @Expose()
  assignmentId: number;

  @Expose()
  assignmentName: string;

  @Expose()
  studentId: string;

  @Expose()
  value: number;

  @Expose()
  expectedValue: number;

  @Expose()
  message: string;

  @Expose()
  time: Date;

  @Expose()
  avatar: string;

  @Expose()
  currentGrade: number;

  static toViewModel(gradeReview: GradeReview): GradeReviewVM {
    const gradeReviewVM = plainToClass(GradeReviewVM, gradeReview, {
      excludeExtraneousValues: true,
    });

    gradeReviewVM.time = gradeReview.createdAt;

    gradeReviewVM.assignmentName = gradeReview['assignment']
      ? gradeReview['assignment'].name
      : null;

    return gradeReviewVM;
  }
}
