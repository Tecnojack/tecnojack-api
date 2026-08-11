import { Module } from '@nestjs/common';
import { PeopleModule } from '../people/people.module.js';
import { CRMModule } from '../crm/crm.module.js';
import { NOTIFICATION_REPOSITORY } from './application/ports/notification.repository.port.js';
import { PrismaNotificationRepository } from './infrastructure/persistence/prisma/repositories/prisma-notification.repository.js';
import { SendNotificationUseCase } from './application/send-notification/send-notification.use-case.js';
import { ManageNotificationUseCase } from './application/manage-notification/manage-notification.use-case.js';
import { ManageNotificationTemplatesUseCase } from './application/manage-notification-templates/manage-notification-templates.use-case.js';
import { ListNotificationsUseCase } from './application/list-notifications/list-notifications.use-case.js';
import { NotificationDispatcher } from './application/services/notification.dispatcher.js';
import { NotificationProviderFactory } from './application/services/notification-provider.factory.js';
import { NotificationRecipientResolver } from './application/services/notification-recipient-resolver.js';
import { NotificationTemplateRenderer } from './application/services/notification-template-renderer.js';
import { NotificationsController } from './presentation/http/controllers/notifications.controller.js';
import { NotificationFacade } from './public/notification.facade.js';

@Module({
  imports: [PeopleModule, CRMModule],
  controllers: [NotificationsController],
  providers: [
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: PrismaNotificationRepository,
    },
    SendNotificationUseCase,
    ManageNotificationUseCase,
    ManageNotificationTemplatesUseCase,
    ListNotificationsUseCase,
    NotificationDispatcher,
    NotificationProviderFactory,
    NotificationRecipientResolver,
    NotificationTemplateRenderer,
    NotificationFacade,
  ],
  exports: [NotificationFacade, NOTIFICATION_REPOSITORY],
})
export class NotificationsModule {}
