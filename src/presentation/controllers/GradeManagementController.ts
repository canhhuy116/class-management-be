import { GradeManagementUseCase } from './../../application/usecases/GradeManagementUseCase';
import { Controller, Get, Headers, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { TeacherRoleGuard } from 'infrastructure/guards/TeacherRoleGuard';

@ApiBearerAuth()
@ApiTags('GradeManagement')
@Controller('api/v1/grade-management')
@UseGuards(AuthGuard('jwt'))
export class GradeManagementController {
  constructor(
    private readonly gradeManagementUseCases: GradeManagementUseCase,
  ) {}

  @Get('student-list-template')
  @ApiOperation({
    summary: 'Download student list template',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the student list template as an Excel file',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  @UseGuards(TeacherRoleGuard)
  async downloadStudentListTemplate(
    @Res() res: Response,
    @Headers('class-id') classId: number,
  ) {
    const excelBuffer =
      await this.gradeManagementUseCases.downloadStudentListTemplate();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=student-template.xlsx',
    );
    res.send(excelBuffer);
  }
}
