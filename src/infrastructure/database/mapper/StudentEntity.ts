import { BaseEntity } from './BaseEntity';
import { ClassStudent } from 'domain/models/ClassStudent';
import { EntitySchema } from 'typeorm';

export const StudentEntity = new EntitySchema<ClassStudent>({
  name: 'ClassStudent',
  tableName: 'student_classes',
  target: ClassStudent,
  columns: {
    ...BaseEntity,
    classId: {
      type: Number,
      name: 'class_id',
    },
    userId: {
      type: Number,
      nullable: true,
      name: 'user_id',
    },
    studentId: {
      type: String,
      nullable: true,
      name: 'student_id',
    },
    fullName: {
      type: String,
      nullable: true,
      name: 'full_name',
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {
    class: {
      type: 'many-to-one',
      target: 'Class',
      joinColumn: {
        name: 'class_id',
      },
    },
    student: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
      },
    },
  },
});
