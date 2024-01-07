import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ISeederService } from 'application/ports/ISeederService';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { UsersRepository } from 'infrastructure/database/repository/UserRepository';
import { SeederService } from 'infrastructure/service/SeederService';

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: ISeederService, useClass: SeederService },
    { provide: IUsersRepository, useClass: UsersRepository },
  ],
  exports: [ISeederService],
})
export class SeederModule {}
