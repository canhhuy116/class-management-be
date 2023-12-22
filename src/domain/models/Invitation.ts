import { IEntity } from 'domain/shared/IEntity';
import { Role } from './Role';
import { BaseModel } from './BaseModel';

export class Invitation extends BaseModel {
  code: string;

  inviterId: number;

  inviteeEmail?: string;

  classId: number;

  role: Role;

  constructor(
    code: string,
    inviterId: number,
    inviteeEmail: string,
    classId: number,
    role: Role,
  ) {
    super();
    this.code = code;
    this.inviterId = inviterId;
    this.classId = classId;
    this.role = role;
    this.inviteeEmail = inviteeEmail;
  }
}
