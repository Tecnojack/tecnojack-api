import { Injectable, Inject } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepositoryPort,
} from '../ports/notification.repository.port.js';
import { Notification } from '../../domain/entities/notification.entity.js';
import { NotificationRecipient } from '../../domain/entities/notification-recipient.entity.js';
import { NotificationChannel, NotificationPriority } from '../../domain/enums/notifications.enums.js';
import { NotificationDispatcher } from '../services/notification.dispatcher.js';
import { NotificationRecipientResolver } from '../services/notification-recipient-resolver.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface CreateNotificationCommand {
  templateCode?: string;
  channel: NotificationChannel;
  priority?: NotificationPriority;
  variables?: Record<string, string>;
  scheduledFor?: Date;
  recipients: {
    personId?: string;
    recipientAddress?: string;
  }[];
  actorId?: string;
}

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: NotificationRepositoryPort,
    private readonly dispatcher: NotificationDispatcher,
    private readonly recipientResolver: NotificationRecipientResolver,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: CreateNotificationCommand): Promise<Notification> {
    let templateId: string | null = null;
    const combinedVariables = { ...command.variables };

    if (command.templateCode) {
      const template = await this.repo.findTemplateByCode(command.templateCode);
      if (template) {
        templateId = template.id;
      }
    }

    const code = await this.repo.nextCode();
    const notification = Notification.create(
      {
        code,
        templateId,
        channel: command.channel,
        priority: command.priority,
        variables: combinedVariables,
        scheduledFor: command.scheduledFor,
      },
      command.actorId,
    );

    for (const r of command.recipients) {
      let address = r.recipientAddress ?? '';
      if (r.personId && !address) {
        address = await this.recipientResolver.resolveAddress(r.personId, command.channel);
      }

      if (address) {
        notification.addRecipient(
          new NotificationRecipient({
            personId: r.personId,
            recipientAddress: address,
          }),
        );
      }
    }

    const saved = await this.repo.save(notification);
    await this.eventPublisher.publishAll(notification.domainEvents);
    notification.clearDomainEvents();

    if (!command.scheduledFor) {
      await this.dispatcher.dispatch(saved);
    }

    return saved;
  }
}
