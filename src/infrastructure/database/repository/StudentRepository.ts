import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { ClassStudent } from 'domain/models/ClassStudent';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { StudentEntity } from '../mapper/StudentEntity';

@Injectable()
export class StudentRepository
  extends BaseRepository<ClassStudent>
  implements IStudentRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, StudentEntity);
  }
}
