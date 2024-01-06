import { Expose, plainToClass } from 'class-transformer';
import { Notification } from 'domain/models/Notification';
export class NotificationVM {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  notificationType: string;

  @Expose()
  link: string;

  static toViewModel(notification: Notification): NotificationVM {
    return plainToClass(NotificationVM, notification, {
      excludeExtraneousValues: true,
    });
  }
}
