import { Module } from '@nestjs/common';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { UsersRepository } from 'infrastructure/database/repository/UserRepository';
import { AuthController } from 'presentation/controllers/AuthController';
import { MailModule } from './mail.module';
import { JwtService } from 'infrastructure/service/JwtService';
import { ConfigModule } from '@nestjs/config';
import { IJwtService } from 'application/ports/IJwtService';

@Module({
  imports: [MailModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthUseCase,
    { provide: IUsersRepository, useClass: UsersRepository },
    { provide: IJwtService, useClass: JwtService },
  ],
})
export class AuthModule {}
