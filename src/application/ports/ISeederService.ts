import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ISeederService {
  abstract createAdmin(): Promise<void>;
}
