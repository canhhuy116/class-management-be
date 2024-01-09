import { Injectable } from '@nestjs/common';
import { GradeReviewComment } from 'domain/models/GradeReviewComment';
import { IRepository } from './IRepository';

@Injectable()
export abstract class IGradeReviewCommentRepository extends IRepository<GradeReviewComment> {}
