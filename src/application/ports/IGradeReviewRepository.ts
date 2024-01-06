import { Injectable } from '@nestjs/common';
import { IRepository } from './IRepository';
import { GradeReview } from 'domain/models/GradeReview';

@Injectable()
export abstract class IGradeReviewRepository extends IRepository<GradeReview> {}
