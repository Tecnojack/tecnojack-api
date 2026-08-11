import type { CRMActivityType } from '../enums/crm.enums.js';

export interface CRMActivityProps {
  id?: string;
  opportunityId: string;
  activityType: CRMActivityType;
  title: string;
  notes?: string | null;
  occurredAt?: Date;
  actorId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CRMActivity {
  readonly id: string;
  readonly opportunityId: string;
  readonly activityType: CRMActivityType;
  readonly title: string;
  readonly notes: string | null;
  readonly occurredAt: Date;
  readonly actorId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: CRMActivityProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('CRMActivity title cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.opportunityId = props.opportunityId;
    this.activityType = props.activityType;
    this.title = props.title.trim();
    this.notes = props.notes?.trim() ?? null;
    this.occurredAt = props.occurredAt ?? new Date();
    this.actorId = props.actorId ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
