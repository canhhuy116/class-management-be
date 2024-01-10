import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptions,
  ObjectId,
  FindOneOptions,
  DeepPartial,
  SaveOptions,
  UpdateResult,
  DeleteResult,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class IRepository<Entity> {
  abstract save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
  ): Promise<T[]>;

  abstract save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;

  abstract save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;

  abstract save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;

  abstract save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]>;

  abstract update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult>;

  abstract delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Entity>,
  ): Promise<DeleteResult>;

  abstract count(options?: FindManyOptions<Entity>): Promise<number>;

  abstract count(conditions?: FindOptions<Entity>): Promise<number>;

  abstract count(
    optionsOrConditions?: FindManyOptions<Entity> | FindOptions<Entity>,
  ): Promise<number>;

  abstract find(options?: FindManyOptions<Entity>): Promise<Entity[]>;

  abstract find(conditions?: FindOptions<Entity>): Promise<Entity[]>;

  abstract find(
    optionsOrConditions?: FindManyOptions<Entity> | FindOptions<Entity>,
  ): Promise<Entity[]>;

  abstract findOne(
    options?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined>;

  abstract transaction<T>(operation: () => Promise<T>): Promise<T>;
}
