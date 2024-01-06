import { BaseModel } from './BaseModel';
import { NotificationType } from './NotificationType';

export class Notification extends BaseModel {
  title: string;
  notificationType: string;
  link: string;
  receiverId: number;
  resourceId: number;

  constructor(title: string, notificationType: string, link: string) {
    super();
    this.title = title;
    this.notificationType = notificationType;
    this.link = link;
  }

  sendTo(receiverId: number): void {
    if (this.notificationType === NotificationType.MARK_FINAl_GRADE) {
      this.resourceId = receiverId;
    } else {
      this.receiverId = receiverId;
    }
  }
}
