import { INotificationRepository } from 'application/ports/INotificationRepository';
import { Notification } from './../../../domain/models/Notification';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { NotificationEntity } from '../mapper/NotificationEntity';
@Injectable()
export class NotificationRepository
  extends BaseRepository<Notification>
  implements INotificationRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, NotificationEntity);
  }
}
