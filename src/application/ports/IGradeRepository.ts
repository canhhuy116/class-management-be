import { Injectable } from '@nestjs/common';
import { IRepository } from './IRepository';
import { Grade } from 'domain/models/Grade';

@Injectable()
export abstract class IGradeRepository extends IRepository<Grade> {}
