import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IExcelService } from 'application/ports/IExcelService';
import { IInvitationRepository } from 'application/ports/IInvitationRepository';
import { IMailService } from 'application/ports/IMailService';
import { IStorageService } from 'application/ports/IStorageService';
import { IStudentRepository } from 'application/ports/IStudentRepository';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { contains } from 'class-validator';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { Class, FilterClass } from 'domain/models/Class';
import { User } from 'domain/models/User';
import { UpsertClassVM } from 'presentation/view-model/classes/CreateClassVM';
import { UpdateUserVM } from 'presentation/view-model/users/UpdateUserVM';
import { Like } from 'typeorm';
import { Paging } from 'utils/paging';

@Injectable()
export class AdminUseCases {
  private readonly logger = new Logger(AdminUseCases.name);
  private readonly columnExcelMapStudentId = [
    'User ID',
    'Name',
    'Email',
    'Student ID',
  ];

  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly classRepository: IClassRepository,
    private readonly excelService: IExcelService,
    private readonly studentRepository: IStudentRepository,
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

  async mapStudentIdToUser(
    id: number,
    studentId: string,
    classId: number,
  ): Promise<boolean> {
    this.logger.log(`Mapping studentId to a user: ${id}`);

    const userExists = await this.usersRepository.findOne({ where: { id } });

    if (!userExists)
      throw new NotFoundException(`The user {${id}} has not found.`);

    const findStudents = await this.studentRepository.find({
      where: { classId },
    });

    const studentExists = findStudents.find(
      (student) => student.studentId === studentId,
    );

    if (studentExists)
      throw new EntityAlreadyExistException(
        `The student ${studentId} already exists.`,
      );

    const userInClass = findStudents.find((student) => student.userId === id);

    if (!userInClass)
      throw new NotFoundException(
        `The user {${userExists.name} is not in the class.`,
      );

    userInClass.studentId = studentId;

    const result = await this.studentRepository.update(
      userInClass.id,
      userInClass,
    );

    return result.affected > 0;
  }

  async unMapStudentIdToUser(id: number, classId: number): Promise<boolean> {
    this.logger.log(`unMapping studentId to a user: ${id}`);

    const userExists = await this.usersRepository.findOne({ where: { id } });

    if (!userExists)
      throw new NotFoundException(`The user {${id}} has not found.`);

    const findStudents = await this.studentRepository.find({
      where: { classId, userId: id },
    });

    if (findStudents.length !== 1) {
      throw new NotFoundException(
        `The user {${userExists.name} is not in the class.`,
      );
    }

    findStudents[0].studentId = null;

    const result = await this.studentRepository.update(
      findStudents[0].id,
      findStudents[0],
    );

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

  async adminShowClassDetail(id: number): Promise<Class> {
    this.logger.log(`Find the class: ${id}`);

    const classDetail = await this.classRepository.findOne({
      where: { id },
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!classDetail) {
      throw new EntityNotFoundException('Class not found');
    }

    return classDetail;
  }

  async getClassesByAdmin(
    paging: Paging,
    filter?: FilterClass,
    searchQuery?: String,
  ): Promise<Class[]> {
    this.logger.log(`Find all classes`);

    const { page, limit } = paging;
    const classes = await this.classRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['teachers.teacher', 'students.student'],
      where: searchQuery ? { name: Like(`%${searchQuery}%`) } : {},
      order: filter ? { [filter.sortField]: filter.order } : {},
    });

    paging.total = await this.classRepository.count({
      where: searchQuery ? { name: Like(`%${searchQuery}%`) } : {},
    });

    return classes;
  }

  async updateClassByAdmin(id: number, classUpdate: UpsertClassVM) {
    this.logger.log(`Updating a class: ${id}`);

    const classExists = await this.classRepository.findOne({
      where: { id },
    });

    if (!classExists) {
      throw new EntityNotFoundException('Class not found');
    }

    for (const key in classUpdate) {
      if (classUpdate[key]) classExists[key] = classUpdate[key];
    }

    const result = await this.classRepository.update(id, classExists);

    return result.affected > 0;
  }

  async deleteClassByAdmin(id: number): Promise<boolean> {
    this.logger.log(`Deleting a class: ${id}`);

    const classExists = await this.classRepository.findOne({
      where: { id },
    });

    if (!classExists) {
      throw new EntityNotFoundException('Class not found');
    }

    const result = await this.classRepository.delete(id);

    return result.affected > 0;
  }

  async inactiveClassByAdmin(id: number): Promise<boolean> {
    this.logger.log(`Inactive a class: ${id}`);

    const classExists = await this.classRepository.findOne({
      where: { id },
    });

    if (!classExists) {
      throw new EntityNotFoundException('Class not found');
    }

    classExists.inactive();

    const result = await this.classRepository.update(id, classExists);

    return result.affected > 0;
  }

  async activeClassByAdmin(id: number): Promise<boolean> {
    this.logger.log(`Active a class: ${id}`);

    const classExists = await this.classRepository.findOne({
      where: { id },
    });

    if (!classExists) {
      throw new EntityNotFoundException('Class not found');
    }

    classExists.active();

    const result = await this.classRepository.update(id, classExists);

    return result.affected > 0;
  }
}
