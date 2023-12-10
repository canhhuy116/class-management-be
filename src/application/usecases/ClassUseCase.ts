import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { Class } from 'domain/models/Class';

@Injectable()
export class ClassUseCases {
  private readonly logger = new Logger(ClassUseCases.name);

  constructor(
    private readonly classRepository: IClassRepository,
    private readonly userRepository: IUsersRepository,
  ) {}

  async getClasses(currentUserId: number): Promise<Class[]> {
    this.logger.log('Find all classes');

    const classes: Class[] = await this.classRepository.find({
      relations: ['teachers', 'students'],
    });

    return classes.filter(
      (classEntity) =>
        classEntity.ownerId === currentUserId ||
        classEntity.teachers.some((teacher) => teacher.id === currentUserId) ||
        classEntity.students.some((student) => student.id === currentUserId),
    );
  }

  async showClassDetail(id: number, currentUserId: number): Promise<Class> {
    this.logger.log(`Find the class: ${id}`);

    const classDetail = await this.classRepository.findOne({
      where: { id },
      relations: ['teachers', 'students'],
    });

    if (!classDetail) {
      throw new EntityNotFoundException('Class not found');
    }

    if (
      classDetail.ownerId !== currentUserId &&
      !classDetail.teachers.some((teacher) => teacher.id === currentUserId) &&
      !classDetail.students.some((student) => student.id === currentUserId)
    ) {
      throw new ForbiddenException("You don't have permission to access");
    }

    return classDetail;
  }

  async createClass(classDetail: Class): Promise<void> {
    this.logger.log(`Saving a class`);
    const owner = await this.userRepository.findOne({
      where: { id: classDetail.ownerId },
    });

    classDetail.addTeacher(owner);

    await this.classRepository.save(classDetail);
  }

  async updateClass(classDetail: Class): Promise<boolean> {
    this.logger.log(`Updating a class: ${classDetail.id}`);
    const classExists = await this.classRepository.findOne(classDetail.id);

    if (!classExists) {
      throw new Error('Class not found');
    }

    const result = await this.classRepository.update(
      classDetail.id,
      classDetail,
    );

    return result.affected > 0;
  }

  async deleteClass(id: number): Promise<boolean> {
    this.logger.log(`Deleting a class: ${id}`);
    const result = await this.classRepository.delete(id);

    return result.affected > 0;
  }

  async showTeachersAndStudents(
    id: number,
    currentUserId: number,
  ): Promise<Class> {
    this.logger.log(`Find the class: ${id}`);

    const classDetail = await this.classRepository.findOne({
      where: { id },
      relations: ['teachers', 'students'],
    });

    if (!classDetail) {
      throw new Error('Class not found');
    }

    if (
      classDetail.ownerId !== currentUserId &&
      !classDetail.teachers.some((teacher) => teacher.id === currentUserId) &&
      !classDetail.students.some((student) => student.id === currentUserId)
    ) {
      throw new ForbiddenException("You don't have permission to access");
    }

    return classDetail;
  }
}
