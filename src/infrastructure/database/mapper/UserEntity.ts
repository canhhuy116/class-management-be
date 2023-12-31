import { RoleSystem } from 'domain/models/Role';
import { BaseEntity } from './BaseEntity';
import { User } from 'domain/models/User';
import { EntitySchema } from 'typeorm';

export const UserEntity = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  target: User,
  columns: {
    ...BaseEntity,
    name: {
      type: String,
      length: 100,
    },
    email: {
      type: String,
      length: 100,
    },
    password: {
      type: String,
      length: 100,
      nullable: true,
    },
    role: {
      type: String,
      length: 100,
      default: RoleSystem.USER,
    },
    phoneNumber: {
      type: String,
      length: 20,
      nullable: true,
      name: 'phone_number',
    },
    address: {
      type: String,
      length: 100,
      nullable: true,
    },
    googleId: {
      type: String,
      length: 100,
      nullable: true,
      name: 'google_id',
    },
    facebookId: {
      type: String,
      length: 100,
      nullable: true,
      name: 'facebook_id',
    },
    isActive: {
      type: Boolean,
      default: true,
      name: 'is_active',
    },
    isConfirmed: {
      type: Boolean,
      default: false,
      name: 'is_confirmed',
    },
    studentId: {
      type: String,
      length: 100,
      nullable: true,
    },
    avatar: {
      type: String,
      nullable: true,
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {},
  indices: [
    {
      name: 'IDX_USERS',
      unique: true,
      columns: ['name', 'email'],
    },
  ],
  uniques: [
    {
      name: 'UNIQUE_USERS',
      columns: ['email'],
    },
  ],
});
