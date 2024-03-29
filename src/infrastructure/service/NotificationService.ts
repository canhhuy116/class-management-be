import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { INotificationRepository } from 'application/ports/INotificationRepository';
import { INotificationService } from 'application/ports/INotificationService';
import { Notification } from 'domain/models/Notification';
import { NotificationType } from 'domain/models/NotificationType';
import { In } from 'typeorm';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly configService: ConfigService,
  ) {}

  private buildLink(notificationType: NotificationType, data: any): string {
    switch (notificationType) {
      case NotificationType.MARK_FINAl_GRADE:
        return `${this.configService.get('FRONTEND_URL')}/class/${
          data.classId
        }/scores`;
      case NotificationType.REQUEST_REVIEW:
        return `${this.configService.get('FRONTEND_URL')}/grade/${
          data.gradeReviewId
        }`;
      case NotificationType.REVIEW_REQUEST:
        return `${this.configService.get('FRONTEND_URL')}/grade/${
          data.gradeReviewId
        }`;
      case NotificationType.REVIEW_COMMENT:
        return `${this.configService.get('FRONTEND_URL')}/grade/${
          data.gradeReviewId
        }`;
      default:
        throw new BadRequestException('Invalid notification type');
    }
  }

  async pushNotification(
    title: string,
    notificationType: NotificationType,
    data: any,
    receiverId: number,
  ): Promise<void> {
    const link = this.buildLink(notificationType, data);
    const notification = new Notification(title, notificationType, link);

    notification.sendTo(receiverId);

    await this.notificationRepository.save(notification);
  }

  async pullNotification(
    userId: number,
    resourceIds: number[],
  ): Promise<Notification[]> {
    const findNotifications = await this.notificationRepository.find({
      where: [{ receiverId: userId }, { resourceId: In(resourceIds) }],
    });

    return findNotifications;
  }
}
