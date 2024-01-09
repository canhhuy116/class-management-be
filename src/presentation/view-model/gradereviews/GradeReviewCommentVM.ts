import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { GradeReviewComment } from 'domain/models/GradeReviewComment';

export class GradeReviewCommentVM {
  @IsNumber()
  @ApiProperty({
    description: 'The id of grade review',
    example: 1,
  })
  gradeReviewId: number;

  @IsString()
  @ApiProperty({
    description: 'The comment of grade review',
    example: 'This is a comment',
  })
  message: string;

  static fromViewModel(vm: GradeReviewCommentVM): GradeReviewComment {
    return new GradeReviewComment(vm.gradeReviewId, vm.message);
  }
}
