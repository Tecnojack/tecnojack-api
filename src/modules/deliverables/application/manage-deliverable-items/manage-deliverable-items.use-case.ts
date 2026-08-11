import { Injectable, Inject } from '@nestjs/common';
import {
  DELIVERABLE_REPOSITORY,
  type DeliverableRepositoryPort,
} from '../ports/deliverable.repository.port.js';
import { MediaFacade } from '../../../media/public/media.facade.js';
import type { Deliverable } from '../../domain/entities/deliverable.entity.js';
import { DeliverableItem } from '../../domain/entities/deliverable-item.entity.js';
import { DeliverableNotFoundException } from '../../domain/errors/deliverables.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface AddDeliverableItemCommand {
  deliverableId: string;
  title: string;
  description?: string;
  mediaAssetId?: string;
  quantity?: number;
  actorId?: string;
}

@Injectable()
export class ManageDeliverableItemsUseCase {
  constructor(
    @Inject(DELIVERABLE_REPOSITORY)
    private readonly deliverableRepo: DeliverableRepositoryPort,
    private readonly mediaFacade: MediaFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async addItem(command: AddDeliverableItemCommand): Promise<Deliverable> {
    const deliverable = await this.deliverableRepo.findById(command.deliverableId);
    if (!deliverable) {
      throw new DeliverableNotFoundException(command.deliverableId);
    }

    if (command.mediaAssetId) {
      await this.mediaFacade.getAsset(command.mediaAssetId);
    }

    const item = new DeliverableItem({
      deliverableId: deliverable.id,
      title: command.title,
      description: command.description,
      mediaAssetId: command.mediaAssetId,
      quantity: command.quantity ?? 1,
      sortOrder: deliverable.items.length,
    });

    deliverable.addItem(item, command.actorId);

    const saved = await this.deliverableRepo.save(deliverable);
    await this.eventPublisher.publishAll(deliverable.domainEvents);
    deliverable.clearDomainEvents();

    return saved;
  }

  async removeItem(deliverableId: string, itemId: string, actorId?: string): Promise<Deliverable> {
    const deliverable = await this.deliverableRepo.findById(deliverableId);
    if (!deliverable) {
      throw new DeliverableNotFoundException(deliverableId);
    }

    deliverable.removeItem(itemId, actorId);

    const saved = await this.deliverableRepo.save(deliverable);
    await this.eventPublisher.publishAll(deliverable.domainEvents);
    deliverable.clearDomainEvents();

    return saved;
  }
}
