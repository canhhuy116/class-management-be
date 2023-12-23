import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';

export class GradeCompositionVM {
  @Expose()
  @ApiProperty({
    description: 'The id of the grade composition',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The name of the grade composition',
    example: 'Grade composition A',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The weight of the grade composition',
    example: '1',
  })
  weight: number;

  @Expose()
  @ApiProperty({
    description: 'The priority of the grade composition',
    example: '1',
  })
  priority: number;

  static toViewModel(gradeComposition: GradeCompositionVM): GradeCompositionVM {
    return plainToClass(GradeCompositionVM, gradeComposition, {
      excludeExtraneousValues: true,
    });
  }
}
