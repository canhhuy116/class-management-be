import { Injectable, Logger } from '@nestjs/common';
import { IExcelService } from 'application/ports/IExcelService';

@Injectable()
export class GradeManagementUseCase {
  private readonly logger = new Logger(GradeManagementUseCase.name);

  constructor(private readonly excelService: IExcelService) {}

  async downloadStudentListTemplate(): Promise<Buffer> {
    this.logger.log(`Downloading student list template`);

    const columns = ['Student ID', 'Full name'];

    const buffer = await this.excelService.generateExcelTemplate(
      'Student List',
      columns,
    );

    return buffer;
  }
}
