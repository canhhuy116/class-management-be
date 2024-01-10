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
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { Response } from 'express';
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { TeacherRoleGuard } from 'infrastructure/guards/TeacherRoleGuard';
import { SuccessInterceptor } from 'infrastructure/interceptor/success.interceptor';
import { UpsertAssignmentVM } from 'presentation/view-model/grademanagement/CreateAssignment';
import { InputStudentGradeAssignmentVM } from 'presentation/view-model/grademanagement/InputGradeStudentAssignment';

@ApiBearerAuth()
@ApiTags('GradeManagement')
@Controller('api/v1/grade-management')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SuccessInterceptor)
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

  @Post('/input-grade-student-assignment')
  @ApiOperation({
    summary: 'Input grade student assignment',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @UseGuards(TeacherRoleGuard)
  async inputGradeStudentAssignment(
    @Request() req: RequestWithUser,
    @Headers('class-id') classId: number,
    @Body() body: InputStudentGradeAssignmentVM,
  ) {
    await this.gradeManagementUseCases.inputGradeStudentAssignment(
      req.user.userId,
      classId,
      InputStudentGradeAssignmentVM.fromViewModel(body),
    );

    return new SuccessResponseDTO({
      message: 'Input grade student assignment successfully',
      metadata: {},
    });
  }

  @Get('grade-assignment-template')
  @ApiOperation({
    summary: 'Download grade assignment template',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the grade assignment template as an Excel file',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @ApiQuery({
    name: 'assignment-id',
    description: 'Assignment ID',
    required: true,
  })
  @UseGuards(TeacherRoleGuard)
  async downloadGradeAssignmentTemplate(
    @Res() res: Response,
    @Headers('class-id') classId: number,
    @Query('assignment-id') assignmentId: number,
  ) {
    const excelBuffer =
      await this.gradeManagementUseCases.downloadGradeAssignmentTemplate(
        classId,
        assignmentId,
      );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=grade-assignment-template.xlsx',
    );
    res.send(excelBuffer);
  }

  @Post('grade-assignment-template')
  @ApiOperation({
    summary: 'Upload grade assignment template',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Grade assignment template',
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
  @ApiQuery({
    name: 'assignment-id',
    description: 'Assignment ID',
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(TeacherRoleGuard)
  async uploadGradeAssignmentTemplate(
    @Headers('class-id') classId: number,
    @UploadedFile() file: Express.Multer.File,
    @Query('assignment-id') assignmentId: number,
    @Request() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const buffer: Buffer = file.buffer;

    await this.gradeManagementUseCases.uploadGradeAssignment(
      buffer,
      classId,
      assignmentId,
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Upload grade assignment successfully',
      metadata: {},
    });
  }

  @Get('/total-grade-board')
  @ApiOperation({
    summary: 'Total grade board',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @UseGuards(TeacherRoleGuard)
  async totalGradeBoard(@Headers('class-id') classId: number) {
    const totalGradeBoard =
      await this.gradeManagementUseCases.showTotalGrade(classId);

    return new SuccessResponseDTO({
      message: 'show total grade board successfully',
      metadata: totalGradeBoard,
    });
  }

  @Post('/mark-viewable-grade')
  @ApiOperation({
    summary: 'Mark viewable grade',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @ApiBody({
    description: 'Grade composition ID',
    schema: {
      type: 'object',
      properties: {
        gradeCompositionId: {
          type: 'number',
        },
      },
    },
  })
  @UseGuards(TeacherRoleGuard)
  async markViewableGrade(
    @Headers('class-id') classId: number,
    @Body() body: { gradeCompositionId: number },
  ) {
    await this.gradeManagementUseCases.markViewableGradeComposition(
      classId,
      body.gradeCompositionId,
    );

    return new SuccessResponseDTO({
      message: 'Mark viewable grade successfully',
      metadata: {},
    });
  }

  @Get('/view-grade/:compositionId')
  @ApiOperation({
    summary: 'View grade',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  async viewGrade(
    @Request() req: RequestWithUser,
    @Headers('class-id') classId: number,
    @Query('compositionId') compositionId: number,
  ) {
    const grade = await this.gradeManagementUseCases.viewGrade(
      classId,
      req.user.userId,
      compositionId,
    );

    return new SuccessResponseDTO({
      message: 'View grade successfully',
      metadata: grade,
    });
  }

  @Get('/view-grade-board')
  @ApiOperation({
    summary: 'View grade board',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  async viewGradeBoard(
    @Request() req: RequestWithUser,
    @Headers('class-id') classId: number,
  ) {
    const totalGradeBoard =
      await this.gradeManagementUseCases.studentViewGradeBoard(
        classId,
        req.user.userId,
      );

    return new SuccessResponseDTO({
      message: 'show total grade board successfully',
      metadata: totalGradeBoard,
    });
  }
}
