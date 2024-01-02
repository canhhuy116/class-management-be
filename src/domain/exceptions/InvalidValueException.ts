import { DomainException } from './DomainException';

export class InvalidValueException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
