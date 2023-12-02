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
