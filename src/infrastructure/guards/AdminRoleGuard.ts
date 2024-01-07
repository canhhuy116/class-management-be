import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IUsersRepository } from 'application/ports/IUserRepository';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const currentUserId = user.userId;

    const currentUser = await this.usersRepository.findOne({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      return false;
    }

    return currentUser.isAdmin();
  }
}
