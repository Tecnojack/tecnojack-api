import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { ContractStatus, ContractTemplateType } from '../enums/contracts.enums.js';

export interface ContractCreatedPayload {
  contractId: string;
  code: string;
  title: string;
  eventId: string;
  deliverableId?: string | null;
  templateType: ContractTemplateType;
  status: ContractStatus;
  createdBy?: string | null;
}

export class ContractCreatedEvent extends BaseDomainEvent<ContractCreatedPayload> {
  constructor(payload: ContractCreatedPayload) {
    super('contracts.created', payload.contractId, payload);
  }
}

export interface ContractVersionAddedPayload {
  contractId: string;
  versionNumber: number;
  title: string;
  changeReason?: string | null;
  createdBy?: string | null;
}

export class ContractVersionAddedEvent extends BaseDomainEvent<ContractVersionAddedPayload> {
  constructor(payload: ContractVersionAddedPayload) {
    super('contracts.version_added', payload.contractId, payload);
  }
}

export interface ContractPartyAddedPayload {
  contractId: string;
  partyId: string;
  role: string;
  personId?: string | null;
  organizationId?: string | null;
  addedBy?: string | null;
}

export class ContractPartyAddedEvent extends BaseDomainEvent<ContractPartyAddedPayload> {
  constructor(payload: ContractPartyAddedPayload) {
    super('contracts.party_added', payload.contractId, payload);
  }
}

export interface ContractSignaturePreparedPayload {
  contractId: string;
  signatureId: string;
  partyId: string;
  signerEmail?: string | null;
  preparedBy?: string | null;
}

export class ContractSignaturePreparedEvent extends BaseDomainEvent<ContractSignaturePreparedPayload> {
  constructor(payload: ContractSignaturePreparedPayload) {
    super('contracts.signature_prepared', payload.contractId, payload);
  }
}

export interface ContractPublishedPayload {
  contractId: string;
  code: string;
  publishedBy?: string | null;
}

export class ContractPublishedEvent extends BaseDomainEvent<ContractPublishedPayload> {
  constructor(payload: ContractPublishedPayload) {
    super('contracts.published', payload.contractId, payload);
  }
}

export interface ContractExecutedPayload {
  contractId: string;
  code: string;
  executedAt: Date;
  executedBy?: string | null;
}

export class ContractExecutedEvent extends BaseDomainEvent<ContractExecutedPayload> {
  constructor(payload: ContractExecutedPayload) {
    super('contracts.executed', payload.contractId, payload);
  }
}

export interface ContractArchivedPayload {
  contractId: string;
  code: string;
  archivedAt: Date;
  archivedBy?: string | null;
}

export class ContractArchivedEvent extends BaseDomainEvent<ContractArchivedPayload> {
  constructor(payload: ContractArchivedPayload) {
    super('contracts.archived', payload.contractId, payload);
  }
}

export interface ContractRestoredPayload {
  contractId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class ContractRestoredEvent extends BaseDomainEvent<ContractRestoredPayload> {
  constructor(payload: ContractRestoredPayload) {
    super('contracts.restored', payload.contractId, payload);
  }
}
