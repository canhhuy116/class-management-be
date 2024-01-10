import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { ClassStudent } from 'domain/models/ClassStudent';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { StudentEntity } from '../mapper/StudentEntity';

@Injectable()
export class StudentRepository
  extends BaseRepository<ClassStudent>
  implements IStudentRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, StudentEntity);
  }
}
