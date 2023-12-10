import { IEntity } from 'domain/shared/IEntity';
import { User } from './User';

export class Class implements IEntity {
  id?: number;

  name: string;

  ownerId: number;

  description?: string;

  teachers?: User[];

  students?: User[];

  createdAt?: Date;

  updatedAt?: Date;

  constructor(name: string, ownerId: number, description?: string) {
    this.name = name;
    this.ownerId = ownerId;
    this.description = description;
  }

  equals(entity: IEntity) {
    if (!(entity instanceof Class)) return false;

    return this.id === entity.id;
  }

  addTeacher(teacher: User) {
    if (!this.teachers) {
      this.teachers = [];
    }

    this.teachers.push(teacher);
  }

  addStudent(student: User) {
    if (!this.students) {
      this.students = [];
    }

    this.students.push(student);
  }
}
