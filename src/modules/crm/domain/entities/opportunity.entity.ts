import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import { CRMPipelineStage, QuotationStatus } from '../enums/crm.enums.js';
import type { Quotation } from './quotation.entity.js';
import type { CustomerJourney } from './customer-journey.entity.js';
import type { CRMActivity } from './crm-activity.entity.js';
import type { CRMTask } from './crm-task.entity.js';
import {
  OpportunityAlreadyDeletedException,
  InvalidPipelineStageTransitionException,
  InvalidQuotationOperationException,
} from '../errors/crm.errors.js';
import {
  OpportunityCreatedEvent,
  OpportunityStageChangedEvent,
  OpportunityConvertedEvent,
  QuotationStatusChangedEvent,
  CRMActivityLoggedEvent,
  OpportunityArchivedEvent,
  OpportunityRestoredEvent,
} from '../events/crm.events.js';

// Pipeline stage transitions – extensible without modifying domain core
const ALLOWED_TRANSITIONS: Record<CRMPipelineStage, CRMPipelineStage[]> = {
  [CRMPipelineStage.NEW_LEAD]: [CRMPipelineStage.CONTACTED, CRMPipelineStage.ARCHIVED, CRMPipelineStage.REJECTED],
  [CRMPipelineStage.CONTACTED]: [CRMPipelineStage.MEETING_SCHEDULED, CRMPipelineStage.NEGOTIATION, CRMPipelineStage.REJECTED, CRMPipelineStage.ARCHIVED],
  [CRMPipelineStage.MEETING_SCHEDULED]: [CRMPipelineStage.QUOTATION_SENT, CRMPipelineStage.NEGOTIATION, CRMPipelineStage.REJECTED, CRMPipelineStage.ARCHIVED],
  [CRMPipelineStage.QUOTATION_SENT]: [CRMPipelineStage.NEGOTIATION, CRMPipelineStage.APPROVED, CRMPipelineStage.REJECTED, CRMPipelineStage.ARCHIVED],
  [CRMPipelineStage.NEGOTIATION]: [CRMPipelineStage.APPROVED, CRMPipelineStage.REJECTED, CRMPipelineStage.ARCHIVED],
  [CRMPipelineStage.APPROVED]: [CRMPipelineStage.CONVERTED, CRMPipelineStage.ARCHIVED],
  [CRMPipelineStage.REJECTED]: [CRMPipelineStage.CONTACTED, CRMPipelineStage.ARCHIVED],
  [CRMPipelineStage.CONVERTED]: [],
  [CRMPipelineStage.ARCHIVED]: [CRMPipelineStage.NEW_LEAD, CRMPipelineStage.CONTACTED],
};

export interface OpportunityProps {
  id?: string;
  code: string;
  title: string;
  description?: string | null;
  personId?: string | null;
  organizationId?: string | null;
  eventId?: string | null;
  contractId?: string | null;
  paymentId?: string | null;
  stage?: CRMPipelineStage;
  estimatedValue?: number;
  currency?: string;
  probabilityPercentage?: number;
  quotations?: Quotation[];
  activities?: CRMActivity[];
  tasks?: CRMTask[];
  journeyHistory?: CustomerJourney[];
  audit?: AuditInfo;
}

