import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { AdminRoleGuard } from 'infrastructure/guards/AdminRoleGuard';
import { SuccessInterceptor } from 'infrastructure/interceptor/success.interceptor';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { CreateUserVM } from 'presentation/view-model/users/CreateUserVM';
import { UpdateUserVM } from 'presentation/view-model/users/UpdateUserVM';
import { UserVM } from 'presentation/view-model/users/UserVM';
import { NotFoundError } from 'rxjs';
import { Response } from 'express';
import { ClassVM } from 'presentation/view-model/classes/ClassVM';
import { AdminUseCases } from 'application/usecases/AdminUseCase';

@ApiTags('Admin')
@Controller('api/v1/admin/users')
@UseInterceptors(SuccessInterceptor)
@UseGuards(AdminRoleGuard)
@UseGuards(AuthGuard('jwt'))
export class AdminUsersController {
  constructor(private readonly adminUseCase: AdminUseCases) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Find one user by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'User founded.', type: UserVM })
  @ApiNotFoundResponse({
    description: 'User cannot be founded.',
    type: NotFoundError,
  })
  async get(@Param('id') id: string): Promise<UserVM> {
    const user = await this.adminUseCase.getUserById(parseInt(id, 10));

    return UserVM.toViewModel(user);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  @ApiOkResponse({ description: 'All user`s fetched.', type: [UserVM] })
  async getAll(): Promise<UserVM[]> {
    const users = await this.adminUseCase.getUsers();

    return users.map((user) => UserVM.toViewModel(user));
  }

  @Post()
  @ApiOperation({
    summary: 'Creates an user',
  })
  @ApiCreatedResponse({ description: 'User created.', type: UserVM })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while creating user',
    type: UnprocessableEntityError,
  })
  async createUser(@Body() createUser: CreateUserVM): Promise<UserVM> {
    const newUser = await this.adminUseCase.createUser(
      CreateUserVM.fromViewModel(createUser),
    );

    return UserVM.toViewModel(newUser);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Admin updates an user',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'User updated.', type: UserVM })
  @ApiNotFoundResponse({
    description: 'User cannot be founded.',
    type: NotFoundError,
  })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while updating user',
    type: UnprocessableEntityError,
  })
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserVM,
  ) {
    await this.adminUseCase.updateUser(parseInt(id, 10), updateUser);

    return new SuccessResponseDTO({
      message: 'User updated',
      metadata: {},
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Admin deletes an user',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'User deleted.' })
  async deleteUserById(@Param('id') id: string) {
    await this.adminUseCase.deleteUser(parseInt(id, 10));

    return new SuccessResponseDTO({
      message: 'User deleted',
      metadata: {},
    });
  }

  @Patch(':id/lock')
  @ApiOperation({
    summary: 'Admin locks an user',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The user id',
  })
  async lockUserById(@Param('id') id: string) {
    await this.adminUseCase.lockUser(parseInt(id, 10));

    return new SuccessResponseDTO({
      message: 'User locked',
      metadata: {},
    });
  }

  @Patch(':id/map-studentId')
  @ApiOperation({
    summary: 'Admin maps studentId to an user',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The user id',
  })
  @ApiBody({
    description: 'The studentId to map',
    schema: {
      type: 'object',
      properties: {
        studentId: {
          type: 'string',
        },
      },
    },
  })
  async mapStudentIdToUserById(
    @Param('id') id: string,
    @Body() studentId: { studentId: string },
  ) {
    await this.adminUseCase.mapStudentIdToUser(
      parseInt(id, 10),
      studentId.studentId,
    );

    return new SuccessResponseDTO({
      message: 'StudentId mapped',
      metadata: {},
    });
  }

  @Get('export/excel')
  @ApiOperation({
    summary: 'Admin exports users to excel file',
  })
  async exportUsersToExcel(@Res() res: Response) {
    const buffer = await this.adminUseCase.exportUsersToExcel();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
    res.send(buffer);
  }

  @Patch(':id/unmap-studentId')
  @ApiOperation({
    summary: 'Admin unmaps studentId to an user',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The user id',
  })
  async unMapStudentIdToUserById(@Param('id') id: string) {
    await this.adminUseCase.unMapStudentIdToUser(parseInt(id, 10));

    return new SuccessResponseDTO({
      message: 'StudentId unmapped',
      metadata: {},
    });
  }

  @Patch('/map-studentId-excel')
  @ApiOperation({
    summary: 'Admin maps studentId to an user with excel file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The excel file to map',
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
  async mapStudentIdToUserWithExcel(@UploadedFile() file: Express.Multer.File) {
    await this.adminUseCase.mapStudentIdToUserWithExcel(file);

    return new SuccessResponseDTO({
      message: 'StudentId mapped',
      metadata: {},
    });
  }
}

@ApiTags('Admin')
@Controller('api/v1/admin/class')
@UseInterceptors(SuccessInterceptor)
@UseGuards(AdminRoleGuard)
@UseGuards(AuthGuard('jwt'))
export class AdminClassController {
  constructor(private readonly adminUseCases: AdminUseCases) {}

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
  async showClassDetailByAdmin(
    @Param('id') id: string,
  ): Promise<SuccessResponseDTO> {
    const classDetail = await this.adminUseCases.adminShowClassDetail(
      parseInt(id, 10),
    );

    return new SuccessResponseDTO({
      message: 'Class founded',
      metadata: ClassVM.toViewModel(classDetail),
    });
  }
}
