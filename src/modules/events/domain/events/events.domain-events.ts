import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { DomainEvent } from '../../../../platform/domain/events/domain-event.interface.js';
export type { DomainEvent };
import type { EventLifecycleStatus, EventProductionPhase } from '../enums/events.enums.js';

export interface EventCreatedPayload {
  eventId: string;
  code: string;
  name: string;
  eventTypeId: string;
  lifecycleStatus: EventLifecycleStatus;
  productionPhase: EventProductionPhase;
  createdBy?: string | null;
}

export class EventCreatedEvent extends BaseDomainEvent<EventCreatedPayload> {
  constructor(payload: EventCreatedPayload) {
    super('events.event.created', payload.eventId, payload);
  }
}

export interface EventActivatedPayload {
  eventId: string;
  code: string;
  activatedAt: Date;
  activatedBy?: string | null;
}

export class EventActivatedEvent extends BaseDomainEvent<EventActivatedPayload> {
  constructor(payload: EventActivatedPayload) {
    super('events.event.activated', payload.eventId, payload);
  }
}

export interface EventUpdatedPayload {
  eventId: string;
  code: string;
  updatedFields: string[];
  updatedBy?: string | null;
}

export class EventUpdatedEvent extends BaseDomainEvent<EventUpdatedPayload> {
  constructor(payload: EventUpdatedPayload) {
    super('events.event.updated', payload.eventId, payload);
  }
}

export interface EventProductionPhaseChangedPayload {
  eventId: string;
  code: string;
  previousPhase: EventProductionPhase;
  newPhase: EventProductionPhase;
  updatedBy?: string | null;
}

export class EventProductionPhaseChangedEvent extends BaseDomainEvent<EventProductionPhaseChangedPayload> {
  constructor(payload: EventProductionPhaseChangedPayload) {
    super('events.event.phase_changed', payload.eventId, payload);
  }
}

export interface EventCompletedPayload {
  eventId: string;
  code: string;
  completedAt: Date;
  completedBy?: string | null;
}

export class EventCompletedEvent extends BaseDomainEvent<EventCompletedPayload> {
  constructor(payload: EventCompletedPayload) {
    super('events.event.completed', payload.eventId, payload);
  }
}

export interface EventCancelledPayload {
  eventId: string;
  code: string;
  reason: string;
  cancelledAt: Date;
  cancelledBy?: string | null;
}

export class EventCancelledEvent extends BaseDomainEvent<EventCancelledPayload> {
  constructor(payload: EventCancelledPayload) {
    super('events.event.cancelled', payload.eventId, payload);
  }
}

export interface EventArchivedPayload {
  eventId: string;
  code: string;
  deletedAt: Date;
  deletedBy?: string | null;
}

export class EventArchivedEvent extends BaseDomainEvent<EventArchivedPayload> {
  constructor(payload: EventArchivedPayload) {
    super('events.event.archived', payload.eventId, payload);
  }
}

export interface EventRestoredPayload {
  eventId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class EventRestoredEvent extends BaseDomainEvent<EventRestoredPayload> {
  constructor(payload: EventRestoredPayload) {
    super('events.event.restored', payload.eventId, payload);
  }
}

export interface EventSessionAddedPayload {
  eventId: string;
  sessionId: string;
  sessionName: string;
  addedBy?: string | null;
}

export class EventSessionAddedEvent extends BaseDomainEvent<EventSessionAddedPayload> {
  constructor(payload: EventSessionAddedPayload) {
    super('events.session.added', payload.eventId, payload);
  }
}
