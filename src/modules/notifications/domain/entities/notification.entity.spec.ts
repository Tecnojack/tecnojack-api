import { Notification } from './notification.entity.js';
import { NotificationTemplate } from './notification-template.entity.js';
import { NotificationRecipient } from './notification-recipient.entity.js';
import { NotificationChannel, NotificationStatus, NotificationPriority } from '../enums/notifications.enums.js';

describe('Notification & Template Entities', () => {
  it('should create a template correctly', () => {
    const template = new NotificationTemplate({
      code: 'TEMP-000001',
      name: 'Welcome Email',
      category: 'ONBOARDING',
      language: 'es',
      subjectLayout: 'Bienvenido {{name}}',
      bodyLayout: 'Hola {{name}}, nos alegra tenerte aquí.',
      variables: ['name'],
    });

    expect(template.code).toBe('TEMP-000001');
    expect(template.variables).toContain('name');
  });

  it('should create and transition notification status', () => {
    const recipient = new NotificationRecipient({
      recipientAddress: 'test@tecnojack.com',
    });

    const notification = Notification.create({
      code: 'NTF-000001',
      channel: NotificationChannel.EMAIL,
      priority: NotificationPriority.HIGH,
      variables: { name: 'Jackson' },
      recipients: [recipient],
    });

    expect(notification.status).toBe(NotificationStatus.PENDING);
    expect(notification.recipients.length).toBe(1);

    notification.markDispatched('MockEmailProvider');
    expect(notification.status).toBe(NotificationStatus.DISPATCHED);
    expect(notification.domainEvents.some((e) => e.eventName === 'notifications.notification_dispatched')).toBe(true);
  });

  it('should handle dispatch failure retries', () => {
    const notification = Notification.create({
      code: 'NTF-000002',
      channel: NotificationChannel.EMAIL,
      maxRetries: 2,
    });

    notification.markFailed('MockEmailProvider', 'SMTP Timeout');
    expect(notification.status).toBe(NotificationStatus.PENDING); // Retries remaining
    expect(notification.retryCount).toBe(1);

    notification.markFailed('MockEmailProvider', 'SMTP Connection refused');
    expect(notification.status).toBe(NotificationStatus.FAILED); // Exhausted
  });
});
