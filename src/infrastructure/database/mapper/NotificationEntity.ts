import { BaseEntity } from './BaseEntity';
import { Notification } from 'domain/models/Notification';
import { EntitySchema } from 'typeorm';

export const NotificationEntity = new EntitySchema<Notification>({
  name: 'Notification',
  tableName: 'notifications',
  target: Notification,
  columns: {
    ...BaseEntity,
    receiverId: {
      type: Number,
      name: 'user_id',
      nullable: true,
    },
    title: {
      type: String,
    },
    notificationType: {
      type: String,
      name: 'notification_type',
    },
    link: {
      type: String,
    },
    resourceId: {
      type: Number,
      name: 'resource_id',
      nullable: true,
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
});
