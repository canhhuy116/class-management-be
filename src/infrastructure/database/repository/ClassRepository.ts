import { Injectable } from '@nestjs/common';
import { BaseRepository } from './BaseRepository';
import { Class } from 'domain/models/Class';
import { IClassRepository } from 'application/ports/IClassRepository';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ClassEntity } from '../mapper/ClassEntity';

@Injectable()
export class ClassRepository
  extends BaseRepository<Class>
  implements IClassRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, ClassEntity);
  }
}
