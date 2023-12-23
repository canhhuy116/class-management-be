import { Injectable } from '@nestjs/common';
import { IExcelService } from 'application/ports/IExcelService';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService implements IExcelService {
  async generateExcelTemplate(
    name: string,
    columns: string[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(name);

    worksheet.columns = columns.map((column) => ({
      header: column,
      key: column,
    }));

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }
}
