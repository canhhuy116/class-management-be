import { Module } from '@nestjs/common';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IExcelService } from 'application/ports/IExcelService';
import { GradeManagementUseCase } from 'application/usecases/GradeManagementUseCase';
import { ClassRepository } from 'infrastructure/database/repository/ClassRepository';
import { ExcelService } from 'infrastructure/service/ExcelService';
import { GradeManagementController } from 'presentation/controllers/GradeManagementController';

@Module({
  imports: [],
  controllers: [GradeManagementController],
  providers: [
    GradeManagementUseCase,
    { provide: IClassRepository, useClass: ClassRepository },
    { provide: IExcelService, useClass: ExcelService },
  ],
})
export class GradeManagementModule {}
