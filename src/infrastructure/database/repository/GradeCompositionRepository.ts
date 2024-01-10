import { Injectable } from '@nestjs/common';
import { BaseRepository } from './BaseRepository';
import { EntityManager } from 'typeorm';
import { GradeComposition } from 'domain/models/GradeComposition';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { GradeCompositionEntity } from '../mapper/GradeCompositionEntity';

@Injectable()
export class GradeCompositionRepository
  extends BaseRepository<GradeComposition>
  implements IGradeCompositionRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, GradeCompositionEntity);
  }
}
