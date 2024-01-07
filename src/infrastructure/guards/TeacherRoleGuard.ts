import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IClassRepository } from 'application/ports/IClassRepository';

@Injectable()
export class TeacherRoleGuard implements CanActivate {
  constructor(private readonly classRepository: IClassRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const headers = request.headers;

    if (!user) {
      return false;
    }

    const currentUserId = user.userId;
    const currentClassId = headers['class-id'];

    if (!currentClassId || isNaN(+currentClassId)) {
      return false;
    }

    const currentClass = await this.classRepository.findOne({
      where: { id: currentClassId, isActive: true },
      relations: ['teachers.teacher', 'students.student'],
    });

    if (!currentClass) {
      return false;
    }

    return currentClass.isTeacher(currentUserId);
  }
}
