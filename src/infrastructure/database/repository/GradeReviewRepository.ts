import { Injectable } from '@nestjs/common';
import { BaseRepository } from './BaseRepository';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { GradeReview } from 'domain/models/GradeReview';
import { IGradeReviewRepository } from 'application/ports/IGradeReviewRepository';
import { GradeReviewEntity } from '../mapper/GradeReviewEntity';

@Injectable()
export class GradeRepository
  extends BaseRepository<GradeReview>
  implements IGradeReviewRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, GradeReviewEntity);
  }
}
