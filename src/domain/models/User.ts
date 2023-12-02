import { IEntity } from '../shared/IEntity';
import { hash } from 'bcrypt';
import { DomainException } from '../exceptions/DomainException';

export class User implements IEntity {
  id?: number;

  name: string;

  email: string;

  password?: string;

  phoneNumber?: string;

  address?: string;

  googleId?: string;

  isActive?: boolean;

  isConfirmed?: boolean;

  createdAt?: Date;

  updatedAt?: Date;

  private static readonly SALT_ROUNDS = 10;

  constructor(
    name: string,
    email: string,
    password?: string,
    phoneNumber?: string,
    address?: string,
    googleId?: string,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.googleId = googleId;
  }

  equals(entity: IEntity) {
    if (!(entity instanceof User)) return false;

    return this.id === entity.id;
  }

  async hashPassword(password: string): Promise<void> {
    const hashedPassword = await hash(password, User.SALT_ROUNDS);
    this.password = hashedPassword;
  }
}
