import { IGradeReviewCommentRepository } from 'application/ports/IGradeReviewCommentRepository';
import { GradeReviewCommentEntity } from '../mapper/GradeReviewCommentEntity';
import { GradeReviewComment } from 'domain/models/GradeReviewComment';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './BaseRepository';

@Injectable()
export class GradeReviewCommentRepository
  extends BaseRepository<GradeReviewComment>
  implements IGradeReviewCommentRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, GradeReviewCommentEntity);
  }
}
