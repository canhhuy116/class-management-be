import { ClassUseCases } from 'application/usecases/ClassUseCase';
import { UsersUseCases } from 'application/usecases/UserUseCase';
import {
  AdminClassController,
  AdminUsersController,
} from 'presentation/controllers/AdminController';
import { UsersModule } from './user.module';
import { Module } from '@nestjs/common';
import { ClassModule } from './class.module';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { UsersRepository } from 'infrastructure/database/repository/UserRepository';
import { AdminUseCases } from 'application/usecases/AdminUseCase';
import { IClassRepository } from 'application/ports/IClassRepository';
import { ClassRepository } from 'infrastructure/database/repository/ClassRepository';
import { IExcelService } from 'application/ports/IExcelService';
import { ExcelService } from 'infrastructure/service/ExcelService';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { StudentRepository } from 'infrastructure/database/repository/StudentRepository';

@Module({
  imports: [],
  controllers: [AdminUsersController, AdminClassController],
  providers: [
    AdminUseCases,
    { provide: IUsersRepository, useClass: UsersRepository },
    { provide: IClassRepository, useClass: ClassRepository },
    { provide: IExcelService, useClass: ExcelService },
    { provide: IStudentRepository, useClass: StudentRepository },
  ],
})
export class AdminModule {}
