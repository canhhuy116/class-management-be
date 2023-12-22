import { User } from './User';
import { BaseModel } from './BaseModel';
import { ClassTeacher } from './ClassTeacher';
import { ClassStudent } from './ClassStudent';

export class Class extends BaseModel {
  name: string;

  ownerId: number;

  description?: string;

  teachers?: ClassTeacher[];

  students?: ClassStudent[];

  constructor(name: string, ownerId: number, description?: string) {
    super();
    this.name = name;
    this.ownerId = ownerId;
    this.description = description;
  }

  addTeacher(teacher: User) {
    if (!this.teachers) {
      this.teachers = [];
    }

    const classTeacher = new ClassTeacher(teacher);

    this.teachers.push(classTeacher);
  }

  addStudent(student: User, studentId: string) {
    if (!this.students) {
      this.students = [];
    }

    const classStudent = new ClassStudent(this.id, student.id, studentId);

    this.students.push(classStudent);
  }

  hasMember(userId: number): boolean {
    if (this.ownerId === userId) {
      return true;
    }

    if (
      this.teachers?.some((classTeacher) => classTeacher.teacher.id === userId)
    ) {
      return true;
    }

    if (
      this.students?.some((classStudent) => classStudent.student.id === userId)
    ) {
      return true;
    }

    return false;
  }

  isOwner(userId: number): boolean {
    return this.ownerId === userId;
  }

  isTeacher(userId: number): boolean {
    return this.teachers?.some((teacher) => teacher.teacher.id === userId);
  }
}
