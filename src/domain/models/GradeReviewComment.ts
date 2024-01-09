import { BaseModel } from './BaseModel';

export class GradeReviewComment extends BaseModel {
  gradeReviewId: number;
  userId: number;
  message: string;

  constructor(gradeReviewId: number, message: string) {
    super();
    this.gradeReviewId = gradeReviewId;
    this.message = message;
  }

  byUser(userId: number) {
    this.userId = userId;
  }
}
