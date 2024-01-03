import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IUsersRepository } from '../ports/IUserRepository';
import { User } from 'domain/models/User';
import { IStorageService } from 'application/ports/IStorageService';
import { UpdateUserVM } from 'presentation/view-model/users/UpdateUserVM';

@Injectable()
export class UsersUseCases {
  private readonly logger = new Logger(UsersUseCases.name);

  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly storageService: IStorageService,
  ) {}

  async getUsers(): Promise<User[]> {
    this.logger.log('Find all users');

    return await this.usersRepository.find({ loadEagerRelations: true });
  }

  async getUserById(id: number): Promise<User> {
    this.logger.log(`Find the user: ${id}`);

    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundException(`The user {${id}} has not found.`);

    return user;
  }

  async createUser(user: User): Promise<User> {
    this.logger.log(`Saving a user`);
    return await this.usersRepository.save(user);
  }

  async updateUser(userId: number, userUpdate: UpdateUserVM): Promise<boolean> {
    this.logger.log(`Updating a user: ${userId}`);
    const userExists = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!userExists)
      throw new NotFoundException(`The user {${userId}} has not found.`);

    for (const key in userUpdate) {
      if (userUpdate[key]) userExists[key] = userUpdate[key];
    }

    const result = await this.usersRepository.update(userId, userExists);

    return result.affected > 0;
  }

  async deleteUser(id: number): Promise<boolean> {
    this.logger.log(`Deleting a user: ${id}`);
    const result = await this.usersRepository.delete(id);

    return result.affected > 0;
  }

  async updateAvatar(
    id: number,
    avatar: Express.Multer.File,
  ): Promise<boolean> {
    this.logger.log(`Updating a user avatar: ${id}`);
    const userExists = await this.usersRepository.findOne({ where: { id } });

    if (!userExists)
      throw new NotFoundException(`The user {${id}} has not found.`);

    const uploadResult = await this.storageService.uploadFile(avatar, '');

    const result = await this.usersRepository.update(id, {
      avatar: uploadResult,
    });

    return result.affected > 0;
  }
}
