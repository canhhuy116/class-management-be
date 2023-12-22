import { Injectable } from '@nestjs/common';
import { IRepository } from './IRepository';
import { ClassTeacher } from 'domain/models/ClassTeacher';

@Injectable()
export abstract class ITeacherRepository extends IRepository<ClassTeacher> {}
