import { ApiProperty } from '@nestjs/swagger';
import { ResetPasswordDTO } from 'application/dtos/ResetPasswordDTO';
import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordVM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The token to reset the password',
    example: 'token',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The new password of the user',
    example: 'newPassword123',
  })
  newPassword: string;

  static fromViewModel(vm: ResetPasswordVM): ResetPasswordDTO {
    return new ResetPasswordDTO(vm.token, vm.newPassword);
  }
}
