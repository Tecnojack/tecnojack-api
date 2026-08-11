import { Injectable, Inject } from '@nestjs/common';
import {
  DELIVERABLE_REPOSITORY,
  type DeliverableRepositoryPort,
} from '../ports/deliverable.repository.port.js';
import type { Deliverable } from '../../domain/entities/deliverable.entity.js';
import type { DeliveryMethod } from '../../domain/enums/deliverables.enums.js';
import { DeliverableNotFoundException } from '../../domain/errors/deliverables.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

@Injectable()
export class ManageDeliverableStateUseCase {
  constructor(
    @Inject(DELIVERABLE_REPOSITORY)
    private readonly deliverableRepo: DeliverableRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async markAsReady(id: string, actorId?: string): Promise<Deliverable> {
    const deliverable = await this.getDeliverable(id);
    deliverable.markAsReady(actorId);
    return this.saveAndPublish(deliverable);
  }

  async markAsDelivered(
    id: string,
    deliveryMethod?: DeliveryMethod,
    notes?: string,
    actorId?: string,
  ): Promise<Deliverable> {
    const deliverable = await this.getDeliverable(id);
    deliverable.markAsDelivered(deliveryMethod, notes, actorId);
    return this.saveAndPublish(deliverable);
  }

  async archive(id: string, actorId?: string): Promise<Deliverable> {
    const deliverable = await this.getDeliverable(id);
    deliverable.softDelete(actorId);
    return this.saveAndPublish(deliverable);
  }

  async restore(id: string, actorId?: string): Promise<Deliverable> {
    const deliverable = await this.getDeliverable(id);
    deliverable.restore(actorId);
    return this.saveAndPublish(deliverable);
  }

  private async getDeliverable(id: string): Promise<Deliverable> {
    const deliverable = await this.deliverableRepo.findById(id);
    if (!deliverable) {
      throw new DeliverableNotFoundException(id);
    }
    return deliverable;
  }

  private async saveAndPublish(deliverable: Deliverable): Promise<Deliverable> {
    const saved = await this.deliverableRepo.save(deliverable);
    await this.eventPublisher.publishAll(deliverable.domainEvents);
    deliverable.clearDomainEvents();
    return saved;
  }
}
