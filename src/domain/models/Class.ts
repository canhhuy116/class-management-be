import { User } from './User';
import { BaseModel } from './BaseModel';
import { ClassTeacher } from './ClassTeacher';
import { ClassStudent } from './ClassStudent';
import { ApiProperty } from '@nestjs/swagger';

export class Class extends BaseModel {
  name: string;

  ownerId: number;

  description?: string;

  isActive: boolean;

  teachers?: ClassTeacher[];

  students?: ClassStudent[];

  backgroundImage?: string;

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
      this.teachers?.some((classTeacher) => classTeacher.teacher?.id === userId)
    ) {
      return true;
    }

    if (
      this.students?.some((classStudent) => classStudent.student?.id === userId)
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

  isStudent(userId: number): boolean {
    return this.students?.some((student) => student.student?.id === userId);
  }

  findStudent(studentId: string): ClassStudent | undefined {
    return this.students?.find((student) => student?.studentId === studentId);
  }

  inactive() {
    this.isActive = false;
  }

  active() {
    this.isActive = true;
  }
}

export class FilterClass {
  @ApiProperty({
    description: 'The field to sort',
    required: false,
    enum: ['name', 'createdAt'],
  })
  sortField?: string;

  @ApiProperty({
    description: 'Sort ascending or descending',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  order?: 'ASC' | 'DESC';
}
