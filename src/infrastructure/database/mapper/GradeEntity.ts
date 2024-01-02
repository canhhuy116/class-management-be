import { BaseEntity } from './BaseEntity';
import { Grade } from 'domain/models/Grade';
import { EntitySchema } from 'typeorm';

export const GradeEntity = new EntitySchema<Grade>({
  name: 'Grade',
  tableName: 'grades',
  target: Grade,
  columns: {
    ...BaseEntity,
    value: {
      type: Number,
    },
    studentId: {
      type: String,
      name: 'student_id',
    },
    assignmentId: {
      type: Number,
      name: 'assignment_id',
    },
    teacherId: {
      type: Number,
      name: 'teacher_id',
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {
    teacherId: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'teacher_id',
      },
    },
    assignmentId: {
      type: 'many-to-one',
      target: 'Assignment',
      joinColumn: {
        name: 'assignment_id',
      },
    },
  },
});
