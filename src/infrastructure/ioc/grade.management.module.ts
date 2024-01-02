import { Module } from '@nestjs/common';
import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IExcelService } from 'application/ports/IExcelService';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { GradeManagementUseCase } from 'application/usecases/GradeManagementUseCase';
import { AssignmentRepository } from 'infrastructure/database/repository/AssignmentRepository';
import { ClassRepository } from 'infrastructure/database/repository/ClassRepository';
import { GradeCompositionRepository } from 'infrastructure/database/repository/GradeCompositionRepository';
import { StudentRepository } from 'infrastructure/database/repository/StudentRepository';
import { ExcelService } from 'infrastructure/service/ExcelService';
import { GradeManagementController } from 'presentation/controllers/GradeManagementController';

@Module({
  imports: [],
  controllers: [GradeManagementController],
  providers: [
    GradeManagementUseCase,
    { provide: IClassRepository, useClass: ClassRepository },
    { provide: IExcelService, useClass: ExcelService },
    { provide: IStudentRepository, useClass: StudentRepository },
    {
      provide: IGradeCompositionRepository,
      useClass: GradeCompositionRepository,
    },
    { provide: IAssignmentRepository, useClass: AssignmentRepository },
  ],
})
export class GradeManagementModule {}
