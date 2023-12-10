import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { ClassUseCases } from 'application/usecases/ClassUseCase';
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { ClassVM } from 'presentation/view-model/classes/ClassVM';
import { CreateClassVM } from 'presentation/view-model/classes/CreateClassVM';
import { TeacherAndStudentVM } from 'presentation/view-model/classes/TeacherAndStudentVM';
import { NotFoundError } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Class')
@Controller('api/v1/class')
@UseGuards(AuthGuard('jwt'))
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
    await this.classUseCases.createClass(
      CreateClassVM.fromViewModel(createClass, req.user.userId),
    );

    return new SuccessResponseDTO({
      message: 'Class created successfully!',
      metadata: null,
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
}
