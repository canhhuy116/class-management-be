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

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Is action approve or not',
    example: true,
  })
  isApprove: boolean;
}
