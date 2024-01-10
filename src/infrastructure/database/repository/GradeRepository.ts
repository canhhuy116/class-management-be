import { Injectable } from '@nestjs/common';
import { BaseRepository } from './BaseRepository';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { Grade } from 'domain/models/Grade';
import { IGradeRepository } from 'application/ports/IGradeRepository';
import { GradeEntity } from '../mapper/GradeEntity';

@Injectable()
export class GradeRepository
  extends BaseRepository<Grade>
  implements IGradeRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, GradeEntity);
  }
}
