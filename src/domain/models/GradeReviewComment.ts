import { BaseModel } from './BaseModel';
import { User } from './User';

export class GradeReviewComment extends BaseModel {
  gradeReviewId: number;
  userId: number;
  message: string;
  user: User;

  constructor(gradeReviewId: number, message: string) {
    super();
    this.gradeReviewId = gradeReviewId;
    this.message = message;
  }

  byUser(userId: number) {
    this.userId = userId;
  }
}
