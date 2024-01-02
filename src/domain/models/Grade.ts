import { BaseModel } from './BaseModel';

export class Grade extends BaseModel {
  value: number;
  studentId: number;
  assignmentId: number;
  teacherId: number;

  constructor(
    value: number,
    studentId: number,
    assignmentId: number,
    teacherId: number,
  ) {
    super();
    this.value = value;
    this.studentId = studentId;
    this.assignmentId = assignmentId;
    this.teacherId = teacherId;
  }
}
