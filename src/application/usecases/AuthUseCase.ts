import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from 'application/dtos/LoginDTO';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IMailService } from 'application/ports/IMailService';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { compare } from 'bcrypt';
import { User } from 'domain/models/User';
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
      throw new UnauthorizedException('User already exists');
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

    // side effect so we don't need to wait for it
    this.mailService.sendMail(newUser.email, 'Confirm your email', confirmLink);
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
      throw new UnauthorizedException('User not found');
    }

    user.isConfirmed = true;

    await this.userRepository.save(user);
  }

  async login(loginData: LoginDTO): Promise<User> {
    this.logger.log('Login user');

    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isConfirmed) {
      throw new UnauthorizedException('User not confirmed');
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
      throw new UnauthorizedException('User not found');
    }

    if (!user.isConfirmed) {
      throw new UnauthorizedException('User not confirmed');
    }

    return user;
  }
}
