import { ApiProperty } from '@nestjs/swagger';
import { plainToClass, Expose } from 'class-transformer';

import { User } from 'domain/models/User';

export class UserVM {
  @Expose()
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The unique email of the user',
    example: 'john.doe@gmail.com',
  })
  email: string;

  @Expose()
  phoneNumber?: string;

  @Expose()
  address?: string;

  @Expose()
  avatar?: string;

  studentId?: string;

  static toViewModel(user: User): UserVM {
    return plainToClass(UserVM, user, { excludeExtraneousValues: true });
  }

  static fromViewModel(userVM: UserVM): User {
    return plainToClass(User, userVM, { excludeExtraneousValues: true });
  }

  withStudentId(studentId: string): UserVM {
    this.studentId = studentId;

    return this;
  }
}
