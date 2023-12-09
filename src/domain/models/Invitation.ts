import { IEntity } from 'domain/shared/IEntity';

export class Invitation implements IEntity {
  id?: number;

  code: string;

  inviterId: number;

  inviteeEmail: string;

  classId: number;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(code: string, inviterId: number, classId: number) {
    this.code = code;
    this.inviterId = inviterId;
    this.classId = classId;
  }

  equals(entity: IEntity) {
    if (!(entity instanceof Invitation)) return false;

    return this.id === entity.id;
  }
}
