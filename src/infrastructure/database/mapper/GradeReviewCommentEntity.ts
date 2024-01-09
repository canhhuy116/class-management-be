import { GradeReviewComment } from 'domain/models/GradeReviewComment';
import { EntitySchema } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export const GradeReviewCommentEntity = new EntitySchema<GradeReviewComment>({
  name: 'GradeReviewComment',
  tableName: 'grade_review_comments',
  target: GradeReviewComment,
  columns: {
    ...BaseEntity,
    gradeReviewId: {
      type: Number,
      name: 'grade_review_id',
    },
    userId: {
      type: Number,
      name: 'user_id',
    },
    message: {
      type: String,
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {
    gradeReviewId: {
      type: 'many-to-one',
      target: 'GradeReview',
      joinColumn: {
        name: 'grade_review_id',
      },
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
      },
    },
  },
});
