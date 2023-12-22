import { BaseModel } from './BaseModel';
import { Class } from './Class';
import { User } from './User';

export class ClassTeacher extends BaseModel {
  classId: number;
  class?: Class;
  userId: number;
  teacher?: User;

  constructor(teacher: User) {
    super();
    this.teacher = teacher;
  }
}
