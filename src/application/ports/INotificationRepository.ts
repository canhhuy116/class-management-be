import { Injectable } from '@nestjs/common';
import { Notification } from 'domain/models/Notification';
import { IRepository } from './IRepository';

@Injectable()
export abstract class INotificationRepository extends IRepository<Notification> {}
