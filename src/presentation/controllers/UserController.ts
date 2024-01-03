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
} from '@nestjs/common';
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
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { CreateUserVM } from 'presentation/view-model/users/CreateUserVM';
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
  async get(@Param('id') id: string): Promise<UserVM> {
    const user = await this.usersUseCases.getUserById(parseInt(id, 10));

    return UserVM.toViewModel(user);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  @ApiOkResponse({ description: 'All user`s fetched.', type: [UserVM] })
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
  async createUser(@Body() createUser: CreateUserVM): Promise<UserVM> {
    const newUser = await this.usersUseCases.createUser(
      CreateUserVM.fromViewModel(createUser),
    );

    return UserVM.toViewModel(newUser);
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
}
