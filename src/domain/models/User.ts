import { IEntity } from '../shared/IEntity';
import { DomainException } from '../exceptions/DomainException';

export class User implements IEntity {
  id?: number;

  name: string;

  email: string;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(name: string, email: string, id?: number) {
    this.name = name;
    this.email = email;
    this.id = id;
  }

  equals(entity: IEntity) {
    if (!(entity instanceof User)) return false;

    return this.id === entity.id;
  }
}
