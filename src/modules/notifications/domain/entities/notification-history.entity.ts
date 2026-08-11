import type { NotificationStatus } from '../enums/notifications.enums.js';

export interface NotificationHistoryProps {
  id?: string;
  status: NotificationStatus;
  providerName?: string | null;
  errorMessage?: string | null;
  attemptedAt?: Date;
}

export class NotificationHistory {
  readonly id: string;
  readonly status: NotificationStatus;
  readonly providerName: string | null;
  readonly errorMessage: string | null;
  readonly attemptedAt: Date;

  constructor(props: NotificationHistoryProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.status = props.status;
    this.providerName = props.providerName ?? null;
    this.errorMessage = props.errorMessage?.trim() ?? null;
    this.attemptedAt = props.attemptedAt ?? new Date();
  }
}
