import { registerAs } from '@nestjs/config';

export const rateLimitConfig = registerAs('rateLimit', () => ({
  ttlMs: Number(process.env.RATE_LIMIT_TTL_MS ?? 60_000),
  limit: Number(process.env.RATE_LIMIT_LIMIT ?? 100),
}));
