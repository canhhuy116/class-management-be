import { Injectable } from '@nestjs/common';
import { IRepository } from './IRepository';
import { GradeComposition } from 'domain/models/GradeComposition';

@Injectable()
export abstract class IGradeCompositionRepository extends IRepository<GradeComposition> {}
