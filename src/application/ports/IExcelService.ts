import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IExcelService {
  abstract generateExcelTemplate(
    name: string,
    columns: string[],
  ): Promise<Buffer>;
  abstract excelToEntities<T>(buffer: Buffer, columns: string[]): Promise<T[]>;
}
