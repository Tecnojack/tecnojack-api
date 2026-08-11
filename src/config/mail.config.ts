import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
  provider: process.env.MAIL_PROVIDER ?? 'log',
}));
