import { MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { configurationFactories } from './config/index.js';
import { validateEnvironment } from './config/env.schema.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { PeopleModule } from './modules/people/people.module.js';
import { SystemModule } from './modules/system/system.module.js';
import { PrismaModule } from './platform/database/prisma/prisma.module.js';
import { RequestIdMiddleware } from './platform/http/middleware/request-id.middleware.js';
import { LoggingModule } from './platform/logging/logging.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: false,
      load: configurationFactories,
      validate: validateEnvironment,
    }),
    LoggingModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'default',
          ttl: configService.getOrThrow<number>('rateLimit.ttlMs'),
          limit: configService.getOrThrow<number>('rateLimit.limit'),
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    SystemModule,
    PeopleModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*splat');
  }
}
