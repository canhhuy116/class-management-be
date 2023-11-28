import { Injectable } from '@nestjs/common';
import { IRepository } from './IRepository';
import { User } from 'domain/models/User';

@Injectable()
export abstract class IUsersRepository extends IRepository<User> {}
