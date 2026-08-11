import { Injectable } from '@nestjs/common';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { DeliverableFacade } from '../../../deliverables/public/deliverable.facade.js';
import type { ClientDeliverableSummaryModel } from '../../domain/models/client-dashboard.model.js';
import type { Deliverable } from '../../../deliverables/public/index.js';
import type { DeliverableItem } from '../../../deliverables/domain/entities/deliverable-item.entity.js';

@Injectable()
export class GetClientDeliverablesUseCase {
  constructor(
    private readonly eventsFacade: EventsFacade,
    private readonly deliverableFacade: DeliverableFacade,
  ) {}

  async execute(eventIdentifier: string): Promise<ClientDeliverableSummaryModel[]> {
    const event = await this.eventsFacade.getEvent(eventIdentifier);
    const result = await this.deliverableFacade.listDeliverables({
      eventId: event.id,
    });

    return result.data.map((d: Deliverable) => ({
      id: d.id,
      code: d.code,
      name: d.name,
      description: d.description,
      type: d.type,
      status: d.status,
      deliveryMethod: d.deliveryMethod,
      estimatedDeliveryAt: d.estimatedDeliveryAt,
      deliveredAt: d.deliveredAt,
      trackingNumber: d.trackingNumber,
      deliveryNotes: d.deliveryNotes,
      items: d.items.map((i: DeliverableItem) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        quantity: i.quantity,
        isCompleted: i.isCompleted,
      })),
    }));
  }
}
