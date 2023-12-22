import { BaseModel } from './BaseModel';
import { Class } from './Class';
import { User } from './User';

export class ClassStudent extends BaseModel {
  classId: number;
  class?: Class;
  userId: number;
  student?: User;
  studentId: string;

  constructor(classId: number, userId: number, studentId: string) {
    super();
    this.classId = classId;
    this.userId = userId;
    this.studentId = studentId;
  }
}
