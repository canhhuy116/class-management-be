import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { Assignment } from './../../../domain/models/Assignment';
import { AssignmentEntity } from '../mapper/AssignmentEntity';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BaseRepository } from './BaseRepository';

@Injectable()
export class AssignmentRepository
  extends BaseRepository<Assignment>
  implements IAssignmentRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, AssignmentEntity);
  }
}
