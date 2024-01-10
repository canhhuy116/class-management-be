import { Injectable } from '@nestjs/common';
import { BaseRepository } from './BaseRepository';
import { Class } from 'domain/models/Class';
import { IClassRepository } from 'application/ports/IClassRepository';
import { EntityManager } from 'typeorm';
import { ClassEntity } from '../mapper/ClassEntity';

@Injectable()
export class ClassRepository
  extends BaseRepository<Class>
  implements IClassRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, ClassEntity);
  }

  // findOneByAdmin(option: FindOneOptions<Class>): Promise<Class> {
  //   return this.manager.findOne(this.entitySchema as any, option);
  // }

  // findOne(
  //   optionsOrConditions?:
  //     | string
  //     | number
  //     | Date
  //     | ObjectId
  //     | FindOneOptions<Class>
  //     | FindOptions<Class>,
  // ): Promise<Class | undefined> {
  //   let conditions: FindOptions<Class> | undefined;
  //   let options: FindOneOptions<Class> | undefined;

  //   if (
  //     typeof optionsOrConditions === 'object' &&
  //     optionsOrConditions !== null
  //   ) {
  //     if ('where' in optionsOrConditions) {
  //       // If optionsOrConditions is an object with a 'where' property, it's a FindOneOptions<Class> object
  //       options = optionsOrConditions as FindOneOptions<Class>;
  //       options.where = { ...options.where, isActive: true };
  //     } else {
  //       // If optionsOrConditions is an object without a 'where' property, it's a FindOptions<Class> object
  //       conditions = optionsOrConditions as FindOptions<Class>;
  //       conditions = { ...conditions };
  //     }
  //   } else {
  //     // If optionsOrConditions is not an object, it's an id
  //     options = { where: { isActive: true } };
  //   }

  //   return this.manager.findOne(
  //     this.entitySchema as any,
  //     optionsOrConditions as any,
  //   );
  // }

  // find(optionsOrConditions?: FindManyOptions<Class>): Promise<Class[]> {
  //   if ('where' in optionsOrConditions) {
  //     optionsOrConditions.where = {
  //       ...optionsOrConditions.where,
  //       isActive: true,
  //     };
  //   } else {
  //     optionsOrConditions = {
  //       ...optionsOrConditions,
  //       where: { isActive: true },
  //     };
  //   }

  //   return this.manager.find(this.entitySchema as any, optionsOrConditions);
  // }

  // findByAdmin(option: FindManyOptions<Class>): Promise<Class[]> {
  //   return this.manager.find(this.entitySchema as any, option);
  // }
}
