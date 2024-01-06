import { Module } from '@nestjs/common';
import { IAssignmentRepository } from 'application/ports/IAssignmentRepository';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { IGradeRepository } from 'application/ports/IGradeRepository';
import { IGradeReviewRepository } from 'application/ports/IGradeReviewRepository';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { GradeReviewUseCase } from 'application/usecases/GradeReviewUseCase';
import { AssignmentRepository } from 'infrastructure/database/repository/AssignmentRepository';
import { ClassRepository } from 'infrastructure/database/repository/ClassRepository';
import { GradeCompositionRepository } from 'infrastructure/database/repository/GradeCompositionRepository';
import { GradeRepository } from 'infrastructure/database/repository/GradeRepository';
import { GradeReviewRepository } from 'infrastructure/database/repository/GradeReviewRepository';
import { StudentRepository } from 'infrastructure/database/repository/StudentRepository';
import { GradeReviewController } from 'presentation/controllers/GradeReviewController';
import { NotificationModule } from './notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [GradeReviewController],
  providers: [
    GradeReviewUseCase,
    { provide: IStudentRepository, useClass: StudentRepository },
    { provide: IGradeRepository, useClass: GradeRepository },
    { provide: IGradeReviewRepository, useClass: GradeReviewRepository },
    {
      provide: IGradeCompositionRepository,
      useClass: GradeCompositionRepository,
    },
    { provide: IAssignmentRepository, useClass: AssignmentRepository },
    { provide: IClassRepository, useClass: ClassRepository },
  ],
})
export class GradeReviewModule {}
