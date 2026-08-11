import { Injectable, Inject } from '@nestjs/common';
import {
  DELIVERABLE_REPOSITORY,
  type DeliverableRepositoryPort,
} from '../ports/deliverable.repository.port.js';
import type { Deliverable } from '../../domain/entities/deliverable.entity.js';
import type { DeliverableType, DeliveryMethod } from '../../domain/enums/deliverables.enums.js';
import { DeliverableNotFoundException } from '../../domain/errors/deliverables.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface UpdateDeliverableCommand {
  id: string;
  name?: string;
  description?: string;
  type?: DeliverableType;
  deliveryMethod?: DeliveryMethod;
  recipientPersonId?: string;
  targetGalleryId?: string;
  estimatedDeliveryAt?: Date;
  trackingNumber?: string;
  deliveryNotes?: string;
  actorId?: string;
}

@Injectable()
export class UpdateDeliverableUseCase {
  constructor(
    @Inject(DELIVERABLE_REPOSITORY)
    private readonly deliverableRepo: DeliverableRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: UpdateDeliverableCommand): Promise<Deliverable> {
    const deliverable = await this.deliverableRepo.findById(command.id);
    if (!deliverable) {
      throw new DeliverableNotFoundException(command.id);
    }

    deliverable.updateDetails(
      {
        name: command.name,
        description: command.description,
        type: command.type,
        deliveryMethod: command.deliveryMethod,
        recipientPersonId: command.recipientPersonId,
        targetGalleryId: command.targetGalleryId,
        estimatedDeliveryAt: command.estimatedDeliveryAt,
        trackingNumber: command.trackingNumber,
        deliveryNotes: command.deliveryNotes,
      },
      command.actorId,
    );

    const saved = await this.deliverableRepo.save(deliverable);
    await this.eventPublisher.publishAll(deliverable.domainEvents);
    deliverable.clearDomainEvents();

    return saved;
  }
}
