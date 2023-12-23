import { BaseModel } from './BaseModel';

export class Grade extends BaseModel {
  value: number;
  studentId: number;
  gradeCompositionId: number;
  teacherId: number;

  constructor(
    value: number,
    studentId: number,
    gradeCompositionId: number,
    teacherId: number,
  ) {
    super();
    this.value = value;
    this.studentId = studentId;
    this.gradeCompositionId = gradeCompositionId;
    this.teacherId = teacherId;
  }
}
