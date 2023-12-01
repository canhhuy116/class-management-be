import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { User } from 'domain/models/User';

@Injectable()
export class AuthUseCase {
  private readonly logger = new Logger(AuthUseCase.name);

  constructor(private readonly userRepository: IUsersRepository) {}

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
  }
}
