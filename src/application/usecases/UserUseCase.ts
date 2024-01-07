import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IUsersRepository } from '../ports/IUserRepository';
import { IStorageService } from 'application/ports/IStorageService';
import { UpdateUserVM } from 'presentation/view-model/users/UpdateUserVM';
import { INotificationService } from 'application/ports/INotificationService';
import { IStudentRepository } from 'application/ports/IStudentRepository';

@Injectable()
export class UsersUseCases {
  private readonly logger = new Logger(UsersUseCases.name);

  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly storageService: IStorageService,
    private readonly notification: INotificationService,
    private readonly studentRepository: IStudentRepository,
  ) {}

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

  async updateAvatar(id: number, avatar: Express.Multer.File) {
    this.logger.log(`Updating a user avatar: ${id}`);
    const userExists = await this.usersRepository.findOne({ where: { id } });

    if (!userExists)
      throw new NotFoundException(`The user {${id}} has not found.`);

    const uploadResult = await this.storageService.uploadFile(avatar, '');

    await this.usersRepository.update(id, {
      avatar: uploadResult,
    });

    return uploadResult;
  }

  async getNotifications(userId: number) {
    this.logger.log(`Getting notifications from user: ${userId}`);

    const students = await this.studentRepository.find({
      where: { userId },
    });

    const resourceIds = students.map((student) => student.classId);

    return await this.notification.pullNotification(userId, resourceIds);
  }
}
