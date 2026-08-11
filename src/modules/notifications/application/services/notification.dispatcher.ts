import { Injectable, Inject } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepositoryPort,
} from '../ports/notification.repository.port.js';
import { NotificationProviderFactory } from './notification-provider.factory.js';
import { NotificationTemplateRenderer } from './notification-template-renderer.js';
import { NotificationHistory } from '../../domain/entities/notification-history.entity.js';
import type { Notification } from '../../domain/entities/notification.entity.js';
import { NotificationStatus } from '../../domain/enums/notifications.enums.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

@Injectable()
export class NotificationDispatcher {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: NotificationRepositoryPort,
    private readonly providerFactory: NotificationProviderFactory,
    private readonly renderer: NotificationTemplateRenderer,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async dispatch(notification: Notification): Promise<void> {
    if (notification.status === NotificationStatus.CANCELLED) return;

    let renderedSubject: string | null = null;
    let renderedBody = '';

    if (notification.templateId) {
      const template = await this.repo.findTemplateById(notification.templateId);
      if (template) {
        const renderResult = this.renderer.render(template, notification.variables);
        renderedSubject = renderResult.subject;
        renderedBody = renderResult.body;
      }
    }

    if (!renderedBody) {
      renderedBody = notification.variables.body ?? '';
      renderedSubject = notification.variables.subject ?? null;
    }

    const provider = this.providerFactory.getProvider(notification.channel);
    try {
      await provider.send(notification, renderedSubject, renderedBody);
      notification.markDispatched(provider.getProviderName());
      
      const historyEntry = new NotificationHistory({
        status: NotificationStatus.DISPATCHED,
        providerName: provider.getProviderName(),
      });
      notification.addHistoryLog(historyEntry);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      notification.markFailed(provider.getProviderName(), errMsg);

      const historyEntry = new NotificationHistory({
        status: NotificationStatus.FAILED,
        providerName: provider.getProviderName(),
        errorMessage: errMsg,
      });
      notification.addHistoryLog(historyEntry);
    }

    await this.repo.save(notification);
    await this.eventPublisher.publishAll(notification.domainEvents);
    notification.clearDomainEvents();
  }
}
