import { Assignment } from './Assignment';
import { BaseModel } from './BaseModel';

export class GradeReview extends BaseModel {
  assignmentId: number;
  studentId: string;
  teacherId: number;
  value: number;
  expectedValue: number;
  message: string;
  isReviewed: boolean;
  assignment: Assignment;

  constructor(assignmentId: number, expectedValue: number, message: string) {
    super();
    this.expectedValue = expectedValue;
    this.assignmentId = assignmentId;
    this.message = message;
  }

  requestTo(teacherId: number) {
    this.teacherId = teacherId;

    return this;
  }

  forStudent(studentId: string) {
    this.studentId = studentId;

    return this;
  }

  withCurrentValue(value: number) {
    this.value = value;

    return this;
  }

  markAsReviewed() {
    this.isReviewed = true;

    return this;
  }
}
