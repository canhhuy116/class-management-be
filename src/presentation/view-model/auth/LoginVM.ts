import { ApiProperty } from '@nestjs/swagger';
import { LoginDTO } from 'application/dtos/LoginDTO';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginVM {
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

  static fromViewModel(vm: LoginVM): LoginDTO {
    return new LoginDTO(vm.email, vm.password);
  }
}
