import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { Assignment } from './../../../domain/models/Assignment';
import { AssignmentEntity } from '../mapper/AssignmentEntity';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './BaseRepository';

@Injectable()
export class AssignmentRepository
  extends BaseRepository<Assignment>
  implements IAssignmentRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, AssignmentEntity);
  }
}
