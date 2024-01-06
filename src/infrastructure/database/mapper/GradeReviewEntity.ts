import { BaseEntity } from './BaseEntity';
import { GradeReview } from 'domain/models/GradeReview';
import { EntitySchema } from 'typeorm';

export const GradeReviewEntity = new EntitySchema<GradeReview>({
  name: 'GradeReview',
  tableName: 'grade_reviews',
  target: GradeReview,
  columns: {
    ...BaseEntity,
    assignmentId: {
      type: Number,
      name: 'assignment_id',
    },
    studentId: {
      type: String,
      name: 'student_id',
    },
    teacherId: {
      type: Number,
      name: 'teacher_id',
    },
    value: {
      type: Number,
    },
    expectedValue: {
      type: Number,
      name: 'expected_value',
    },
    message: {
      type: String,
    },
    isReviewed: {
      type: Boolean,
      name: 'is_reviewed',
      default: false,
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
    assignment: {
      type: 'many-to-one',
      target: 'Assignment',
      joinColumn: {
        name: 'assignment_id',
      },
    },
  },
});
