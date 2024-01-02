import { GradeManagementUseCase } from './../../application/usecases/GradeManagementUseCase';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { Response } from 'express';
import { TeacherRoleGuard } from 'infrastructure/guards/TeacherRoleGuard';
import { UpsertAssignmentVM } from 'presentation/view-model/grademanagement/CreateAssignment';

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
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @UseGuards(TeacherRoleGuard)
  async downloadStudentListTemplate(@Res() res: Response) {
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

  @Post('student-list-template')
  @ApiOperation({
    summary: 'Upload student list template',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Student list template',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(TeacherRoleGuard)
  async uploadStudentListTemplate(
    @Headers('class-id') classId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const buffer: Buffer = file.buffer;

    await this.gradeManagementUseCases.uploadStudentListTemplate(
      buffer,
      classId,
    );

    return new SuccessResponseDTO({
      message: 'Upload student list template successfully',
      metadata: {},
    });
  }

  @Post('assignment')
  @ApiOperation({
    summary: 'Create assignment',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @UseGuards(TeacherRoleGuard)
  async createAssignment(
    @Headers('class-id') classId: number,
    @Body() assignment: UpsertAssignmentVM,
  ) {
    await this.gradeManagementUseCases.createAssignment(
      classId,
      UpsertAssignmentVM.fromViewModel(assignment),
    );

    return new SuccessResponseDTO({
      message: 'Create assignment successfully',
      metadata: {},
    });
  }

  @Get('/preview-student-grade-board')
  @ApiOperation({
    summary: 'Preview student grade board',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @UseGuards(TeacherRoleGuard)
  async previewStudentGradeBoard(@Headers('class-id') classId: number) {
    const studentGradeBoard =
      await this.gradeManagementUseCases.previewStudentGradeBoard(classId);

    return new SuccessResponseDTO({
      message: 'Preview student grade board successfully',
      metadata: studentGradeBoard,
    });
  }
}
