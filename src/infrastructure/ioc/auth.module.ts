import { Module } from '@nestjs/common';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { UsersRepository } from 'infrastructure/database/repository/UserRepository';
import { AuthController } from 'presentation/controllers/AuthController';
import { MailModule } from './mail.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'infrastructure/guards/JwtStrategy';
import { GoogleStrategy } from 'infrastructure/guards/GoogleStrategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: {
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
    MailModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthUseCase,
    { provide: IUsersRepository, useClass: UsersRepository },
    JwtStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
