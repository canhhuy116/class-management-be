import { Injectable } from '@nestjs/common';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { User } from 'domain/models/User';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { UserEntity } from '../mapper/UserEntity';

@Injectable()
export class UsersRepository
  extends BaseRepository<User>
  implements IUsersRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, UserEntity);
  }
}
