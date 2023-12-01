import { Module } from '@nestjs/common';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { UsersRepository } from 'infrastructure/database/repository/UserRepository';
import { AuthController } from 'presentation/controllers/AuthController';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthUseCase,
    { provide: IUsersRepository, useClass: UsersRepository },
  ],
})
export class AuthModule {}
