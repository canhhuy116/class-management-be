import { INotificationRepository } from 'application/ports/INotificationRepository';
import { Notification } from './../../../domain/models/Notification';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ClassEntity } from '../mapper/ClassEntity';
import { BaseRepository } from './BaseRepository';
@Injectable()
export class NotificationRepository
  extends BaseRepository<Notification>
  implements INotificationRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, ClassEntity);
  }
}
