import type { RecipientType } from '../enums/notifications.enums.js';

export interface NotificationRecipientProps {
  id?: string;
  personId?: string | null;
  recipientAddress: string;
  recipientType?: RecipientType;
  createdAt?: Date;
}

export class NotificationRecipient {
  readonly id: string;
  readonly personId: string | null;
  readonly recipientAddress: string;
  readonly recipientType: RecipientType;
  readonly createdAt: Date;

  constructor(props: NotificationRecipientProps) {
    if (!props.recipientAddress || props.recipientAddress.trim().length === 0) {
      throw new Error('Recipient address cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.personId = props.personId ?? null;
    this.recipientAddress = props.recipientAddress.trim();
    this.recipientType = props.recipientType ?? ('TO' as RecipientType);
    this.createdAt = props.createdAt ?? new Date();
  }
}
