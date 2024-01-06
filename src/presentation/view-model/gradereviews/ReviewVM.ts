import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewVM {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of grade review',
    example: 1,
  })
  id: number;

  @Optional()
  @IsNumber()
  @ApiProperty({
    description: 'The new value of grade review',
    example: 1,
  })
  value: number;

  @Optional()
  @IsString()
  @ApiProperty({
    description: 'The comment of teacher when approve grade review',
    example: 'This is a comment approve',
  })
  commentApprove: string;

  @Optional()
  @IsString()
  @ApiProperty({
    description: 'The comment of teacher when reject grade review',
    example: 'This is a comment reject',
  })
  commentReject: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Is action reject or not',
    example: true,
  })
  isReject: boolean;
}
