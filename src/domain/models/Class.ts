import { IEntity } from 'domain/shared/IEntity';
import { User } from './User';

export class Class implements IEntity {
  id?: number;

  name: string;

  description?: string;

  teachers?: User[];

  students?: User[];

  createdAt?: Date;

  updatedAt?: Date;

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description;
  }

  equals(entity: IEntity) {
    if (!(entity instanceof Class)) return false;

    return this.id === entity.id;
  }
}
