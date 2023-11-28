import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { User } from 'domain/models/User';
import { Connection } from 'typeorm';
import { UserEntity } from '../mapper/UserEntity';
import { BaseRepository } from './BaseRepository';

@Injectable()
export class UsersRepository
  extends BaseRepository<User>
  implements IUsersRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, UserEntity);
  }
}
