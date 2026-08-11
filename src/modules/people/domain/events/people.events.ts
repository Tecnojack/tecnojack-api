import { type DomainEvent } from '../../../../shared/domain/events/domain-event.interface.js';
export type { DomainEvent };
import type { PersonStatus, OrganizationStatus } from '../enums/people.enums.js';

export interface PersonCreatedPayload {
  personId: string;
  code: string;
  displayName: string;
  documentNumber?: string | null;
  status: PersonStatus;
  createdBy?: string | null;
}

export class PersonCreatedEvent implements DomainEvent<PersonCreatedPayload> {
  readonly eventId: string;
  readonly eventName = 'people.person.created';
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: PersonCreatedPayload;

  constructor(payload: PersonCreatedPayload) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = payload.personId;
    this.payload = payload;
  }
}

export interface PersonUpdatedPayload {
  personId: string;
  code: string;
  updatedFields: string[];
  updatedBy?: string | null;
}

export class PersonUpdatedEvent implements DomainEvent<PersonUpdatedPayload> {
  readonly eventId: string;
  readonly eventName = 'people.person.updated';
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: PersonUpdatedPayload;

  constructor(payload: PersonUpdatedPayload) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = payload.personId;
    this.payload = payload;
  }
}

export interface PersonArchivedPayload {
  personId: string;
  code: string;
  deletedAt: Date;
  deletedBy?: string | null;
}

export class PersonArchivedEvent implements DomainEvent<PersonArchivedPayload> {
  readonly eventId: string;
  readonly eventName = 'people.person.archived';
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: PersonArchivedPayload;

  constructor(payload: PersonArchivedPayload) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = payload.personId;
    this.payload = payload;
  }
}

export interface PersonRestoredPayload {
  personId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class PersonRestoredEvent implements DomainEvent<PersonRestoredPayload> {
  readonly eventId: string;
  readonly eventName = 'people.person.restored';
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: PersonRestoredPayload;

  constructor(payload: PersonRestoredPayload) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = payload.personId;
    this.payload = payload;
  }
}

export interface OrganizationCreatedPayload {
  organizationId: string;
  code: string;
  legalName: string;
  taxIdNumber?: string | null;
  status: OrganizationStatus;
  createdBy?: string | null;
}

export class OrganizationCreatedEvent implements DomainEvent<OrganizationCreatedPayload> {
  readonly eventId: string;
  readonly eventName = 'people.organization.created';
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: OrganizationCreatedPayload;

  constructor(payload: OrganizationCreatedPayload) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = payload.organizationId;
    this.payload = payload;
  }
}

export interface OrganizationUpdatedPayload {
  organizationId: string;
  code: string;
  updatedFields: string[];
  updatedBy?: string | null;
}

export class OrganizationUpdatedEvent implements DomainEvent<OrganizationUpdatedPayload> {
  readonly eventId: string;
  readonly eventName = 'people.organization.updated';
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: OrganizationUpdatedPayload;

  constructor(payload: OrganizationUpdatedPayload) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = payload.organizationId;
    this.payload = payload;
  }
}

export interface OrganizationArchivedPayload {
  organizationId: string;
  code: string;
  deletedAt: Date;
  deletedBy?: string | null;
}

export class OrganizationArchivedEvent implements DomainEvent<OrganizationArchivedPayload> {
  readonly eventId: string;
  readonly eventName = 'people.organization.archived';
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: OrganizationArchivedPayload;

  constructor(payload: OrganizationArchivedPayload) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = payload.organizationId;
    this.payload = payload;
  }
}

export interface OrganizationRestoredPayload {
  organizationId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class OrganizationRestoredEvent implements DomainEvent<OrganizationRestoredPayload> {
  readonly eventId: string;
  readonly eventName = 'people.organization.restored';
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly payload: OrganizationRestoredPayload;

  constructor(payload: OrganizationRestoredPayload) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = payload.organizationId;
    this.payload = payload;
  }
}
