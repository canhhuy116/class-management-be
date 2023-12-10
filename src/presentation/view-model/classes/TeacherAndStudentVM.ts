import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { Class } from 'domain/models/Class';
import { UserVM } from '../users/UserVM';

export class TeacherAndStudentVM {
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
    description: 'The teachers of the class',
  })
  teachers: UserVM[];

  @Expose()
  @ApiProperty({
    description: 'The students of the class',
  })
  students: UserVM[];

  static toViewModel(classEntity: Class): TeacherAndStudentVM {
    const { teachers, students, ...classDetail } = classEntity;

    const teachersVM = teachers.map((teacher) => UserVM.toViewModel(teacher));
    const studentsVM = students.map((student) => UserVM.toViewModel(student));

    return plainToClass(
      TeacherAndStudentVM,
      {
        ...classDetail,
        teachers: teachersVM,
        students: studentsVM,
      },
      { excludeExtraneousValues: true },
    );
  }
}
