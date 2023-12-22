import { BaseEntity } from './BaseEntity';
import { ClassTeacher } from 'domain/models/ClassTeacher';
import { EntitySchema } from 'typeorm';

export const TeacherEntity = new EntitySchema<ClassTeacher>({
  name: 'ClassTeacher',
  tableName: 'teacher_classes',
  target: ClassTeacher,
  columns: {
    ...BaseEntity,
    classId: {
      type: Number,
      name: 'class_id',
    },
    userId: {
      type: Number,
      name: 'user_id',
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
    teacher: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
      },
    },
  },
});
