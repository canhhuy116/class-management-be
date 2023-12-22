import { Injectable } from '@nestjs/common';
import { IRepository } from './IRepository';
import { ClassStudent } from 'domain/models/ClassStudent';

@Injectable()
export abstract class IStudentRepository extends IRepository<ClassStudent> {}
