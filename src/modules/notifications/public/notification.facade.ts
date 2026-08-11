import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase, type CreateNotificationCommand } from '../application/send-notification/send-notification.use-case.js';
import { ManageNotificationUseCase } from '../application/manage-notification/manage-notification.use-case.js';
import type { Notification } from '../domain/entities/notification.entity.js';

@Injectable()
export class NotificationFacade {
  constructor(
    private readonly sendUseCase: SendNotificationUseCase,
    private readonly manageUseCase: ManageNotificationUseCase,
  ) {}

  sendNotification(command: CreateNotificationCommand): Promise<Notification> {
    return this.sendUseCase.execute(command);
  }

  getNotification(identifier: string): Promise<Notification> {
    return this.manageUseCase.findByIdOrCode(identifier);
  }

  cancelNotification(id: string, actorId?: string): Promise<Notification> {
    return this.manageUseCase.cancel(id, actorId);
  }
}
