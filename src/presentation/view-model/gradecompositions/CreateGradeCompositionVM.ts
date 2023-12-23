import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GradeComposition } from 'domain/models/GradeComposition';

export class UpsertGradeCompositionVM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of grade composition',
    example: 'Midterm Exam',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The weight of grade composition',
    example: 30,
  })
  weight: number;

  static fromViewModel(vm: UpsertGradeCompositionVM): GradeComposition {
    return new GradeComposition(vm.name, vm.weight);
  }
}
