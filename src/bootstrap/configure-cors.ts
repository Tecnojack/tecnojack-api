import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureCors(app: INestApplication): void {
  const config = app.get(ConfigService);
  const origins = config.getOrThrow<string[]>('cors.origins');

  app.enableCors({
    origin: origins,
    credentials: config.get<boolean>('cors.credentials', true),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'Idempotency-Key', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86_400,
  });
}
