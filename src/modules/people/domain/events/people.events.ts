import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { DomainEvent } from '../../../../platform/domain/events/domain-event.interface.js';
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

export class PersonCreatedEvent extends BaseDomainEvent<PersonCreatedPayload> {
  constructor(payload: PersonCreatedPayload) {
    super('people.person.created', payload.personId, payload);
  }
}

export interface PersonUpdatedPayload {
  personId: string;
  code: string;
  updatedFields: string[];
  updatedBy?: string | null;
}

export class PersonUpdatedEvent extends BaseDomainEvent<PersonUpdatedPayload> {
  constructor(payload: PersonUpdatedPayload) {
    super('people.person.updated', payload.personId, payload);
  }
}

export interface PersonArchivedPayload {
  personId: string;
  code: string;
  deletedAt: Date;
  deletedBy?: string | null;
}

export class PersonArchivedEvent extends BaseDomainEvent<PersonArchivedPayload> {
  constructor(payload: PersonArchivedPayload) {
    super('people.person.archived', payload.personId, payload);
  }
}

export interface PersonRestoredPayload {
  personId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class PersonRestoredEvent extends BaseDomainEvent<PersonRestoredPayload> {
  constructor(payload: PersonRestoredPayload) {
    super('people.person.restored', payload.personId, payload);
  }
}

export interface OrganizationCreatedPayload {
  organizationId: string;
  code: string;
  legalName: string;
  tradeName?: string | null;
  taxIdNumber?: string | null;
  status: OrganizationStatus;
  createdBy?: string | null;
}

export class OrganizationCreatedEvent extends BaseDomainEvent<OrganizationCreatedPayload> {
  constructor(payload: OrganizationCreatedPayload) {
    super('people.organization.created', payload.organizationId, payload);
  }
}

export interface OrganizationUpdatedPayload {
  organizationId: string;
  code: string;
  updatedFields: string[];
  updatedBy?: string | null;
}

export class OrganizationUpdatedEvent extends BaseDomainEvent<OrganizationUpdatedPayload> {
  constructor(payload: OrganizationUpdatedPayload) {
    super('people.organization.updated', payload.organizationId, payload);
  }
}

export interface OrganizationArchivedPayload {
  organizationId: string;
  code: string;
  deletedAt: Date;
  deletedBy?: string | null;
}

export class OrganizationArchivedEvent extends BaseDomainEvent<OrganizationArchivedPayload> {
  constructor(payload: OrganizationArchivedPayload) {
    super('people.organization.archived', payload.organizationId, payload);
  }
}

export interface OrganizationRestoredPayload {
  organizationId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class OrganizationRestoredEvent extends BaseDomainEvent<OrganizationRestoredPayload> {
  constructor(payload: OrganizationRestoredPayload) {
    super('people.organization.restored', payload.organizationId, payload);
  }
}
