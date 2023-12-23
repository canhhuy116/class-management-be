import { Module } from '@nestjs/common';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { GradeCompositionUseCase } from 'application/usecases/GradeCompositionUseCase';
import { ClassRepository } from 'infrastructure/database/repository/ClassRepository';
import { GradeCompositionRepository } from 'infrastructure/database/repository/GradeCompositionRepository';
import { GradeCompositionController } from 'presentation/controllers/GradeCompositionController';

@Module({
  imports: [],
  controllers: [GradeCompositionController],
  providers: [
    GradeCompositionUseCase,
    {
      provide: IClassRepository,
      useClass: ClassRepository,
    },
    {
      provide: IGradeCompositionRepository,
      useClass: GradeCompositionRepository,
    },
  ],
})
export class GradeCompositionModule {}
