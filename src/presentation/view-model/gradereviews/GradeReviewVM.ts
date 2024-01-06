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

  static toViewModel(gradeReview: GradeReview): GradeReviewVM {
    const gradeReviewVM = plainToClass(GradeReviewVM, gradeReview, {
      excludeExtraneousValues: true,
    });

    gradeReviewVM.assignmentName = gradeReview['assignment']
      ? gradeReview['assignment'].name
      : null;

    return gradeReviewVM;
  }
}
