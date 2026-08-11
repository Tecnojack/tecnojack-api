import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { DeliverableType, DeliverableStatus, DeliveryMethod } from '../enums/deliverables.enums.js';

export interface DeliverableCreatedPayload {
  deliverableId: string;
  code: string;
  name: string;
  eventId: string;
  type: DeliverableType;
  status: DeliverableStatus;
  createdBy?: string | null;
}

export class DeliverableCreatedEvent extends BaseDomainEvent<DeliverableCreatedPayload> {
  constructor(payload: DeliverableCreatedPayload) {
    super('deliverables.created', payload.deliverableId, payload);
  }
}

export interface DeliverableStatusChangedPayload {
  deliverableId: string;
  code: string;
  previousStatus: DeliverableStatus;
  newStatus: DeliverableStatus;
  updatedBy?: string | null;
}

export class DeliverableStatusChangedEvent extends BaseDomainEvent<DeliverableStatusChangedPayload> {
  constructor(payload: DeliverableStatusChangedPayload) {
    super('deliverables.status_changed', payload.deliverableId, payload);
  }
}

export interface DeliverableReadyPayload {
  deliverableId: string;
  code: string;
  readyAt: Date;
  updatedBy?: string | null;
}

export class DeliverableReadyEvent extends BaseDomainEvent<DeliverableReadyPayload> {
  constructor(payload: DeliverableReadyPayload) {
    super('deliverables.ready', payload.deliverableId, payload);
  }
}

export interface DeliverableDeliveredPayload {
  deliverableId: string;
  code: string;
  deliveredAt: Date;
  deliveryMethod: DeliveryMethod;
  recipientPersonId?: string | null;
  updatedBy?: string | null;
}

export class DeliverableDeliveredEvent extends BaseDomainEvent<DeliverableDeliveredPayload> {
  constructor(payload: DeliverableDeliveredPayload) {
    super('deliverables.delivered', payload.deliverableId, payload);
  }
}

export interface DeliverableItemAddedPayload {
  deliverableId: string;
  itemId: string;
  title: string;
  addedBy?: string | null;
}

export class DeliverableItemAddedEvent extends BaseDomainEvent<DeliverableItemAddedPayload> {
  constructor(payload: DeliverableItemAddedPayload) {
    super('deliverables.item_added', payload.deliverableId, payload);
  }
}

export interface DeliverableItemRemovedPayload {
  deliverableId: string;
  itemId: string;
  removedBy?: string | null;
}

export class DeliverableItemRemovedEvent extends BaseDomainEvent<DeliverableItemRemovedPayload> {
  constructor(payload: DeliverableItemRemovedPayload) {
    super('deliverables.item_removed', payload.deliverableId, payload);
  }
}

export interface DeliverableArchivedPayload {
  deliverableId: string;
  code: string;
  archivedAt: Date;
  archivedBy?: string | null;
}

export class DeliverableArchivedEvent extends BaseDomainEvent<DeliverableArchivedPayload> {
  constructor(payload: DeliverableArchivedPayload) {
    super('deliverables.archived', payload.deliverableId, payload);
  }
}

export interface DeliverableRestoredPayload {
  deliverableId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class DeliverableRestoredEvent extends BaseDomainEvent<DeliverableRestoredPayload> {
  constructor(payload: DeliverableRestoredPayload) {
    super('deliverables.restored', payload.deliverableId, payload);
  }
}
