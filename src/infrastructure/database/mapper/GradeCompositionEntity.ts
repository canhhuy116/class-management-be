import { GradeComposition } from 'domain/models/GradeComposition';
import { EntitySchema } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export const GradeCompositionEntity = new EntitySchema<GradeComposition>({
  name: 'GradeComposition',
  tableName: 'grade_compositions',
  target: GradeComposition,
  columns: {
    ...BaseEntity,
    name: {
      type: String,
      length: 100,
    },
    weight: {
      type: Number,
    },
    classId: {
      type: Number,
      name: 'class_id',
    },
    priority: {
      type: Number,
    },
    viewable: {
      type: Boolean,
      default: false,
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {
    classId: {
      type: 'many-to-one',
      target: 'Class',
      joinColumn: {
        name: 'class_id',
      },
    },
  },
});
