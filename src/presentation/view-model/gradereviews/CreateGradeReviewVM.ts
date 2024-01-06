import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GradeReview } from 'domain/models/GradeReview';

export class CreateGradeReviewVM {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The assignment id of grade review',
    example: 1,
  })
  assignmentId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The expected value of grade review',
    example: 50,
  })
  expectedValue: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The message of grade review',
    example: 'This is a message',
  })
  message: string;

  static fromViewModel(vm: CreateGradeReviewVM): GradeReview {
    return new GradeReview(vm.assignmentId, vm.expectedValue, vm.message);
  }
}
