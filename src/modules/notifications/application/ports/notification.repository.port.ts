import type { Notification } from '../../domain/entities/notification.entity.js';
import type { NotificationTemplate } from '../../domain/entities/notification-template.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface ListNotificationsFilter {
  page?: number;
  limit?: number;
  channel?: string;
  status?: string;
  search?: string;
  includeDeleted?: boolean;
}

export interface NotificationRepositoryPort {
  save(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByCode(code: string): Promise<Notification | null>;
  findAll(filter: ListNotificationsFilter): Promise<PaginatedResult<Notification>>;
  nextCode(): Promise<string>;

  // Templates
  saveTemplate(template: NotificationTemplate): Promise<NotificationTemplate>;
  findTemplateById(id: string): Promise<NotificationTemplate | null>;
  findTemplateByCode(code: string): Promise<NotificationTemplate | null>;
  nextTemplateCode(): Promise<string>;
}
