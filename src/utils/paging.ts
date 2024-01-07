import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Paging {
  @Expose()
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  public page: number;

  @Expose()
  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  public limit: number;

  total: number;

  constructor(page: number, limit: number) {
    this.page = Number(page);
    this.limit = Number(limit);
  }

  fullFill(): void {
    if (this.page <= 0 || !this.page) {
      this.page = 1;
    }
    if (this.limit <= 0 || !this.limit) {
      this.limit = 10;
    }
  }
}
