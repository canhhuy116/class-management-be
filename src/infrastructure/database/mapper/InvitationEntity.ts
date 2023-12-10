import { EntitySchema } from 'typeorm';
import { Invitation } from 'domain/models/Invitation';
import { BaseEntity } from './BaseEntity';

export const InvitationEntity = new EntitySchema<Invitation>({
  name: 'Invitation',
  tableName: 'invitations',
  target: Invitation,
  columns: {
    ...BaseEntity,
    code: {
      type: String,
      length: 100,
    },
    inviterId: {
      type: Number,
      name: 'inviter_id',
    },
    inviteeEmail: {
      type: String,
      length: 100,
      name: 'invitee_email',
      nullable: true,
    },
    classId: {
      type: Number,
      name: 'class_id',
    },
    role: {
      type: String,
      length: 100,
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {
    inviterId: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'inviter_id',
      },
    },
    classId: {
      type: 'many-to-one',
      target: 'Class',
      joinColumn: {
        name: 'class_id',
      },
    },
  },
  indices: [
    {
      name: 'IDX_INVITATION_CODE',
      unique: true,
      columns: ['code'],
    },
  ],
});
