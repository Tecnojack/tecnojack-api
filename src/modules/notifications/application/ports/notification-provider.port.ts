import type { Notification } from '../../domain/entities/notification.entity.js';

export interface NotificationProviderPort {
  getProviderName(): string;
  supportsChannel(channel: string): boolean;
  send(notification: Notification, renderedSubject: string | null, renderedBody: string): Promise<void>;
}
