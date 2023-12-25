import { BaseModel } from './BaseModel';
import { Class } from './Class';
import { User } from './User';

export class ClassStudent extends BaseModel {
  classId: number;
  class?: Class;
  userId: number;
  student?: User;
  studentId: string;
  fullName?: string;

  constructor(
    classId: number,
    userId?: number,
    studentId?: string,
    fullName?: string,
  ) {
    super();
    this.classId = classId;
    this.userId = userId;
    this.studentId = studentId;
    this.fullName = fullName;
  }

  setFullName(fullName: string) {
    this.fullName = fullName;
    return this;
  }
}
