import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IUsersRepository } from '../ports/IUserRepository';
import { User } from 'domain/models/User';
import { IStorageService } from 'application/ports/IStorageService';
import { UpdateUserVM } from 'presentation/view-model/users/UpdateUserVM';
import { INotificationService } from 'application/ports/INotificationService';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { IExcelService } from 'application/ports/IExcelService';

@Injectable()
export class UsersUseCases {
  private readonly logger = new Logger(UsersUseCases.name);
  private readonly columnExcelMapStudentId = [
    'User ID',
    'Name',
    'Email',
    'Student ID',
  ];

  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly storageService: IStorageService,
    private readonly notification: INotificationService,
    private readonly studentRepository: IStudentRepository,
    private readonly excelService: IExcelService,
  ) {}

  async getUsers(): Promise<User[]> {
    this.logger.log('Find all users');

    return await this.usersRepository.find({ loadEagerRelations: true });
  }

  async getUserById(id: number): Promise<User> {
    this.logger.log(`Find the user: ${id}`);

    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException(`The user {${id}} has not found.`);

    return user;
  }

  async createUser(user: User): Promise<User> {
    this.logger.log(`Saving a user`);

    const userExists = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (userExists)
      throw new EntityAlreadyExistException(`The user already exists.`);

    await user.hashPassword(user.password);

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

    const userExists = await this.usersRepository.findOne({ where: { id } });

    if (!userExists)
      throw new NotFoundException(`The user {${id}} has not found.`);

    const result = await this.usersRepository.delete(id);

    return result.affected > 0;
  }

  async lockUser(id: number): Promise<boolean> {
    this.logger.log(`Locking a user: ${id}`);

    const userExists = await this.usersRepository.findOne({ where: { id } });

    if (!userExists)
      throw new NotFoundException(`The user {${id}} has not found.`);

    userExists.lockAccount();

    const result = await this.usersRepository.update(id, userExists);

    return result.affected > 0;
  }

  async mapStudentIdToUser(id: number, studentId: string): Promise<boolean> {
    this.logger.log(`Mapping studentId to a user: ${id}`);

    const userExists = await this.usersRepository.findOne({ where: { id } });

    if (!userExists)
      throw new NotFoundException(`The user {${id}} has not found.`);

    userExists.mapStudentId(studentId);

    const result = await this.usersRepository.update(id, userExists);

    return result.affected > 0;
  }

  async unMapStudentIdToUser(id: number): Promise<boolean> {
    this.logger.log(`unMapping studentId to a user: ${id}`);

    const userExists = await this.usersRepository.findOne({ where: { id } });

    if (!userExists)
      throw new NotFoundException(`The user {${id}} has not found.`);

    userExists.unMapStudentId();

    const result = await this.usersRepository.update(id, userExists);

    return result.affected > 0;
  }

  async exportUsersToExcel(): Promise<Buffer> {
    this.logger.log(`Exporting users to excel`);

    const users = await this.usersRepository.find({ loadEagerRelations: true });

    const userIds = users.map((user) => user.id);
    const emails = users.map((user) => user.email);
    const names = users.map((user) => user.name);

    const dataMap = new Map<number, any[]>();
    dataMap.set(0, userIds);
    dataMap.set(1, names);
    dataMap.set(2, emails);

    return await this.excelService.generateExcelTemplate(
      'Users',
      this.columnExcelMapStudentId,
      dataMap,
    );
  }

  async mapStudentIdToUserWithExcel(file: Express.Multer.File) {
    this.logger.log(`Mapping studentId to a user with excel file`);

    const buffer: Buffer = file.buffer;

    const students = await this.excelService.excelToEntities(
      buffer,
      this.columnExcelMapStudentId,
    );

    const studentsWithUser = await Promise.all(
      students.map(async (student) => {
        const user = await this.usersRepository.findOne({
          where: { id: student[this.columnExcelMapStudentId[0]] },
        });

        if (!user) throw new NotFoundException(`The user has not found.`);

        user.mapStudentId(student[this.columnExcelMapStudentId[3]]);

        return user;
      }),
    );

    await this.usersRepository.save(studentsWithUser);

    return true;
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
