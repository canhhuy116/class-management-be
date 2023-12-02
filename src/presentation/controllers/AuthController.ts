import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { SuccessInterceptor } from 'infrastructure/interceptor/success.interceptor';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { SignUpVM } from 'presentation/view-model/auth/SignUpVM';
import { UserVM } from 'presentation/view-model/users/UserVM';
import { LoginVM } from 'presentation/view-model/auth/LoginVM';
import { TokenInterceptor } from 'infrastructure/interceptor/token.interceptor';

@ApiTags('Auth')
@Controller('api/v1/auth')
@UseInterceptors(SuccessInterceptor)
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Sign up a new user',
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
  async signup(@Body() signupUser: SignUpVM) {
    await this.authUseCase.signup(SignUpVM.fromViewModel(signupUser));

    return new SuccessResponseDTO({
      message: 'User created successfully! Check your email to confirm it.',
      metadata: null,
    });
  }

  @Get('confirm')
  @ApiOperation({
    summary: 'Confirm user email',
  })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while confirming user email',
    type: UnprocessableEntityError,
  })
  @ApiQuery({
    name: 'token',
    type: String,
    required: true,
    description: 'Token',
    example: 'token',
  })
  async confirmEmail(@Query('token') token: string) {
    await this.authUseCase.confirmEmail(token);

    return new SuccessResponseDTO({
      message: 'User email confirmed successfully!',
      metadata: null,
    });
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  @ApiCreatedResponse({ description: 'User logged in.', type: UserVM })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while logging user',
    type: UnprocessableEntityError,
  })
  @UseInterceptors(TokenInterceptor)
  async login(@Body() loginUser: LoginVM) {
    const user = await this.authUseCase.login(LoginVM.fromViewModel(loginUser));

    return user;
  }
}
