import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Grade } from 'domain/models/Grade';

export class InputStudentGradeAssignmentVM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The student id',
    example: '20120123',
  })
  studentId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The score of assignment',
    example: 30,
  })
  score: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The assignment id',
    example: 1,
  })
  assignmentId: number;

  static fromViewModel(input: InputStudentGradeAssignmentVM) {
    return new Grade(input.score, input.studentId, input.assignmentId);
  }
}
