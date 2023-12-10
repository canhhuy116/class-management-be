import { Injectable } from '@nestjs/common';
import { IRepository } from './IRepository';
import { Class } from 'domain/models/Class';

@Injectable()
export abstract class IClassRepository extends IRepository<Class> {}
