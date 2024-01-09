import { IGradeReviewCommentRepository } from 'application/ports/IGradeReviewCommentRepository';
import { GradeReviewCommentEntity } from '../mapper/GradeReviewCommentEntity';
import { GradeReviewComment } from 'domain/models/GradeReviewComment';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BaseRepository } from './BaseRepository';

@Injectable()
export class GradeReviewCommentRepository
  extends BaseRepository<GradeReviewComment>
  implements IGradeReviewCommentRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, GradeReviewCommentEntity);
  }
}
