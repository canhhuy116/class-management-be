import { Class } from 'domain/models/Class';
import { EntitySchema } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ClassStudent } from 'domain/models/ClassStudent';
import { ClassTeacher } from 'domain/models/ClassTeacher';

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
    ownerId: {
      type: Number,
      name: 'owner_id',
    },
    backgroundImage: {
      type: String,
      name: 'background_image',
      nullable: true,
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {
    ownerId: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'owner_id',
      },
    },
    students: {
      type: 'one-to-many',
      target: () => ClassStudent,
      inverseSide: 'class',
      cascade: true,
    },
    teachers: {
      type: 'one-to-many',
      target: () => ClassTeacher,
      inverseSide: 'class',
      cascade: true,
    },
  },
});
