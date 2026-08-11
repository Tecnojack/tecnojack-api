import { NotificationsController } from './notifications.controller.js';
import type { SendNotificationUseCase } from '../../../application/send-notification/send-notification.use-case.js';
import type { ManageNotificationUseCase } from '../../../application/manage-notification/manage-notification.use-case.js';
import type { ListNotificationsUseCase } from '../../../application/list-notifications/list-notifications.use-case.js';
import type { ManageNotificationTemplatesUseCase } from '../../../application/manage-notification-templates/manage-notification-templates.use-case.js';
import { Notification } from '../../../domain/entities/notification.entity.js';
import { NotificationTemplate } from '../../../domain/entities/notification-template.entity.js';
import { NotificationChannel } from '../../../domain/enums/notifications.enums.js';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let sampleNotification: Notification;
  let sampleTemplate: NotificationTemplate;

  beforeEach(() => {
    sampleNotification = Notification.create({
      code: 'NTF-000001',
      channel: NotificationChannel.EMAIL,
    });

    sampleTemplate = new NotificationTemplate({
      code: 'TEMP-000001',
      name: 'Welcome Layout',
      category: 'ONBOARDING',
      language: 'es',
      bodyLayout: 'Welcome to Tecnojack',
    });

    const sendUseCase = { execute: jest.fn().mockResolvedValue(sampleNotification) } as unknown as SendNotificationUseCase;
    const manageUseCase = {
      findByIdOrCode: jest.fn().mockResolvedValue(sampleNotification),
      cancel: jest.fn().mockResolvedValue(sampleNotification),
      retry: jest.fn().mockResolvedValue(sampleNotification),
      softDelete: jest.fn().mockResolvedValue(sampleNotification),
      restore: jest.fn().mockResolvedValue(sampleNotification),
    } as unknown as ManageNotificationUseCase;
    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleNotification],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListNotificationsUseCase;
    const templatesUseCase = {
      createTemplate: jest.fn().mockResolvedValue(sampleTemplate),
      getTemplate: jest.fn().mockResolvedValue(sampleTemplate),
    } as unknown as ManageNotificationTemplatesUseCase;

    controller = new NotificationsController(sendUseCase, manageUseCase, listUseCase, templatesUseCase);
  });

  it('should request notification dispatch', async () => {
    const res = await controller.create({
      channel: NotificationChannel.EMAIL,
      recipients: [{ recipientAddress: 'test@tecnojack.com' }],
    });

    expect(res.code).toBe('NTF-000001');
  });

  it('should create dynamic layout template', async () => {
    const res = await controller.createTemplate({
      code: 'TEMP-000001',
      name: 'Welcome Layout',
      category: 'ONBOARDING',
      language: 'es',
      bodyLayout: 'Welcome to Tecnojack',
    });

    expect(res.code).toBe('TEMP-000001');
  });
});
