import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IMailService {
  abstract sendMail(to: string, subject: string, body: string): Promise<void>;
}
