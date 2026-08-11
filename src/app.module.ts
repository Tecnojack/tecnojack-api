import { MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { configurationFactories } from './config/index.js';
import { validateEnvironment } from './config/env.schema.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ClientPortalModule } from './modules/client-portal/client-portal.module.js';
import { ContractsModule } from './modules/contracts/contracts.module.js';
import { CRMModule } from './modules/crm/crm.module.js';
import { IdentityModule } from './modules/identity/identity.module.js';
import { AdministrationModule } from './modules/administration/administration.module.js';
import { InvitationsModule } from './modules/invitations/invitations.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { DeliverablesModule } from './modules/deliverables/deliverables.module.js';
import { EventsModule } from './modules/events/events.module.js';
import { GalleryModule } from './modules/gallery/gallery.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { PeopleModule } from './modules/people/people.module.js';
import { StorageModule } from './modules/storage/storage.module.js';
import { SystemModule } from './modules/system/system.module.js';
import { PlatformModule } from './platform/platform.module.js';
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
    PlatformModule,
    AuthModule,
    SystemModule,
    PeopleModule,
    StorageModule,
    MediaModule,
    EventsModule,
    GalleryModule,
    DeliverablesModule,
    ClientPortalModule,
    ContractsModule,
    CRMModule,
    IdentityModule,
    AdministrationModule,
    InvitationsModule,
    NotificationsModule,
    PaymentsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*splat');
  }
}
