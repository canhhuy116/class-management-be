import {
  Controller,
  Get,
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
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { UsersUseCases } from 'application/usecases/UserUseCase';
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { NotificationVM } from 'presentation/view-model/users/NotificationVM';
import { UpdateUserVM } from 'presentation/view-model/users/UpdateUserVM';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersUseCases: UsersUseCases) {}
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
