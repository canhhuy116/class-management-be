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
  InsertResult,
  RemoveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class IRepository<Entity> {
  abstract hasId(entity: Entity): boolean;

  abstract getId(entity: Entity): any;

  abstract create(): Entity;

  abstract create(entityLikeArray: DeepPartial<Entity>[]): Entity[];

  abstract create(entityLike: DeepPartial<Entity>): Entity;

  abstract create(
    plainEntityLikeOrPlainEntityLikes?:
      | DeepPartial<Entity>
      | DeepPartial<Entity>[],
  ): Entity | Entity[];

  abstract merge(
    mergeIntoEntity: Entity,
    ...entityLikes: DeepPartial<Entity>[]
  ): Entity;

  abstract preload(
    entityLike: DeepPartial<Entity>,
  ): Promise<Entity | undefined>;

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

  abstract remove(
    entities: Entity[],
    options?: RemoveOptions,
  ): Promise<Entity[]>;

  abstract remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;

  abstract remove(
    entityOrEntities: Entity | Entity[],
    options?: RemoveOptions,
  ): Promise<Entity | Entity[]>;

  abstract softRemove<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
  ): Promise<T[]>;

  abstract softRemove<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;

  abstract softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;

  abstract softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;

  abstract softRemove<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]>;

  abstract recover<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
  ): Promise<T[]>;

  abstract recover<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;

  abstract recover<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;

  abstract recover<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;

  abstract recover<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]>;

  abstract insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult>;

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
      | FindOptions<Entity>,
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
      | FindOptions<Entity>,
  ): Promise<DeleteResult>;

  abstract softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptions<Entity>,
  ): Promise<UpdateResult>;

  abstract restore(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptions<Entity>,
  ): Promise<UpdateResult>;

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

  abstract findAndCount(
    options?: FindManyOptions<Entity>,
  ): Promise<[Entity[], number]>;

  abstract findAndCount(
    conditions?: FindOptions<Entity>,
  ): Promise<[Entity[], number]>;

  abstract findAndCount(
    optionsOrConditions?: FindManyOptions<Entity> | FindOptions<Entity>,
  ): Promise<[Entity[], number]>;

  abstract findByIds(
    ids: any[],
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]>;

  abstract findByIds(
    ids: any[],
    conditions?: FindOptions<Entity>,
  ): Promise<Entity[]>;

  abstract findByIds(
    ids: any[],
    optionsOrConditions?: FindManyOptions<Entity> | FindOptions<Entity>,
  ): Promise<Entity[]>;

  abstract findOne(
    id?: string | number | Date | ObjectId,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined>;

  abstract findOne(
    options?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined>;

  abstract findOne(
    conditions?: FindOptions<Entity>,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined>;

  abstract findOne(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectId
      | FindOneOptions<Entity>
      | FindOptions<Entity>,
    maybeOptions?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined>;

  abstract findOneOrFail(options?: FindOneOptions<Entity>): Promise<Entity>;

  abstract findOneOrFail(
    conditions?: FindOptions<Entity>,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity>;

  abstract findOneOrFail(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectId
      | FindOneOptions<Entity>
      | FindOptions<Entity>,
    maybeOptions?: FindOneOptions<Entity>,
  ): Promise<Entity>;

  abstract query(query: string, parameters?: any[]): Promise<any>;

  abstract clear(): Promise<void>;

  abstract increment(
    conditions: FindOptions<Entity>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult>;

  abstract decrement(
    conditions: FindOptions<Entity>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult>;

  abstract transaction<T>(operation: () => Promise<T>): Promise<T>;
}
