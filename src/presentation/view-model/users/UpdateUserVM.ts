import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { User } from 'domain/models/User';

export class UpdateUserVM {
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The phone number of the user',
    example: '123456',
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The address of the user',
    example: 'New York',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The student ID of the user',
    example: '123456',
  })
  studentId?: string;

  static fromViewModel(vm: UpdateUserVM): User {
    return new User(vm.name, vm.phoneNumber, vm.address, vm.studentId);
  }
}
