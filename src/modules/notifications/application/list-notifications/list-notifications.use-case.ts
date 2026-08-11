import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common'; // Need standard Inject
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepositoryPort,
  type ListNotificationsFilter,
} from '../ports/notification.repository.port.js';
import type { Notification } from '../../domain/entities/notification.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: NotificationRepositoryPort,
  ) {}

  async execute(filter: ListNotificationsFilter): Promise<PaginatedResult<Notification>> {
    return this.repo.findAll(filter);
  }
}
