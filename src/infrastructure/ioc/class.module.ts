import { Module } from '@nestjs/common';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IInvitationRepository } from 'application/ports/IInvitationRepository';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { ClassUseCases } from 'application/usecases/ClassUseCase';
import { ClassRepository } from 'infrastructure/database/repository/ClassRepository';
import { InvitationRepository } from 'infrastructure/database/repository/InvitationRepository';
import { UsersRepository } from 'infrastructure/database/repository/UserRepository';
import { ClassController } from 'presentation/controllers/ClassController';

@Module({
  imports: [],
  controllers: [ClassController],
  providers: [
    ClassUseCases,
    { provide: IClassRepository, useClass: ClassRepository },
    { provide: IUsersRepository, useClass: UsersRepository },
    { provide: IInvitationRepository, useClass: InvitationRepository },
  ],
})
export class ClassModule {}
