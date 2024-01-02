import { hash } from 'bcrypt';
import { DomainException } from '../exceptions/DomainException';
import { BaseModel } from './BaseModel';

export class User extends BaseModel {
  name: string;

  email: string;

  password?: string;

  phoneNumber?: string;

  address?: string;

  googleId?: string;

  facebookId?: string;

  isActive?: boolean;

  isConfirmed?: boolean;

  studentId?: string;

  private static readonly SALT_ROUNDS = 10;

  constructor(
    name: string,
    email: string,
    password?: string,
    phoneNumber?: string,
    address?: string,
    studentId?: string,
    googleId?: string,
    facebookId?: string,
  ) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.studentId = studentId;
    this.googleId = googleId;
    this.facebookId = facebookId;
  }

  async hashPassword(password: string): Promise<void> {
    const hashedPassword = await hash(password, User.SALT_ROUNDS);
    this.password = hashedPassword;
  }
}
