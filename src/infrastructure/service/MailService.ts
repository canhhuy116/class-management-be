import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from 'application/ports/IMailService';

@Injectable()
export class MailService implements IMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      text: body,
    });
  }
}
