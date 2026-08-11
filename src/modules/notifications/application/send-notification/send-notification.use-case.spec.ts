import { SendNotificationUseCase } from './send-notification.use-case.js';
import type { NotificationRepositoryPort } from '../ports/notification.repository.port.js';
import type { NotificationDispatcher } from '../services/notification.dispatcher.js';
import type { NotificationRecipientResolver } from '../services/notification-recipient-resolver.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { Notification } from '../../domain/entities/notification.entity.js';
import { NotificationChannel } from '../../domain/enums/notifications.enums.js';

describe('SendNotificationUseCase', () => {
  let useCase: SendNotificationUseCase;
  let mockRepo: jest.Mocked<NotificationRepositoryPort>;
  let mockDispatcher: jest.Mocked<NotificationDispatcher>;
  let mockRecipientResolver: jest.Mocked<NotificationRecipientResolver>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockImplementation((n: Notification) => Promise.resolve(n)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('NTF-000001'),
      saveTemplate: jest.fn(),
      findTemplateById: jest.fn(),
      findTemplateByCode: jest.fn(),
      nextTemplateCode: jest.fn(),
    };

    mockDispatcher = {
      dispatch: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<NotificationDispatcher>;

    mockRecipientResolver = {
      resolveAddress: jest.fn().mockResolvedValue('test@tecnojack.com'),
    } as unknown as jest.Mocked<NotificationRecipientResolver>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new SendNotificationUseCase(
      mockRepo,
      mockDispatcher,
      mockRecipientResolver,
      mockEventPublisher,
    );
  });

  it('should create and trigger immediate dispatch', async () => {
    const command = {
      channel: NotificationChannel.EMAIL,
      recipients: [{ recipientAddress: 'test@tecnojack.com' }],
      variables: { body: 'Hello world' },
    };

    const res = await useCase.execute(command);
    expect(res.code).toBe('NTF-000001');
    expect(mockDispatcher.dispatch.mock.calls.length).toBe(1);
  });
});
