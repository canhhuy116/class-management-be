import { BaseEntity } from './BaseEntity';
import { Assignment } from 'domain/models/Assignment';
import { EntitySchema } from 'typeorm';

export const AssignmentEntity = new EntitySchema<Assignment>({
  name: 'Assignment',
  tableName: 'assignments',
  target: Assignment,
  columns: {
    ...BaseEntity,
    name: {
      type: String,
      length: 100,
    },
    maxScore: {
      type: Number,
      name: 'max_score',
    },
    gradeCompositionId: {
      type: Number,
      name: 'grade_composition_id',
    },
  },
  relations: {
    gradeCompositionId: {
      type: 'many-to-one',
      target: 'GradeComposition',
      joinColumn: {
        name: 'grade_composition_id',
      },
    },
  },
});
