import { IEntity } from 'domain/shared/IEntity';
import { RoleClass } from './Role';
import { BaseModel } from './BaseModel';

export class Invitation extends BaseModel {
  code: string;

  inviterId: number;

  inviteeEmail?: string;

  classId: number;

  role: RoleClass;

  constructor(
    code: string,
    inviterId: number,
    inviteeEmail: string,
    classId: number,
    role: RoleClass,
  ) {
    super();
    this.code = code;
    this.inviterId = inviterId;
    this.classId = classId;
    this.role = role;
    this.inviteeEmail = inviteeEmail;
  }
}