export class Opportunity extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _title: string;
  private _description: string | null;
  private readonly _personId: string | null;
  private readonly _organizationId: string | null;
  private _eventId: string | null;
  private _contractId: string | null;
  private _paymentId: string | null;
  private _stage: CRMPipelineStage;
  private _estimatedValue: number;
  private _currency: string;
  private _probabilityPercentage: number;
  private _quotations: Quotation[];
  private _activities: CRMActivity[];
  private _tasks: CRMTask[];
  private _journeyHistory: CustomerJourney[];
  private _audit: AuditInfo;

  constructor(props: OpportunityProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Opportunity code cannot be empty.');
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Opportunity title cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._title = props.title.trim();
    this._description = props.description?.trim() ?? null;
    this._personId = props.personId ?? null;
    this._organizationId = props.organizationId ?? null;
    this._eventId = props.eventId ?? null;
    this._contractId = props.contractId ?? null;
    this._paymentId = props.paymentId ?? null;
    this._stage = props.stage ?? CRMPipelineStage.NEW_LEAD;
    this._estimatedValue = props.estimatedValue ?? 0;
    this._currency = props.currency?.toUpperCase().trim() ?? 'COP';
    this._probabilityPercentage = props.probabilityPercentage ?? 10;
    this._quotations = props.quotations ? [...props.quotations] : [];
    this._activities = props.activities ? [...props.activities] : [];
    this._tasks = props.tasks ? [...props.tasks] : [];
    this._journeyHistory = props.journeyHistory ? [...props.journeyHistory] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: OpportunityProps, actorId?: string): Opportunity {
    const opportunity = new Opportunity({ ...props, audit: AuditInfo.create(actorId) });

    opportunity.addDomainEvent(
      new OpportunityCreatedEvent({
        opportunityId: opportunity.id,
        code: opportunity.code,
        title: opportunity.title,
        stage: opportunity.stage,
        personId: opportunity.personId,
        organizationId: opportunity.organizationId,
        estimatedValue: opportunity.estimatedValue,
        currency: opportunity.currency,
        createdBy: actorId ?? null,
      }),
    );

    return opportunity;
  }

  get code(): string { return this._code; }
  get title(): string { return this._title; }
  get description(): string | null { return this._description; }
  get personId(): string | null { return this._personId; }
  get organizationId(): string | null { return this._organizationId; }
  get eventId(): string | null { return this._eventId; }
  get contractId(): string | null { return this._contractId; }
  get paymentId(): string | null { return this._paymentId; }
  get stage(): CRMPipelineStage { return this._stage; }
  get estimatedValue(): number { return this._estimatedValue; }
  get currency(): string { return this._currency; }
  get probabilityPercentage(): number { return this._probabilityPercentage; }
  get quotations(): readonly Quotation[] { return this._quotations; }
  get activities(): readonly CRMActivity[] { return this._activities; }
  get tasks(): readonly CRMTask[] { return this._tasks; }
  get journeyHistory(): readonly CustomerJourney[] { return this._journeyHistory; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(
    props: Partial<Pick<OpportunityProps, 'title' | 'description' | 'estimatedValue' | 'currency' | 'probabilityPercentage'>>,
    actorId?: string,
  ): void {
    this.ensureNotDeleted();
    if (props.title) this._title = props.title.trim();
    if (props.description !== undefined) this._description = props.description?.trim() ?? null;
    if (props.estimatedValue !== undefined) this._estimatedValue = props.estimatedValue;
    if (props.currency) this._currency = props.currency.toUpperCase().trim();
    if (props.probabilityPercentage !== undefined) this._probabilityPercentage = props.probabilityPercentage;
    this._audit = this._audit.touch(actorId);
  }

  transitionTo(newStage: CRMPipelineStage, notes?: string, actorId?: string): void {
    this.ensureNotDeleted();
    const allowed = ALLOWED_TRANSITIONS[this._stage];
    if (!allowed.includes(newStage)) {
      throw new InvalidPipelineStageTransitionException(this._stage, newStage);
    }

    const from = this._stage;
    this._stage = newStage;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new OpportunityStageChangedEvent({
        opportunityId: this.id,
        code: this._code,
        fromStage: from,
        toStage: newStage,
        actorId: actorId ?? null,
      }),
    );
  }

  convert(eventId: string, contractId?: string, paymentId?: string, actorId?: string): void {
    this.ensureNotDeleted();
    if (this._stage !== CRMPipelineStage.APPROVED) {
      throw new InvalidPipelineStageTransitionException(this._stage, CRMPipelineStage.CONVERTED, 'Only APPROVED opportunities can be converted.');
    }

    this._eventId = eventId;
    if (contractId) this._contractId = contractId;
    if (paymentId) this._paymentId = paymentId;
    this._stage = CRMPipelineStage.CONVERTED;
    this._probabilityPercentage = 100;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new OpportunityConvertedEvent({
        opportunityId: this.id,
        code: this._code,
        eventId,
        contractId: contractId ?? null,
        paymentId: paymentId ?? null,
        actorId: actorId ?? null,
      }),
    );
  }

  addQuotation(quotation: Quotation, actorId?: string): void {
    this.ensureNotDeleted();
    this._quotations.push(quotation);
    this._audit = this._audit.touch(actorId);
  }

  approveQuotation(quotationId: string, actorId?: string): void {
    this.ensureNotDeleted();
    const quotation = this._quotations.find((q) => q.id === quotationId);
    if (!quotation) {
      throw new InvalidQuotationOperationException(`Quotation "${quotationId}" not found in opportunity.`);
    }

    const prev = quotation.approve();

    this.addDomainEvent(
      new QuotationStatusChangedEvent({
        opportunityId: this.id,
        quotationId: quotation.id,
        quotationNumber: quotation.quotationNumber,
        fromStatus: prev,
        toStatus: QuotationStatus.APPROVED,
        actorId: actorId ?? null,
      }),
    );

    this._audit = this._audit.touch(actorId);
  }

  rejectQuotation(quotationId: string, actorId?: string): void {
    this.ensureNotDeleted();
    const quotation = this._quotations.find((q) => q.id === quotationId);
    if (!quotation) {
      throw new InvalidQuotationOperationException(`Quotation "${quotationId}" not found in opportunity.`);
    }

    const prev = quotation.reject();

    this.addDomainEvent(
      new QuotationStatusChangedEvent({
        opportunityId: this.id,
        quotationId: quotation.id,
        quotationNumber: quotation.quotationNumber,
        fromStatus: prev,
        toStatus: QuotationStatus.REJECTED,
        actorId: actorId ?? null,
      }),
    );

    this._audit = this._audit.touch(actorId);
  }

  logActivity(activity: CRMActivity, actorId?: string): void {
    this.ensureNotDeleted();
    this._activities.push(activity);
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new CRMActivityLoggedEvent({
        opportunityId: this.id,
        activityId: activity.id,
        activityType: activity.activityType,
        title: activity.title,
        actorId: actorId ?? null,
      }),
    );
  }

  addTask(task: CRMTask, actorId?: string): void {
    this.ensureNotDeleted();
    this._tasks.push(task);
    this._audit = this._audit.touch(actorId);
  }

  addJourneyEntry(entry: CustomerJourney): void {
    this._journeyHistory.push(entry);
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new OpportunityAlreadyDeletedException(this.id);
    }

    this._audit = this._audit.softDelete(actorId);
    this._stage = CRMPipelineStage.ARCHIVED;

    this.addDomainEvent(
      new OpportunityArchivedEvent({
        opportunityId: this.id,
        code: this._code,
        archivedAt: this._audit.deletedAt!,
        archivedBy: actorId ?? null,
      }),
    );
  }

  restore(actorId?: string): void {
    if (!this._audit.isDeleted()) return;

    this._audit = this._audit.restore(actorId);
    this._stage = CRMPipelineStage.NEW_LEAD;

    this.addDomainEvent(
      new OpportunityRestoredEvent({
        opportunityId: this.id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new OpportunityAlreadyDeletedException(this.id);
    }
  }
}
