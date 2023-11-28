import { Module } from '@nestjs/common';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { UsersUseCases } from 'application/usecases/UserUseCase';
import { UsersRepository } from 'infrastructure/database/repository/UserRepository';

import { UsersController } from 'presentation/controllers/UserController';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersUseCases,
    { provide: IUsersRepository, useClass: UsersRepository },
  ],
})
export class UsersModule {}
