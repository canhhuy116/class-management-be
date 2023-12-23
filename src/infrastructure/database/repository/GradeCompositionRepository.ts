import { Injectable } from '@nestjs/common';
import { BaseRepository } from './BaseRepository';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { GradeComposition } from 'domain/models/GradeComposition';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { GradeCompositionEntity } from '../mapper/GradeCompositionEntity';

@Injectable()
export class GradeCompositionRepository
  extends BaseRepository<GradeComposition>
  implements IGradeCompositionRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, GradeCompositionEntity);
  }
}
