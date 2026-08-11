import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { NotificationChannel, NotificationStatus, NotificationPriority } from '../enums/notifications.enums.js';

export interface NotificationCreatedPayload {
  notificationId: string;
  code: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  scheduledFor?: Date | null;
}

export class NotificationCreatedEvent extends BaseDomainEvent<NotificationCreatedPayload> {
  constructor(payload: NotificationCreatedPayload) {
    super('notifications.notification_created', payload.notificationId, payload);
  }
}

export interface NotificationStatusChangedPayload {
  notificationId: string;
  code: string;
  fromStatus: NotificationStatus;
  toStatus: NotificationStatus;
  errorMessage?: string | null;
}

export class NotificationStatusChangedEvent extends BaseDomainEvent<NotificationStatusChangedPayload> {
  constructor(payload: NotificationStatusChangedPayload) {
    super('notifications.notification_status_changed', payload.notificationId, payload);
  }
}

export interface NotificationDispatchedPayload {
  notificationId: string;
  code: string;
  providerName: string;
  attemptedAt: Date;
}

export class NotificationDispatchedEvent extends BaseDomainEvent<NotificationDispatchedPayload> {
  constructor(payload: NotificationDispatchedPayload) {
    super('notifications.notification_dispatched', payload.notificationId, payload);
  }
}

export interface NotificationDispatchFailedPayload {
  notificationId: string;
  code: string;
  providerName?: string | null;
  errorMessage: string;
  retryCount: number;
}

export class NotificationDispatchFailedEvent extends BaseDomainEvent<NotificationDispatchFailedPayload> {
  constructor(payload: NotificationDispatchFailedPayload) {
    super('notifications.notification_dispatch_failed', payload.notificationId, payload);
  }
}
