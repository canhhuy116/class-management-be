import { Injectable } from '@nestjs/common';
import { Assignment } from 'domain/models/Assignment';
import { IRepository } from './IRepository';

@Injectable()
export abstract class IAssignmentRepository extends IRepository<Assignment> {}
