import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from 'application/dtos/LoginDTO';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IMailService } from 'application/ports/IMailService';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { compare } from 'bcrypt';
import { User } from 'domain/models/User';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { ResetPasswordDTO } from 'application/dtos/ResetPasswordDTO';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
@Injectable()
export class AuthUseCase {
  private readonly logger = new Logger(AuthUseCase.name);

  constructor(
    private readonly userRepository: IUsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: IMailService,
    private readonly configService: ConfigService,
  ) {}

  async signup(user: User): Promise<void> {
    const findUser: User = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (findUser) {
      throw new EntityAlreadyExistException('User already exists');
    }

    await user.hashPassword(user.password);

    const newUser: User = await this.userRepository.save(user);

    if (!newUser) {
      throw new InternalServerErrorException('Error creating user');
    }

    const secretKeyConfirmEmail = this.configService.get('SECRET_KEY_CONFIRM');

    const token = this.signToken(
      { id: newUser.id },
      { secret: secretKeyConfirmEmail, expiresIn: '15m' },
    );

    const confirmLink = `${this.configService.get(
      'FRONTEND_URL',
    )}/confirm?token=${token}`;

    const bodyMessage = `Hello ${newUser.name},\n\nPlease confirm your email by clicking on the link below.\n\n${confirmLink}\n\nThanks`;

    // side effect so we don't need to wait for it
    this.mailService.sendMail(newUser.email, 'Confirm your email', bodyMessage);
  }

  async confirmEmail(token: string): Promise<void> {
    const secretKeyConfirmEmail = this.configService.get('SECRET_KEY_CONFIRM');

    const payload = this.jwtService.verify(token, {
      secret: secretKeyConfirmEmail,
    });

    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new EntityNotFoundException('User not found');
    }

    user.isConfirmed = true;

    await this.userRepository.save(user);
  }

  async resendConfirmEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new EntityNotFoundException('User not found');
    }

    if (user.isConfirmed) {
      throw new EntityAlreadyExistException('User already confirmed');
    }

    const secretKeyConfirmEmail = this.configService.get('SECRET_KEY_CONFIRM');

    const token = this.signToken(
      { id: user.id },
      { secret: secretKeyConfirmEmail, expiresIn: '15m' },
    );

    const confirmLink = `${this.configService.get(
      'FRONTEND_URL',
    )}/confirm?token=${token}`;

    const bodyMessage = `Hello ${user.name},\n\nPlease confirm your email by clicking on the link below.\n\n${confirmLink}\n\nThanks`;

    // side effect so we don't need to wait for it
    this.mailService.sendMail(user.email, 'Confirm your email', bodyMessage);
  }

  async login(loginData: LoginDTO): Promise<User> {
    this.logger.log('Login user');

    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new EntityNotFoundException('User not found');
    }

    if (!user.isConfirmed) {
      throw new ForbiddenException('User not confirmed');
    }

    const passwordMatch = await compare(loginData.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password or email');
    }

    return user;
  }

  signToken(payload: object | Buffer, options?: JwtSignOptions): string {
    const token = this.jwtService.sign(payload, options);

    return token;
  }

  async verifyPayload(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new EntityNotFoundException('User not found');
    }

    if (!user.isConfirmed) {
      throw new ForbiddenException('User not confirmed');
    }

    return user;
  }

  async getMe(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new EntityNotFoundException('User not found');
    }

    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new EntityNotFoundException('User not found');
    }

    const secretKeyForgotPassword = this.configService.get(
      'SECRET_KEY_FORGOT_PASSWORD',
    );

    const token = this.signToken(
      { id: user.id },
      { secret: secretKeyForgotPassword, expiresIn: '15m' },
    );

    const forgotPasswordLink = `${this.configService.get(
      'FRONTEND_URL',
    )}/reset-password?token=${token}`;

    const bodyMessage = `Hello ${user.name},\n\nYou requested to reset your password. Please click on the link below to reset it.\n\n${forgotPasswordLink}\n\nIf you didn't request this, please ignore this email.\n\nThanks`;

    // side effect so we don't need to wait for it
    this.mailService.sendMail(user.email, 'Reset your password', bodyMessage);
  }

  async resetPassword(resetPasswordData: ResetPasswordDTO): Promise<void> {
    const { token, password: newPassword } = resetPasswordData;

    const secretKeyForgotPassword = this.configService.get(
      'SECRET_KEY_FORGOT_PASSWORD',
    );

    const payload = this.jwtService.verify(token, {
      secret: secretKeyForgotPassword,
    });

    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new EntityNotFoundException('User not found');
    }

    await user.hashPassword(newPassword);

    await this.userRepository.save(user);
  }

  async loginByGoogle(profile: any): Promise<User> {
    const { id, displayName, emails } = profile;

    const user = await this.userRepository.findOne({
      where: { email: emails[0].value },
    });

    if (user) {
      if (!user.isConfirmed) {
        user.isConfirmed = true;
        await this.userRepository.save(user);
      }
      return user;
    }

    const newUser = new User(
      displayName,
      emails[0].value,
      null,
      null,
      null,
      id,
    );

    newUser.isConfirmed = true;

    const createdUser = await this.userRepository.save(newUser);

    return createdUser;
  }
}
