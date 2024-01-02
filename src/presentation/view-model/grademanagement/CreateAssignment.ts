import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Assignment } from 'domain/models/Assignment';

export class UpsertAssignmentVM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of assignment',
    example: 'BT1',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The max score of assignment',
    example: 30,
  })
  maxScore: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The grade composition id of assignment',
    example: 1,
  })
  gradeCompositionId: number;

  static fromViewModel(vm: UpsertAssignmentVM): Assignment {
    return new Assignment(vm.name, vm.maxScore, vm.gradeCompositionId);
  }
}
