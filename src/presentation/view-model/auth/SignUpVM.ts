import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { User } from 'domain/models/User';

export class SignUpVM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The unique email of the user',
    example: 'a@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
  })
  password: string;

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

  static fromViewModel(vm: SignUpVM): User {
    return new User(vm.name, vm.email, vm.password, vm.phoneNumber, vm.address);
  }
}
