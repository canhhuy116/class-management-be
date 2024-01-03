import { BadRequestException, Injectable } from '@nestjs/common';
import { IExcelService } from 'application/ports/IExcelService';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService implements IExcelService {
  async generateExcelTemplate(
    name: string,
    columns: string[],
    data?: any[],
    indexColumnFillData?: number,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(name);

    worksheet.columns = columns.map((column) => ({
      header: column,
      key: column,
    }));

    if (data != undefined && indexColumnFillData != undefined) {
      data.forEach((item) => {
        worksheet.addRow({ [columns[indexColumnFillData]]: item });
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }

  async excelToEntities<T>(buffer: Buffer, columns: string[]): Promise<T[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];

    const headerRow = worksheet.getRow(1);
    const fileColumns = headerRow.values as string[];

    const isValidColumns = columns.every((column) =>
      fileColumns.includes(column),
    );

    if (!isValidColumns) {
      throw new BadRequestException(
        'Columns in the Excel file do not match the specified columns.',
      );
    }

    const entities: T[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const entity = {} as T;

        columns.forEach((column, index) => {
          entity[column] = row.values[index + 1];
        });

        entities.push(entity);
      }
    });

    return entities;
  }
}