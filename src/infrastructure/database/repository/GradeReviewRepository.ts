import { Injectable } from '@nestjs/common';
import { BaseRepository } from './BaseRepository';
import { EntityManager } from 'typeorm';
import { GradeReview } from 'domain/models/GradeReview';
import { IGradeReviewRepository } from 'application/ports/IGradeReviewRepository';
import { GradeReviewEntity } from '../mapper/GradeReviewEntity';

@Injectable()
export class GradeReviewRepository
  extends BaseRepository<GradeReview>
  implements IGradeReviewRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, GradeReviewEntity);
  }
}
