import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InvitePeopleIntoClassVM {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the person to invite',
    example: 'a@example.com',
  })
  email: string;
}
