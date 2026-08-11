import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '../app.module.js';
import { GlobalExceptionFilter } from '../platform/http/filters/global-exception.filter.js';
import { configureCors } from './configure-cors.js';
import { configureOpenApi } from './configure-openapi.js';
import { configureSecurity } from './configure-security.js';
import { configureValidation } from './configure-validation.js';

export async function bootstrapApplication(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableShutdownHooks();
  app.setGlobalPrefix(
    `${config.getOrThrow<string>('app.apiPrefix')}/v${config.getOrThrow<number>('app.apiVersion')}`,
  );

  configureSecurity(app);
  configureCors(app);
  configureValidation(app);
  configureOpenApi(app);

  return app;
}
