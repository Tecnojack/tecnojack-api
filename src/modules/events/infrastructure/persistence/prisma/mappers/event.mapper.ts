import type { EventModel as PrismaEvent, EventSessionModel as PrismaEventSession } from '../../../../../../generated/prisma/client.js';
import type {
  EventLifecycleStatus as PrismaLifecycleStatus,
  EventProductionPhase as PrismaProductionPhase,
  EventDateStatus as PrismaDateStatus,
  EventPriority as PrismaPriority,
  EventSessionType as PrismaSessionType,
  EventSessionStatus as PrismaSessionStatus,
} from '../../../../../../generated/prisma/enums.js';
import { Event } from '../../../../domain/entities/event.entity.js';
import { EventSession } from '../../../../domain/entities/event-session.entity.js';
import type {
  EventLifecycleStatus,
  EventProductionPhase,
  EventDateStatus,
  EventPriority,
  EventSessionType,
  EventSessionStatus,
} from '../../../../domain/enums/events.enums.js';
import { EventBrief } from '../../../../domain/value-objects/event-brief.value-object.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';

export type PrismaEventWithRelations = PrismaEvent & {
  sessions?: PrismaEventSession[];
};

export interface PersistenceEventData {
  id: string;
  code: string;
  name: string;
  slug: string | null;
  eventTypeId: string;
  lifecycleStatus: PrismaLifecycleStatus;
  productionPhase: PrismaProductionPhase;
  dateStatus: PrismaDateStatus;
  priority: PrismaPriority;
  ownerUserId: string | null;
  timezone: string;
  estimatedStartAt: Date | null;
  estimatedEndAt: Date | null;
  confirmedStartAt: Date | null;
  confirmedEndAt: Date | null;
  briefSummary: string | null;
  briefObjectives: string | null;
  briefAudience: string | null;
  briefCreativeDirection: string | null;
  briefVisualReferences: string | null;
  briefSpecialMoments: string | null;
  briefRestrictions: string | null;
  briefTechnicalRequirements: string | null;
  briefAccessibilityRequirements: string | null;
  briefPrivacyRequirements: string | null;
  briefAdditionalNotes: string | null;
  cancellationReason: string | null;
  cancelledAt: Date | null;
  completedAt: Date | null;
  closedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}

export class EventMapper {
  static toDomain(raw: PrismaEventWithRelations): Event {
    const brief = new EventBrief({
      summary: raw.briefSummary,
      objectives: raw.briefObjectives,
      audience: raw.briefAudience,
      creativeDirection: raw.briefCreativeDirection,
      visualReferences: raw.briefVisualReferences,
      specialMoments: raw.briefSpecialMoments,
      restrictions: raw.briefRestrictions,
      technicalRequirements: raw.briefTechnicalRequirements,
      accessibilityRequirements: raw.briefAccessibilityRequirements,
      privacyRequirements: raw.briefPrivacyRequirements,
      additionalNotes: raw.briefAdditionalNotes,
    });

    const sessions = (raw.sessions ?? []).map(
      (s) =>
        new EventSession({
          id: s.id,
          eventId: s.eventId,
          locationId: s.locationId,
          type: s.type as unknown as EventSessionType,
          name: s.name,
          description: s.description,
          status: s.status as unknown as EventSessionStatus,
          dateStatus: s.dateStatus as unknown as EventDateStatus,
          startAt: s.startAt,
          endAt: s.endAt,
          timezone: s.timezone,
          allDay: s.allDay,
          sortOrder: s.sortOrder,
          notes: s.notes,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        }),
    );

    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });

    return new Event({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      slug: raw.slug,
      eventTypeId: raw.eventTypeId,
      lifecycleStatus: raw.lifecycleStatus as unknown as EventLifecycleStatus,
      productionPhase: raw.productionPhase as unknown as EventProductionPhase,
      dateStatus: raw.dateStatus as unknown as EventDateStatus,
      priority: raw.priority as unknown as EventPriority,
      ownerUserId: raw.ownerUserId,
      timezone: raw.timezone,
      estimatedStartAt: raw.estimatedStartAt,
      estimatedEndAt: raw.estimatedEndAt,
      confirmedStartAt: raw.confirmedStartAt,
      confirmedEndAt: raw.confirmedEndAt,
      brief,
      cancellationReason: raw.cancellationReason,
      cancelledAt: raw.cancelledAt,
      completedAt: raw.completedAt,
      closedAt: raw.closedAt,
      archivedAt: raw.archivedAt,
      sessions,
      audit,
    });
  }

  static toPersistence(entity: Event): PersistenceEventData {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      slug: entity.slug,
      eventTypeId: entity.eventTypeId,
      lifecycleStatus: entity.lifecycleStatus as unknown as PrismaLifecycleStatus,
      productionPhase: entity.productionPhase as unknown as PrismaProductionPhase,
      dateStatus: entity.dateStatus as unknown as PrismaDateStatus,
      priority: entity.priority as unknown as PrismaPriority,
      ownerUserId: entity.ownerUserId,
      timezone: entity.timezone,
      estimatedStartAt: entity.estimatedStartAt,
      estimatedEndAt: entity.estimatedEndAt,
      confirmedStartAt: entity.confirmedStartAt,
      confirmedEndAt: entity.confirmedEndAt,
      briefSummary: entity.brief.summary,
      briefObjectives: entity.brief.objectives,
      briefAudience: entity.brief.audience,
      briefCreativeDirection: entity.brief.creativeDirection,
      briefVisualReferences: entity.brief.visualReferences,
      briefSpecialMoments: entity.brief.specialMoments,
      briefRestrictions: entity.brief.restrictions,
      briefTechnicalRequirements: entity.brief.technicalRequirements,
      briefAccessibilityRequirements: entity.brief.accessibilityRequirements,
      briefPrivacyRequirements: entity.brief.privacyRequirements,
      briefAdditionalNotes: entity.brief.additionalNotes,
      cancellationReason: entity.cancellationReason,
      cancelledAt: entity.cancelledAt,
      completedAt: entity.completedAt,
      closedAt: entity.closedAt,
      archivedAt: entity.archivedAt,
      createdAt: entity.audit.createdAt,
      createdBy: entity.audit.createdBy,
      updatedAt: entity.audit.updatedAt,
      updatedBy: entity.audit.updatedBy,
      deletedAt: entity.audit.deletedAt,
      deletedBy: entity.audit.deletedBy,
    };
  }

  static toPersistenceSessions(sessions: readonly EventSession[]): {
    id: string;
    eventId: string;
    locationId: string | null;
    type: PrismaSessionType;
    name: string;
    description: string | null;
    status: PrismaSessionStatus;
    dateStatus: PrismaDateStatus;
    startAt: Date | null;
    endAt: Date | null;
    timezone: string | null;
    allDay: boolean;
    sortOrder: number;
    notes: string | null;
  }[] {
    return sessions.map((s: EventSession) => ({
      id: s.id,
      eventId: s.eventId,
      locationId: s.locationId,
      type: s.type as unknown as PrismaSessionType,
      name: s.name,
      description: s.description,
      status: s.status as unknown as PrismaSessionStatus,
      dateStatus: s.dateStatus as unknown as PrismaDateStatus,
      startAt: s.startAt,
      endAt: s.endAt,
      timezone: s.timezone,
      allDay: s.allDay,
      sortOrder: s.sortOrder,
      notes: s.notes,
    }));
  }
}
