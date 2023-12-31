import { Module } from '@nestjs/common';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { UsersUseCases } from 'application/usecases/UserUseCase';
import { UsersRepository } from 'infrastructure/database/repository/UserRepository';
import { UsersController } from 'presentation/controllers/UserController';
import { StorageModule } from './storage.module';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { StudentRepository } from 'infrastructure/database/repository/StudentRepository';
import { NotificationModule } from './notification.module';

@Module({
  imports: [StorageModule, NotificationModule],
  controllers: [UsersController],
  providers: [
    UsersUseCases,
    { provide: IUsersRepository, useClass: UsersRepository },
    { provide: IStudentRepository, useClass: StudentRepository },
  ],
})
export class UsersModule {}
