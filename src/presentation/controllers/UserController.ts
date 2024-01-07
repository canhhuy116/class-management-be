import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  Patch,
  UploadedFile,
  UseInterceptors,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { UsersUseCases } from 'application/usecases/UserUseCase';
import { AdminRoleGuard } from 'infrastructure/guards/AdminRoleGuard';
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { CreateUserVM } from 'presentation/view-model/users/CreateUserVM';
import { NotificationVM } from 'presentation/view-model/users/NotificationVM';
import { UpdateUserVM } from 'presentation/view-model/users/UpdateUserVM';
import { UserVM } from 'presentation/view-model/users/UserVM';
import { NotFoundError } from 'rxjs';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersUseCases: UsersUseCases) {}

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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async get(@Param('id') id: string): Promise<UserVM> {
    const user = await this.usersUseCases.getUserById(parseInt(id, 10));

    return UserVM.toViewModel(user);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  @ApiOkResponse({ description: 'All user`s fetched.', type: [UserVM] })
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async getAll(): Promise<UserVM[]> {
    const users = await this.usersUseCases.getUsers();

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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async createUser(@Body() createUser: CreateUserVM): Promise<UserVM> {
    const newUser = await this.usersUseCases.createUser(
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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserVM,
  ) {
    await this.usersUseCases.updateUser(parseInt(id, 10), updateUser);

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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async deleteUserById(@Param('id') id: string) {
    await this.usersUseCases.deleteUser(parseInt(id, 10));

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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async lockUserById(@Param('id') id: string) {
    await this.usersUseCases.lockUser(parseInt(id, 10));

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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async mapStudentIdToUserById(
    @Param('id') id: string,
    @Body() studentId: { studentId: string },
  ) {
    await this.usersUseCases.mapStudentIdToUser(
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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async exportUsersToExcel(@Res() res: Response) {
    const buffer = await this.usersUseCases.exportUsersToExcel();

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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async unMapStudentIdToUserById(@Param('id') id: string) {
    await this.usersUseCases.unMapStudentIdToUser(parseInt(id, 10));

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
  @UseGuards(AdminRoleGuard)
  @UseGuards(AuthGuard('jwt'))
  async mapStudentIdToUserWithExcel(@UploadedFile() file: Express.Multer.File) {
    await this.usersUseCases.mapStudentIdToUserWithExcel(file);

    return new SuccessResponseDTO({
      message: 'StudentId mapped',
      metadata: {},
    });
  }

  @Get('/test/ci-cd')
  @ApiOperation({
    summary: 'Test route',
  })
  @ApiOkResponse({ description: 'Test route.' })
  async test() {
    return 'test 123';
  }

  @Put()
  @ApiOperation({
    summary: 'Updates an user',
  })
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Request() req: RequestWithUser,
    @Body() user: UpdateUserVM,
  ): Promise<SuccessResponseDTO> {
    await this.usersUseCases.updateUser(req.user.userId, user);

    return new SuccessResponseDTO({
      message: 'User updated',
      metadata: {},
    });
  }

  @Patch('/avatar')
  @ApiOperation({
    summary: 'Updates an user avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The avatar of the user',
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
  @UseGuards(AuthGuard('jwt'))
  async updateUserAvatar(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessResponseDTO> {
    const avatarUrl = await this.usersUseCases.updateAvatar(
      req.user.userId,
      file,
    );

    return new SuccessResponseDTO({
      message: 'User updated',
      metadata: { avatar: avatarUrl },
    });
  }

  @Get('/cotext/notification')
  @ApiOperation({
    summary: 'Get notifications of user',
  })
  @UseGuards(AuthGuard('jwt'))
  async getNotifications(@Request() req: RequestWithUser) {
    const notifications = await this.usersUseCases.getNotifications(
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Notifications fetched',
      metadata: {
        notifications: notifications.map((notify) =>
          NotificationVM.toViewModel(notify),
        ),
      },
    });
  }
}
