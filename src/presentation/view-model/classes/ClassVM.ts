import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { Class } from 'domain/models/Class';

export class ClassVM {
  @Expose()
  @ApiProperty({
    description: 'The id of the class',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The name of the class',
    example: 'Class A',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The code of the class',
    example: 'A',
  })
  code: string;

  @Expose()
  @ApiProperty({
    description: 'The description of the class',
    example: 'Class A',
  })
  description?: string;

  static toViewModel(classEntity: Class): ClassVM {
    return plainToClass(ClassVM, classEntity, {
      excludeExtraneousValues: true,
    });
  }
}
