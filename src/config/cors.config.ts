import { registerAs } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => ({
  origins: (process.env.CORS_ORIGINS ?? 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  credentials: process.env.CORS_CREDENTIALS !== 'false',
}));
