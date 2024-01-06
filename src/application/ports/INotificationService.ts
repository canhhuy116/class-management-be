import { Injectable } from '@nestjs/common';
import { Notification } from 'domain/models/Notification';
import { NotificationType } from 'domain/models/NotificationType';

@Injectable()
export abstract class INotificationService {
  abstract pushNotification(
    title: string,
    notificationType: NotificationType,
    data: any,
    receiverId: number,
  ): Promise<void>;

  abstract pullNotification(userId: number): Promise<Notification[]>;
}
