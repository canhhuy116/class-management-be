import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { ClassUseCases } from 'application/usecases/ClassUseCase';
import { Role } from 'domain/models/Role';
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { TeacherRoleGuard } from 'infrastructure/guards/TeacherRoleGuard';
import { SuccessInterceptor } from 'infrastructure/interceptor/success.interceptor';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { ClassVM } from 'presentation/view-model/classes/ClassVM';
import { CreateClassVM } from 'presentation/view-model/classes/CreateClassVM';
import { InvitePeopleIntoClassVM } from 'presentation/view-model/classes/InvitePeopleIntoClassVM';
import { TeacherAndStudentVM } from 'presentation/view-model/classes/TeacherAndStudentVM';
import { NotFoundError } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Class')
@Controller('api/v1/class')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SuccessInterceptor)
export class ClassController {
  constructor(private readonly classUseCases: ClassUseCases) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Show class detail',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The class id',
  })
  @ApiOkResponse({ description: 'Class founded.', type: ClassVM })
  @ApiNotFoundResponse({
    description: 'Class cannot be founded.',
    type: NotFoundError,
  })
  async showClassDetail(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<SuccessResponseDTO> {
    const classDetail = await this.classUseCases.showClassDetail(
      parseInt(id, 10),
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Class founded',
      metadata: ClassVM.toViewModel(classDetail),
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get all classes',
  })
  @ApiOkResponse({ description: 'Classes founded.', type: ClassVM })
  async getClasses(
    @Request() req: RequestWithUser,
  ): Promise<SuccessResponseDTO> {
    const classes = await this.classUseCases.getClasses(req.user.userId);

    return new SuccessResponseDTO({
      message: 'Classes founded',
      metadata: classes.map((classEntity) => ClassVM.toViewModel(classEntity)),
    });
  }

  @Get(':id/teachers-and-students')
  @ApiOperation({
    summary: 'Show class teachers and students',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The class id',
  })
  async showTeachersAndStudents(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<SuccessResponseDTO> {
    const classDetail = await this.classUseCases.showTeachersAndStudents(
      parseInt(id, 10),
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Class founded',
      metadata: TeacherAndStudentVM.toViewModel(classDetail),
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a class',
  })
  @ApiCreatedResponse({ description: 'User created.' })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while creating user',
    type: UnprocessableEntityError,
  })
  async createClass(
    @Request() req: RequestWithUser,
    @Body() createClass: CreateClassVM,
  ): Promise<SuccessResponseDTO> {
    const newClass = await this.classUseCases.createClass(
      CreateClassVM.fromViewModel(createClass, req.user.userId),
    );

    return new SuccessResponseDTO({
      message: 'Class created successfully!',
      metadata: ClassVM.toViewModel(newClass),
    });
  }

  @Get(':id/invitation-code')
  @ApiOperation({
    summary: 'Get class invitation code',
  })
  @ApiOkResponse({ description: 'Invitation code founded.', type: String })
  @ApiNotFoundResponse({
    description: 'Class cannot be founded.',
    type: NotFoundError,
  })
  async getInvitationCode(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<SuccessResponseDTO> {
    const invitationCode = await this.classUseCases.getInvitationCode(
      parseInt(id, 10),
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Invitation code founded',
      metadata: { code: invitationCode },
    });
  }

  @Get(':code/join')
  @ApiOperation({
    summary: 'Join class by invitation code',
  })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'The invitation code',
  })
  @ApiQuery({
    name: 'studentId',
    type: String,
    required: false,
    description: 'The student id',
  })
  @ApiOkResponse({ description: 'Joined class successfully!', type: String })
  @ApiNotFoundResponse({
    description: 'Class cannot be founded.',
    type: NotFoundError,
  })
  async joinClass(
    @Param('code') code: string,
    @Query('studentId') studentId: string,
    @Request() req: RequestWithUser,
  ): Promise<SuccessResponseDTO> {
    const classJoin = await this.classUseCases.joinClass(
      code,
      req.user.userId,
      studentId,
    );

    return new SuccessResponseDTO({
      message: 'Joined class successfully!',
      metadata: ClassVM.toViewModel(classJoin),
    });
  }

  @Post(':id/teachers')
  @ApiOperation({
    summary: 'Invite teacher to class',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The class id',
  })
  @ApiCreatedResponse({ description: 'Teacher invited.' })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while inviting teacher',
    type: UnprocessableEntityError,
  })
  async inviteTeacher(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() teacherEmail: InvitePeopleIntoClassVM,
  ): Promise<SuccessResponseDTO> {
    await this.classUseCases.inviteToClass(
      parseInt(id, 10),
      req.user.userId,
      teacherEmail.email,
      Role.TEACHER,
    );

    return new SuccessResponseDTO({
      message: 'Teacher invited successfully!',
      metadata: null,
    });
  }

  @Post(':id/students')
  @ApiOperation({
    summary: 'Invite student to class',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The class id',
  })
  @ApiCreatedResponse({ description: 'Student invited.' })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while inviting student',
    type: UnprocessableEntityError,
  })
  async inviteStudent(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() studentEmail: InvitePeopleIntoClassVM,
  ): Promise<SuccessResponseDTO> {
    await this.classUseCases.inviteToClass(
      parseInt(id, 10),
      req.user.userId,
      studentEmail.email,
      Role.STUDENT,
    );

    return new SuccessResponseDTO({
      message: 'Student invited successfully!',
      metadata: null,
    });
  }

  @Post(':id/upload-background')
  @ApiOperation({
    summary: 'Upload class background',
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
  async uploadBackground(
    @Headers('class-id') classId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessResponseDTO> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    await this.classUseCases.uploadBackgroundImage(file, classId);

    return new SuccessResponseDTO({
      message: 'Background uploaded successfully!',
      metadata: {},
    });
  }
}
