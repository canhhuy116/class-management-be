import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  Query,
  UseGuards,
  Request,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiQuery,
  ApiResponse,
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
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { ResetPasswordVM } from 'presentation/view-model/auth/ResetPasswordVM';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithFullUser } from 'infrastructure/guards/GoogleStrategy';

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

  @Get('resend-confirmation-email')
  @ApiOperation({
    summary: 'Resend confirmation email',
  })
  @ApiCreatedResponse({ description: 'Email sent successfully!', type: UserVM })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while resending confirmation email',
    type: UnprocessableEntityError,
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: 'Email',
    example: 'a@example.com',
  })
  async resendConfirmEmail(@Query('email') email: string) {
    await this.authUseCase.resendConfirmEmail(email);

    return new SuccessResponseDTO({
      message: 'Email sent successfully!',
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

  @Get('me')
  @ApiOperation({
    summary: 'Get current user',
  })
  @ApiCreatedResponse({ description: 'User logged in.', type: UserVM })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while getting current user',
    type: UnprocessableEntityError,
  })
  @UseGuards(AuthGuard('jwt'))
  async me(@Request() req: RequestWithUser) {
    const user = await this.authUseCase.getMe(req.user.userId);

    return new SuccessResponseDTO({
      message: 'User logged in successfully',
      metadata: UserVM.toViewModel(user),
    });
  }

  @Get('forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
  })
  @ApiResponse({
    description: 'Email sent successfully!',
    type: SuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while getting current user',
    type: UnprocessableEntityError,
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: 'Email',
    example: 'a@example.com',
  })
  async forgotPassword(@Query('email') email: string) {
    await this.authUseCase.forgotPassword(email);

    return new SuccessResponseDTO({
      message:
        'Email sent successfully! Check your email to reset your password.',
      metadata: null,
    });
  }

  @Put('reset-password')
  @ApiOperation({
    summary: 'Reset password',
  })
  @ApiResponse({
    description: 'Password reset successfully!',
    type: SuccessResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while getting current user',
    type: UnprocessableEntityError,
  })
  async resetPassword(@Body() resetPasswordBody: ResetPasswordVM) {
    await this.authUseCase.resetPassword(
      ResetPasswordVM.fromViewModel(resetPasswordBody),
    );

    return new SuccessResponseDTO({
      message: 'Password reset successfully!',
      metadata: null,
    });
  }

  @Get('google')
  @ApiOperation({
    summary: 'Google login',
  })
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google callback',
  })
  @UseGuards(AuthGuard('google'))
  @UseInterceptors(TokenInterceptor)
  async googleLoginCallback(@Req() req: RequestWithFullUser) {
    return req.user;
  }

  @Get('facebook')
  @ApiOperation({
    summary: 'Facebook login',
  })
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/callback')
  @ApiOperation({
    summary: 'Facebook callback',
  })
  @UseGuards(AuthGuard('facebook'))
  @UseInterceptors(TokenInterceptor)
  async facebookLoginCallback(@Req() req: RequestWithFullUser) {
    return req.user;
  }
}
