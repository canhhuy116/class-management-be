import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { Class } from 'domain/models/Class';
import { UserVM } from '../users/UserVM';

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

  @Expose()
  @ApiProperty({
    description: 'Number of students in the class',
    example: '1',
  })
  numberOfStudents: number;

  @Expose()
  @ApiProperty({
    description: 'Number of teachers in the class',
    example: '1',
  })
  numberOfTeachers: number;

  @Expose()
  @ApiProperty({
    description: 'The time the class was updated',
    example: '2021-08-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Owner of the class',
  })
  owner: UserVM;

  static toViewModel(classEntity: Class): ClassVM {
    const owner = classEntity.teachers.find(
      (teacher) => teacher.id === classEntity.ownerId,
    );
    const ownerVM = UserVM.toViewModel(owner);

    const numberOfStudents = classEntity.students
      ? classEntity.students.length
      : 0;
    const numberOfTeachers = classEntity.teachers
      ? classEntity.teachers.length
      : 0;

    return plainToClass(
      ClassVM,
      {
        ...classEntity,
        owner: ownerVM,
        numberOfStudents,
        numberOfTeachers,
      },
      { excludeExtraneousValues: true },
    );
  }
}
