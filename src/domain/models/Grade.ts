import { BaseModel } from './BaseModel';

export class Grade extends BaseModel {
  value: number;
  studentId: string;
  assignmentId: number;
  teacherId: number;

  constructor(value: number, studentId: string, assignmentId: number) {
    super();
    this.value = value;
    this.studentId = studentId;
    this.assignmentId = assignmentId;
  }

  byTeacher(teacherId: number) {
    this.teacherId = teacherId;

    return this;
  }

  updateValue(value: number) {
    this.value = value;

    return this;
  }
}
