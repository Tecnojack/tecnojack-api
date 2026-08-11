import { Injectable, Inject } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepositoryPort,
} from '../ports/notification.repository.port.js';
import type { Notification } from '../../domain/entities/notification.entity.js';
import { NotificationNotFoundException } from '../../domain/errors/notifications.errors.js';
import { NotificationDispatcher } from '../services/notification.dispatcher.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

@Injectable()
export class ManageNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: NotificationRepositoryPort,
    private readonly dispatcher: NotificationDispatcher,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async findByIdOrCode(identifier: string): Promise<Notification> {
    const isCode = identifier.toUpperCase().startsWith('NTF-');
    const found = isCode ? await this.repo.findByCode(identifier) : await this.repo.findById(identifier);
    if (!found) throw new NotificationNotFoundException(identifier);
    return found;
  }

  async cancel(id: string, actorId?: string): Promise<Notification> {
    const n = await this.findByIdOrCode(id);
    n.cancel(actorId);
    const saved = await this.repo.save(n);
    await this.eventPublisher.publishAll(n.domainEvents);
    n.clearDomainEvents();
    return saved;
  }

  async retry(id: string, actorId?: string): Promise<Notification> {
    const n = await this.findByIdOrCode(id);
    n.retry(actorId);
    const saved = await this.repo.save(n);
    await this.eventPublisher.publishAll(n.domainEvents);
    n.clearDomainEvents();
    await this.dispatcher.dispatch(saved);
    return saved;
  }

  async softDelete(id: string, actorId?: string): Promise<Notification> {
    const n = await this.findByIdOrCode(id);
    n.softDelete(actorId);
    return this.repo.save(n);
  }

  async restore(id: string, actorId?: string): Promise<Notification> {
    const n = await this.findByIdOrCode(id);
    n.restore(actorId);
    return this.repo.save(n);
  }
}
