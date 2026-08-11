import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { CRMPipelineStage, CRMActivityType, QuotationStatus } from '../enums/crm.enums.js';

export interface OpportunityCreatedPayload {
  opportunityId: string;
  code: string;
  title: string;
  stage: CRMPipelineStage;
  personId?: string | null;
  organizationId?: string | null;
  estimatedValue: number;
  currency: string;
  createdBy?: string | null;
}

export class OpportunityCreatedEvent extends BaseDomainEvent<OpportunityCreatedPayload> {
  constructor(payload: OpportunityCreatedPayload) {
    super('crm.opportunity_created', payload.opportunityId, payload);
  }
}

export interface OpportunityStageChangedPayload {
  opportunityId: string;
  code: string;
  fromStage: CRMPipelineStage;
  toStage: CRMPipelineStage;
  actorId?: string | null;
}

export class OpportunityStageChangedEvent extends BaseDomainEvent<OpportunityStageChangedPayload> {
  constructor(payload: OpportunityStageChangedPayload) {
    super('crm.opportunity_stage_changed', payload.opportunityId, payload);
  }
}

export interface OpportunityConvertedPayload {
  opportunityId: string;
  code: string;
  eventId: string;
  contractId?: string | null;
  paymentId?: string | null;
  actorId?: string | null;
}

export class OpportunityConvertedEvent extends BaseDomainEvent<OpportunityConvertedPayload> {
  constructor(payload: OpportunityConvertedPayload) {
    super('crm.opportunity_converted', payload.opportunityId, payload);
  }
}

export interface QuotationStatusChangedPayload {
  opportunityId: string;
  quotationId: string;
  quotationNumber: string;
  fromStatus: QuotationStatus;
  toStatus: QuotationStatus;
  actorId?: string | null;
}

export class QuotationStatusChangedEvent extends BaseDomainEvent<QuotationStatusChangedPayload> {
  constructor(payload: QuotationStatusChangedPayload) {
    super('crm.quotation_status_changed', payload.opportunityId, payload);
  }
}

export interface CRMActivityLoggedPayload {
  opportunityId: string;
  activityId: string;
  activityType: CRMActivityType;
  title: string;
  actorId?: string | null;
}

export class CRMActivityLoggedEvent extends BaseDomainEvent<CRMActivityLoggedPayload> {
  constructor(payload: CRMActivityLoggedPayload) {
    super('crm.activity_logged', payload.opportunityId, payload);
  }
}

export interface OpportunityArchivedPayload {
  opportunityId: string;
  code: string;
  archivedAt: Date;
  archivedBy?: string | null;
}

export class OpportunityArchivedEvent extends BaseDomainEvent<OpportunityArchivedPayload> {
  constructor(payload: OpportunityArchivedPayload) {
    super('crm.opportunity_archived', payload.opportunityId, payload);
  }
}

export interface OpportunityRestoredPayload {
  opportunityId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class OpportunityRestoredEvent extends BaseDomainEvent<OpportunityRestoredPayload> {
  constructor(payload: OpportunityRestoredPayload) {
    super('crm.opportunity_restored', payload.opportunityId, payload);
  }
}
