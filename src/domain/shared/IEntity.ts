import { DomainException } from '../exceptions/DomainException';
export interface IEntity {
  equals(entity: IEntity): boolean;
}
