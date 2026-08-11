import type { CRMPipelineStage } from '../enums/crm.enums.js';

export interface CustomerJourneyProps {
  id?: string;
  opportunityId: string;
  fromStage: CRMPipelineStage;
  toStage: CRMPipelineStage;
  notes?: string | null;
  changedAt?: Date;
  actorId?: string | null;
}

export class CustomerJourney {
  readonly id: string;
  readonly opportunityId: string;
  readonly fromStage: CRMPipelineStage;
  readonly toStage: CRMPipelineStage;
  readonly notes: string | null;
  readonly changedAt: Date;
  readonly actorId: string | null;

  constructor(props: CustomerJourneyProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.opportunityId = props.opportunityId;
    this.fromStage = props.fromStage;
    this.toStage = props.toStage;
    this.notes = props.notes?.trim() ?? null;
    this.changedAt = props.changedAt ?? new Date();
    this.actorId = props.actorId ?? null;
  }
}
