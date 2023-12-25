import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IClassRepository } from 'application/ports/IClassRepository';
import { IInvitationRepository } from 'application/ports/IInvitationRepository';
import { IMailService } from 'application/ports/IMailService';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { EntityAlreadyExistException } from 'domain/exceptions/EntityAlreadyExistException';
import { EntityNotFoundException } from 'domain/exceptions/EntityNotFoundException';
import { Class } from 'domain/models/Class';
import { Invitation } from 'domain/models/Invitation';
import { Role } from 'domain/models/Role';
import { generateRandomString } from 'utils/random';

@Injectable()
export class ClassUseCases {
  private readonly logger = new Logger(ClassUseCases.name);

  constructor(
    private readonly classRepository: IClassRepository,
    private readonly userRepository: IUsersRepository,
    private readonly invitationRepository: IInvitationRepository,
    private readonly mailService: IMailService,
    private readonly configService: ConfigService,
  ) {}

  async getClasses(currentUserId: number): Promise<Class[]> {
    this.logger.log('Find all classes');

    const classes = await this.classRepository.find({
      relations: ['teachers.teacher', 'students.student'],
    });

    return classes.filter((classEntity) =>
      classEntity.hasMember(currentUserId),
    );
  }

  async showClassDetail(id: number, currentUserId: number): Promise<Class> {
    this.logger.log(`Find the class: ${id}`);

    const classDetail = await this.classRepository.findOne({
      where: { id },
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!classDetail) {
      throw new EntityNotFoundException('Class not found');
    }

    if (!classDetail.hasMember(currentUserId)) {
      throw new ForbiddenException("You don't have permission to access");
    }

    return classDetail;
  }

  async createClass(classDetail: Class): Promise<Class> {
    this.logger.log(`Saving a class`);
    const owner = await this.userRepository.findOne({
      where: { id: classDetail.ownerId },
    });

    classDetail.addTeacher(owner);

    const newClass = await this.classRepository.save(classDetail);

    return newClass;
  }

  async updateClass(classDetail: Class): Promise<boolean> {
    this.logger.log(`Updating a class: ${classDetail.id}`);
    const classExists = await this.classRepository.findOne(classDetail.id);

    if (!classExists) {
      throw new EntityNotFoundException('Class not found');
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
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!classDetail) {
      throw new EntityNotFoundException('Class not found');
    }

    if (!classDetail.hasMember(currentUserId)) {
      throw new ForbiddenException("You don't have permission to access");
    }

    return classDetail;
  }

  async getInvitationCode(classId: number, currentUserId: number) {
    this.logger.log(`Get invitation code from class: ${classId}`);

    const classDetail = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!classDetail) {
      throw new EntityNotFoundException('Class not found');
    }

    if (
      !classDetail.isOwner(currentUserId) &&
      !classDetail.isTeacher(currentUserId)
    ) {
      throw new ForbiddenException("You don't have permission to access");
    }

    const invitation = await this.invitationRepository.findOne({
      where: { classId },
    });

    if (!invitation) {
      const newInvitation = new Invitation(
        generateRandomString(11),
        classDetail.ownerId,
        null,
        classId,
        Role.STUDENT,
      );
      const newInvitationCode =
        await this.invitationRepository.save(newInvitation);

      return newInvitationCode.code;
    }

    return invitation.code;
  }

  async joinClass(
    invitationCode: string,
    currentUserId: number,
    studentId: string,
  ) {
    this.logger.log(`Joining class with invitation code: ${invitationCode}`);

    const invitation = await this.invitationRepository.findOne({
      where: { code: invitationCode },
    });

    if (!invitation) {
      throw new EntityNotFoundException('Invitation code not found');
    }

    const findClass = await this.classRepository.findOne({
      where: { id: invitation.classId },
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!findClass) {
      throw new EntityNotFoundException('Class not found');
    }

    if (findClass.hasMember(currentUserId)) {
      throw new EntityAlreadyExistException('You already joined this class');
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    if (invitation.role === Role.STUDENT && !studentId) {
      throw new ForbiddenException(
        'Student ID is required to join as a student',
      );
    }

    if (
      invitation.inviteeEmail &&
      invitation.inviteeEmail !== currentUser.email
    ) {
      throw new ForbiddenException(
        'This invitation code is not for you. Please ask the owner to send you the invitation code',
      );
    }

    if (invitation.role === Role.STUDENT) {
      const studentExists = findClass.findStudent(studentId);

      if (studentExists) {
        if (studentExists.userId) {
          throw new EntityAlreadyExistException(
            'This student already joined this class',
          );
        }
        studentExists.userId = currentUser.id;
      } else {
        findClass.addStudent(currentUser, studentId);
      }
    } else {
      findClass.addTeacher(currentUser);
    }

    await this.classRepository.save(findClass);

    return findClass;
  }

  async inviteToClass(
    classId: number,
    currentUserId: number,
    email: string,
    role: Role,
  ) {
    this.logger.log(`Invite ${role.toLowerCase()} to class: ${classId}`);

    const classDetail = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!classDetail) {
      throw new EntityNotFoundException('Class not found');
    }

    if (
      !classDetail.isOwner(currentUserId) &&
      !classDetail.isTeacher(currentUserId)
    ) {
      throw new ForbiddenException(
        `You don't have permission to invite ${role.toLowerCase()} to this class`,
      );
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (classDetail.hasMember(user.id)) {
      throw new EntityAlreadyExistException(
        'This user already joined this class',
      );
    }

    const invitation = await this.invitationRepository.findOne({
      where: { classId, inviteeEmail: email },
    });

    if (invitation) {
      throw new EntityAlreadyExistException(
        'This user already invited to this class',
      );
    }

    const newInvitation = new Invitation(
      generateRandomString(11),
      currentUserId,
      email,
      classId,
      role,
    );

    await this.invitationRepository.save(newInvitation);

    const classUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/class/join?code=${newInvitation.code}`;

    const bodyMessage = `You have been invited to join the class ${classDetail.name}. Please click the link below to join the class:\n\n${classUrl}\n\nThanks`;

    await this.mailService.sendMail(
      email,
      `Invitation to join class as ${role.toLowerCase()}`,
      bodyMessage,
    );
  }
}
