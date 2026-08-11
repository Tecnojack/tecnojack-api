import { Injectable } from '@nestjs/common';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { DeliverableFacade } from '../../../deliverables/public/deliverable.facade.js';
import type { ClientTimelineItemModel } from '../../domain/models/client-dashboard.model.js';
import type { EventSession } from '../../../events/domain/entities/event-session.entity.js';
import type { Deliverable } from '../../../deliverables/public/index.js';

@Injectable()
export class GetClientTimelineUseCase {
  constructor(
    private readonly eventsFacade: EventsFacade,
    private readonly deliverableFacade: DeliverableFacade,
  ) {}

  async execute(eventIdentifier: string): Promise<ClientTimelineItemModel[]> {
    const event = await this.eventsFacade.getEvent(eventIdentifier);
    const deliverablesResult = await this.deliverableFacade.listDeliverables({
      eventId: event.id,
    });

    const timeline: ClientTimelineItemModel[] = [];

    event.sessions.forEach((s: EventSession) => {
      timeline.push({
        id: s.id,
        title: s.name,
        type: `SESSION_${s.type}`,
        status: s.status,
        date: s.startAt,
        description: s.description,
      });
    });

    deliverablesResult.data.forEach((d: Deliverable) => {
      timeline.push({
        id: d.id,
        title: `Entregable: ${d.name}`,
        type: `DELIVERABLE_${d.type}`,
        status: d.status,
        date: d.deliveredAt ?? d.estimatedDeliveryAt,
        description: d.description,
      });
    });

    timeline.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    return timeline;
  }
}
