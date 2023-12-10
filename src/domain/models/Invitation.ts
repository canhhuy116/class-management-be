import { IEntity } from 'domain/shared/IEntity';
import { Role } from './Role';

export class Invitation implements IEntity {
  id?: number;

  code: string;

  inviterId: number;

  inviteeEmail?: string;

  classId: number;

  role: Role;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(
    code: string,
    inviterId: number,
    inviteeEmail: string,
    classId: number,
    role: Role,
  ) {
    this.code = code;
    this.inviterId = inviterId;
    this.classId = classId;
    this.role = role;
    this.inviteeEmail = inviteeEmail;
  }

  equals(entity: IEntity) {
    if (!(entity instanceof Invitation)) return false;

    return this.id === entity.id;
  }
}
