import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IGradeCompositionRepository } from 'application/ports/IGradeCompositionRepository';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { GradeComposition } from 'domain/models/GradeComposition';

@Injectable()
export class GradeCompositionUseCase {
  private readonly logger = new Logger(GradeCompositionUseCase.name);

  constructor(
    private readonly classRepository: IClassRepository,
    private readonly gradeCompositionRepository: IGradeCompositionRepository,
  ) {}

  async addGradeComposition(gradeCompositions: GradeComposition[]) {
    this.logger.log(`Adding grade composition`);

    let count = 1;
    for (const gradeComposition of gradeCompositions) {
      const classId = gradeComposition.classId;
      const classEntity = await this.classRepository.findOne({
        where: { id: classId },
      });
      if (!classEntity) {
        throw new EntityNotFoundException('Class not found');
      }

      const gradeCompositionOfClass =
        await this.gradeCompositionRepository.find({
          where: { classId },
        });

      gradeComposition.priority = gradeCompositionOfClass.length + count;
      count++;
    }
    this.gradeCompositionRepository.save(gradeCompositions);
  }

  async showGradeComposition(classId: number) {
    this.logger.log(`Showing grade composition`);

    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classEntity) {
      throw new EntityNotFoundException('Class not found');
    }

    if (!classEntity.hasMember(classId)) {
      throw new ForbiddenException("You don't have permission to access");
    }

    const gradeComposition = await this.gradeCompositionRepository.find({
      where: { classId },
    });

    return gradeComposition;
  }
}
