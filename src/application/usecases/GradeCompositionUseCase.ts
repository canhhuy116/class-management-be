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

      const gradeCompositionOfClass =
        await this.gradeCompositionRepository.find({
          where: { classId },
        });

      gradeComposition.priority = gradeCompositionOfClass.length + count;
      count++;
    }
    this.gradeCompositionRepository.save(gradeCompositions);
  }

  async showGradeComposition(classId: number, currentUserId: number) {
    this.logger.log(`Showing grade composition`);

    const classEntity = await this.classRepository.findOne({
      where: { id: classId, isActive: true },
    });

    if (!classEntity) {
      throw new EntityNotFoundException('Class not found');
    }

    if (!classEntity.hasMember(currentUserId)) {
      throw new ForbiddenException("You don't have permission to access");
    }

    const gradeComposition = await this.gradeCompositionRepository.find({
      where: { classId },
    });

    return gradeComposition;
  }

  async updateGradeComposition(
    gradeCompositionId: number,
    gradeComposition: GradeComposition,
    currentClassId: number,
  ) {
    this.logger.log(`Updating grade composition`);

    const findGradeComposition = await this.gradeCompositionRepository.findOne({
      where: { id: gradeCompositionId },
    });

    if (!findGradeComposition) {
      throw new EntityNotFoundException('Grade composition not found');
    }

    if (findGradeComposition.classId != currentClassId) {
      throw new ForbiddenException("You don't have permission to access");
    }

    findGradeComposition.name = gradeComposition.name;
    findGradeComposition.weight = gradeComposition.weight;

    await this.gradeCompositionRepository.save(findGradeComposition);
  }

  async deleteGradeComposition(
    gradeCompositionId: number,
    currentClassId: number,
  ) {
    this.logger.log(`Deleting grade composition`);

    const findGradeComposition = await this.gradeCompositionRepository.findOne({
      where: { id: gradeCompositionId },
    });

    if (!findGradeComposition) {
      throw new EntityNotFoundException('Grade composition not found');
    }

    if (findGradeComposition.classId != currentClassId) {
      throw new ForbiddenException("You don't have permission to access");
    }

    await this.gradeCompositionRepository.delete(gradeCompositionId);

    const gradeCompositionOfClass = await this.gradeCompositionRepository.find({
      where: { classId: currentClassId },
    });

    let count = 1;
    for (const gradeComposition of gradeCompositionOfClass) {
      gradeComposition.priority = count;
      count++;
    }

    await this.gradeCompositionRepository.save(gradeCompositionOfClass);
  }

  async arrangeGradeComposition(
    gradeCompositionIds: number[],
    currentClassId: number,
  ) {
    this.logger.log(`Arranging grade composition`);

    const gradeCompositionOfClass = await this.gradeCompositionRepository.find({
      where: { classId: currentClassId },
    });

    if (gradeCompositionOfClass.length !== gradeCompositionIds.length) {
      throw new EntityNotFoundException('Grade composition not found');
    }

    let count = 1;
    const gradeCompositions = [];
    for (const gradeCompositionId of gradeCompositionIds) {
      const findGradeComposition =
        await this.gradeCompositionRepository.findOne({
          where: { id: gradeCompositionId },
        });

      if (!findGradeComposition) {
        throw new EntityNotFoundException('Grade composition not found');
      }

      if (findGradeComposition.classId != currentClassId) {
        throw new ForbiddenException("You don't have permission to access");
      }

      findGradeComposition.priority = count;
      count++;

      gradeCompositions.push(findGradeComposition);
    }
    await this.gradeCompositionRepository.save(gradeCompositions);
  }
}
