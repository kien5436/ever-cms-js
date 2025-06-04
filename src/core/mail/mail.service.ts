import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

import { Messaging } from 'src/common/interfaces/messaging.interface';
import { EnvService } from '../env/env.service';

@Injectable()
export class MailService implements Messaging {

  private transporter: Mail;

  constructor(private readonly envService: EnvService) {

    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: envService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: envService.get('SMTP_USER'),
        pass: envService.get('SMTP_PASSWORD'),
      },
    });
  }

  async send(message: string, options: Mail.Options): Promise<void> {

    options.text = message;

    await this.transporter.sendMail(options);
  }
}
