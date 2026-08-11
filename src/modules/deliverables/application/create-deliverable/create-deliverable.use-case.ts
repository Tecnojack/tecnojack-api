import { Injectable, Inject } from '@nestjs/common';
import {
  DELIVERABLE_REPOSITORY,
  type DeliverableRepositoryPort,
} from '../ports/deliverable.repository.port.js';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { PeopleFacade } from '../../../people/public/people.facade.js';
import { GalleryFacade } from '../../../gallery/public/gallery.facade.js';
import { Deliverable } from '../../domain/entities/deliverable.entity.js';
import type { DeliverableType, DeliveryMethod } from '../../domain/enums/deliverables.enums.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface CreateDeliverableCommand {
  name: string;
  description?: string;
  eventId: string;
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
export class CreateDeliverableUseCase {
  constructor(
    @Inject(DELIVERABLE_REPOSITORY)
    private readonly deliverableRepo: DeliverableRepositoryPort,
    private readonly eventsFacade: EventsFacade,
    private readonly peopleFacade: PeopleFacade,
    private readonly galleryFacade: GalleryFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: CreateDeliverableCommand): Promise<Deliverable> {
    await this.eventsFacade.getEvent(command.eventId);

    if (command.recipientPersonId) {
      await this.peopleFacade.findPersonByIdOrCode(command.recipientPersonId);
    }

    if (command.targetGalleryId) {
      await this.galleryFacade.getGallery(command.targetGalleryId);
    }

    const code = await this.deliverableRepo.nextCode();

    const deliverable = Deliverable.create(
      {
        code,
        name: command.name,
        description: command.description,
        eventId: command.eventId,
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
