import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { GradeReviewComment } from 'domain/models/GradeReviewComment';

export class GradeReviewCommentVM {
  @Expose()
  @IsNumber()
  @ApiProperty({
    description: 'The id of grade review',
    example: 1,
  })
  gradeReviewId: number;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'The comment of grade review',
    example: 'This is a comment',
  })
  message: string;

  @Expose()
  time: Date;

  @Expose()
  byUser: string;

  @Expose()
  avatar: string;

  static toViewModel(
    gradeReviewComment: GradeReviewComment,
  ): GradeReviewCommentVM {
    const gradeReviewCommentVM = plainToClass(
      GradeReviewCommentVM,
      gradeReviewComment,
      {
        excludeExtraneousValues: true,
      },
    );

    gradeReviewCommentVM.time = gradeReviewComment.createdAt;
    gradeReviewCommentVM.byUser = gradeReviewComment['user']
      ? gradeReviewComment['user'].name
      : null;
    gradeReviewCommentVM.avatar = gradeReviewComment['user']
      ? gradeReviewComment['user'].avatar
      : null;

    return gradeReviewCommentVM;
  }

  static fromViewModel(vm: GradeReviewCommentVM): GradeReviewComment {
    return new GradeReviewComment(vm.gradeReviewId, vm.message);
  }
}
