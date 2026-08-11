import { Injectable } from '@nestjs/common';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { GalleryFacade } from '../../../gallery/public/gallery.facade.js';
import { DeliverableFacade } from '../../../deliverables/public/deliverable.facade.js';
import { PeopleFacade } from '../../../people/public/people.facade.js';
import type {
  ClientDashboardModel,
  ClientEventSummaryModel,
  ClientParticipantSummaryModel,
  ClientGallerySummaryModel,
  ClientDeliverableSummaryModel,
  ClientTimelineItemModel,
  ClientNextActionModel,
} from '../../domain/models/client-dashboard.model.js';
import { GalleryStatus } from '../../../gallery/public/index.js';
import type { Gallery } from '../../../gallery/public/index.js';
import type { Deliverable } from '../../../deliverables/public/index.js';
import type { DeliverableItem } from '../../../deliverables/domain/entities/deliverable-item.entity.js';
import type { EventSession } from '../../../events/domain/entities/event-session.entity.js';
import type { Person } from '../../../people/domain/entities/person.entity.js';
import type { Organization } from '../../../people/domain/entities/organization.entity.js';
import { ContactType } from '../../../people/domain/enums/people.enums.js';

@Injectable()
export class GetClientDashboardUseCase {
  constructor(
    private readonly eventsFacade: EventsFacade,
    private readonly galleryFacade: GalleryFacade,
    private readonly deliverableFacade: DeliverableFacade,
    private readonly peopleFacade: PeopleFacade,
  ) {}

  async execute(eventIdentifier: string): Promise<ClientDashboardModel> {
    const event = await this.eventsFacade.getEvent(eventIdentifier);

    const galleriesResult = await this.galleryFacade.listGalleries({
      eventId: event.id,
      status: GalleryStatus.PUBLISHED,
    });

    const deliverablesResult = await this.deliverableFacade.listDeliverables({
      eventId: event.id,
    });

    const participants: ClientParticipantSummaryModel[] = [];
    if (event.ownerUserId) {
      const person: Person | null = await this.peopleFacade.findPersonByIdOrCode(event.ownerUserId);
      if (person) {
        const primaryEmail = person.contactPoints?.find((c) => c.type === ContactType.EMAIL);
        const primaryPhone = person.contactPoints?.find((c) => c.type === ContactType.PHONE);
        participants.push({
          id: person.id,
          displayName: person.name.displayName,
          role: 'Contacto Principal',
          email: primaryEmail?.value ?? null,
          phone: primaryPhone?.value ?? null,
        });
      } else {
        const org: Organization | null = await this.peopleFacade.findOrganizationByIdOrCode(event.ownerUserId);
        if (org) {
          participants.push({
            id: org.id,
            displayName: org.name.legalName,
            role: 'Organización Responsable',
          });
        }
      }
    }

    const eventSummary: ClientEventSummaryModel = {
      id: event.id,
      code: event.code,
      name: event.name,
      slug: event.slug,
      lifecycleStatus: event.lifecycleStatus,
      productionPhase: event.productionPhase,
      dateStatus: event.dateStatus,
      priority: event.priority,
      timezone: event.timezone,
      estimatedStartAt: event.estimatedStartAt,
      estimatedEndAt: event.estimatedEndAt,
      confirmedStartAt: event.confirmedStartAt,
      confirmedEndAt: event.confirmedEndAt,
      briefSummary: event.brief.summary,
      completedAt: event.completedAt,
    };

    const publishedGalleries: ClientGallerySummaryModel[] = galleriesResult.data.map((g: Gallery) => ({
      id: g.id,
      code: g.code,
      name: g.name,
      slug: g.slug,
      description: g.description,
      coverMediaAssetId: g.coverMediaAssetId,
      allowDownload: g.settings.allowDownload,
      allowFavorites: g.settings.allowFavorites,
      allowComments: g.settings.allowComments,
      publishedAt: g.publishedAt,
      albumCount: g.albums.length,
      assetCount: g.assetReferences.length,
    }));

    const deliverables: ClientDeliverableSummaryModel[] = deliverablesResult.data.map((d: Deliverable) => ({
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

    const totalSessions = event.sessions.length;
    const completedSessions = event.sessions.filter((s: EventSession) => (s.status as string) === 'COMPLETED').length;
    const totalDeliverables = deliverablesResult.data.length;
    const deliveredCount = deliverablesResult.data.filter((d: Deliverable) => (d.status as string) === 'DELIVERED').length;

    const totalItemsCount = totalSessions + totalDeliverables;
    const completedItemsCount = completedSessions + deliveredCount;
    const progressPercentage = totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0;

    const nextActions: ClientNextActionModel[] = [];

    if (publishedGalleries.length > 0) {
      const latestGallery = publishedGalleries[0]!;
      nextActions.push({
        id: `action-gallery-${latestGallery.id}`,
        title: `Explorar Galería: ${latestGallery.name}`,
        description: `La galería de fotos '${latestGallery.name}' ya está disponible para tu visualización.`,
        category: 'GALLERY',
        actionUrl: `/client-portal/galleries/${latestGallery.code}`,
      });
    }

    const readyDeliverable = deliverablesResult.data.find((d: Deliverable) => (d.status as string) === 'READY');
    if (readyDeliverable) {
      nextActions.push({
        id: `action-deliverable-${readyDeliverable.id}`,
        title: `Entregable Listo: ${readyDeliverable.name}`,
        description: `Tu entregable '${readyDeliverable.name}' está listo para ser despachado o descargado.`,
        category: 'DELIVERABLE',
        actionUrl: `/client-portal/deliverables/${readyDeliverable.code}`,
      });
    }

    return {
      event: eventSummary,
      progressPercentage,
      participants,
      publishedGalleries,
      deliverables,
      timeline,
      nextActions,
    };
  }
}
