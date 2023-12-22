import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { ClassTeacher } from 'domain/models/ClassTeacher';
import { ITeacherRepository } from 'application/ports/ITeacherRepository';
import { TeacherEntity } from '../mapper/TeacherEntity';

@Injectable()
export class TeacherRepository
  extends BaseRepository<ClassTeacher>
  implements ITeacherRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, TeacherEntity);
  }
}
