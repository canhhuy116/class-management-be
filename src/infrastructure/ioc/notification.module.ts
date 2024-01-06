import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { INotificationRepository } from 'application/ports/INotificationRepository';
import { INotificationService } from 'application/ports/INotificationService';
import { NotificationRepository } from 'infrastructure/database/repository/NotificationRepository';
import { NotificationService } from 'infrastructure/service/NotificationService';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: INotificationService,
      useClass: NotificationService,
    },
    {
      provide: INotificationRepository,
      useClass: NotificationRepository,
    },
  ],
  exports: [INotificationService],
})
export class NotificationModule {}
