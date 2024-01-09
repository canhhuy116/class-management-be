import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { Paging } from 'utils/paging';
import { FilterClass } from 'domain/models/Class';
import { UpsertClassVM } from 'presentation/view-model/classes/CreateClassVM';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('api/v1/admin/users')
@UseInterceptors(SuccessInterceptor)
@UseGuards(AdminRoleGuard)
@UseGuards(AuthGuard('jwt'))
export class AdminUsersController {
  constructor(private readonly adminUseCase: AdminUseCases) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Find one user by id',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'User founded.', type: UserVM })
  @ApiNotFoundResponse({
    description: 'User cannot be founded.',
    type: NotFoundError,
  })
  async get(@Param('userId') userId: string): Promise<UserVM> {
    const user = await this.adminUseCase.getUserById(parseInt(userId, 10));

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

  @Put(':userId')
  @ApiOperation({
    summary: 'Admin updates an user',
  })
  @ApiParam({
    name: 'userId',
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
    @Param('userId') userId: string,
    @Body() updateUser: UpdateUserVM,
  ) {
    await this.adminUseCase.updateUser(parseInt(userId, 10), updateUser);

    return new SuccessResponseDTO({
      message: 'User updated',
      metadata: {},
    });
  }

  @Delete(':userId')
  @ApiOperation({
    summary: 'Admin deletes an user',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'User deleted.' })
  async deleteUserById(@Param('userId') userId: string) {
    await this.adminUseCase.deleteUser(parseInt(userId, 10));

    return new SuccessResponseDTO({
      message: 'User deleted',
      metadata: {},
    });
  }

  @Patch(':userId/lock')
  @ApiOperation({
    summary: 'Admin locks an user',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The user id',
  })
  async lockUserById(@Param('userId') userId: string) {
    await this.adminUseCase.lockUser(parseInt(userId, 10));

    return new SuccessResponseDTO({
      message: 'User locked',
      metadata: {},
    });
  }

  @Patch(':userId/map-studentId')
  @ApiOperation({
    summary: 'Admin maps studentId to an user',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The user id',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
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
    @Param('userId') userId: string,
    @Body('studentId') studentId: string,
    @Headers('class-id') classId: number,
  ) {
    await this.adminUseCase.mapStudentIdToUser(
      parseInt(userId, 10),
      studentId,
      classId,
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

  @Patch(':userId/unmap-studentId')
  @ApiOperation({
    summary: 'Admin unmaps studentId to an user',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The user id',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  async unMapStudentIdToUserById(
    @Param('userId') userId: string,
    @Headers('class-id') classId: number,
  ) {
    await this.adminUseCase.unMapStudentIdToUser(parseInt(userId, 10), classId);

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

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('api/v1/admin/class')
@UseInterceptors(SuccessInterceptor)
@UseGuards(AdminRoleGuard)
@UseGuards(AuthGuard('jwt'))
export class AdminClassController {
  constructor(private readonly adminUseCases: AdminUseCases) {}

  @Get(':classId')
  @ApiOperation({
    summary: 'Show class detail',
  })
  @ApiParam({
    name: 'classId',
    type: Number,
    description: 'The class id',
  })
  @ApiOkResponse({ description: 'Class founded.', type: ClassVM })
  @ApiNotFoundResponse({
    description: 'Class cannot be founded.',
    type: NotFoundError,
  })
  async showClassDetailByAdmin(
    @Param('classId') classId: string,
  ): Promise<SuccessResponseDTO> {
    const classDetail = await this.adminUseCases.adminShowClassDetail(
      parseInt(classId, 10),
    );

    return new SuccessResponseDTO({
      message: 'Class founded',
      metadata: ClassVM.toViewModel(classDetail).withIsActive(
        classDetail.isActive,
      ),
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get all classes',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by class name',
  })
  async getClassesByAdmin(
    @Query() pagingRequest: Paging,
    @Query() filter: FilterClass,
    @Query('search') searchQuery?: string,
  ): Promise<SuccessResponseDTO> {
    const { page, limit } = pagingRequest;
    const paging = new Paging(page, limit);

    paging.fullFill();

    const classes = await this.adminUseCases.getClassesByAdmin(
      paging,
      filter,
      searchQuery,
    );

    return new SuccessResponseDTO({
      message: 'Classes founded',
      metadata: {
        classes: classes.map((classEntity) =>
          ClassVM.toViewModel(classEntity).withIsActive(classEntity.isActive),
        ),
        paging,
      },
    });
  }

  @Put(':classId')
  @ApiOperation({
    summary: 'Update a class',
  })
  @ApiParam({
    name: 'classId',
    type: Number,
    description: 'The class id',
  })
  async updateClassByAdmin(
    @Param('classId') classId: number,
    @Body() classUpdate: UpsertClassVM,
  ): Promise<SuccessResponseDTO> {
    await this.adminUseCases.updateClassByAdmin(classId, classUpdate);

    return new SuccessResponseDTO({
      message: 'Class updated',
      metadata: {},
    });
  }

  @Delete(':classId')
  @ApiOperation({
    summary: 'Delete a class',
  })
  @ApiParam({
    name: 'classId',
    type: Number,
    description: 'The class id',
  })
  async deleteClassByAdmin(
    @Param('classId') classId: number,
  ): Promise<SuccessResponseDTO> {
    await this.adminUseCases.deleteClassByAdmin(classId);

    return new SuccessResponseDTO({
      message: 'Class deleted',
      metadata: {},
    });
  }

  @Patch(':classId/inactive')
  @ApiOperation({
    summary: 'Inactive a class',
  })
  @ApiParam({
    name: 'classId',
    type: Number,
    description: 'The class id',
  })
  async inactiveClassByAdmin(
    @Param('classId') classId: string,
  ): Promise<SuccessResponseDTO> {
    await this.adminUseCases.inactiveClassByAdmin(parseInt(classId, 10));

    return new SuccessResponseDTO({
      message: 'Class inactived',
      metadata: {},
    });
  }

  @Patch(':classId/active')
  @ApiOperation({
    summary: 'Active a class',
  })
  @ApiParam({
    name: 'classId',
    type: Number,
    description: 'The class id',
  })
  async activeClassByAdmin(
    @Param('classId') classId: string,
  ): Promise<SuccessResponseDTO> {
    await this.adminUseCases.activeClassByAdmin(parseInt(classId, 10));

    return new SuccessResponseDTO({
      message: 'Class actived',
      metadata: {},
    });
  }
}
