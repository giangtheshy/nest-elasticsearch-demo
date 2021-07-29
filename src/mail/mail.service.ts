import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendConfirmMail(email: string, name: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      from: `"'No Reply - Confirm Mail'" <${process.env.MAIL_USER}>`,
      subject: 'Confirm your account',
      template: './confirmation',
      context: {
        name,
        url,
      },
    });
  }
}
