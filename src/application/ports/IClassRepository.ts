import { Injectable } from '@nestjs/common';
import { IRepository } from './IRepository';
import { Class } from 'domain/models/Class';
import { FindManyOptions, FindOneOptions, FindOptions } from 'typeorm';

@Injectable()
export abstract class IClassRepository extends IRepository<Class> {
  abstract findOneByAdmin(option: FindOneOptions<Class>): Promise<Class>;
  abstract findByAdmin(
    optionsOrConditions?: FindManyOptions<Class> | FindOptions<Class>,
  ): Promise<Class[]>;
}
