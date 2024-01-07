import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Class } from 'domain/models/Class';

export class UpsertClassVM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the class',
    example: 'Class A',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The description of the class',
    example: 'Class A',
  })
  description: string;

  static fromViewModel(vm: UpsertClassVM, ownerId: number): Class {
    return new Class(vm.name, ownerId, vm.description);
  }
}
