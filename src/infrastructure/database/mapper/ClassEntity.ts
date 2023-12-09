import { Class } from 'domain/models/Class';
import { EntitySchema } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export const ClassEntity = new EntitySchema<Class>({
  name: 'Class',
  tableName: 'classes',
  target: Class,
  columns: {
    ...BaseEntity,
    name: {
      type: String,
      length: 100,
    },
    description: {
      type: String,
      length: 100,
      nullable: true,
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {
    teachers: {
      type: 'many-to-many',
      target: 'User',
      joinTable: true,
      cascade: true,
      inverseSide: 'teachingClasses',
    },
    students: {
      type: 'many-to-many',
      target: 'User',
      joinTable: true,
      cascade: true,
      inverseSide: 'studyingClasses',
    },
  },
});
