import { Injectable } from '@nestjs/common';
import { IRepository } from 'application/ports/IRepository';
import {
  DeepPartial,
  DeleteResult,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { Repository, EntityManager } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class BaseRepository<Entity> implements IRepository<Entity> {
  protected readonly _entityRepository: Repository<Entity>;

  constructor(entityManager: EntityManager, entity: EntityTarget<Entity>) {
    this._entityRepository = entityManager.getRepository(entity);
  }

  async save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]> {
    return await this._entityRepository.save(entities, options);
  }

  async update(
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
  ): Promise<UpdateResult> {
    return await this._entityRepository.update(criteria, partialEntity);
  }

  async delete(
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
  ): Promise<DeleteResult> {
    return await this._entityRepository.delete(criteria);
  }

  async count(
    optionsOrConditions?: FindManyOptions<Entity> | FindOneOptions<Entity>,
  ): Promise<number> {
    return await this._entityRepository.count(optionsOrConditions);
  }

  async find(
    optionsOrConditions?: FindManyOptions<Entity> | FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return await this._entityRepository.find(optionsOrConditions);
  }

  async findOne(
    maybeOptions?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined> {
    return await this._entityRepository.findOne(maybeOptions);
  }

  async transaction<T>(operation: () => Promise<T>): Promise<T> {
    const queryRunner =
      this._entityRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
