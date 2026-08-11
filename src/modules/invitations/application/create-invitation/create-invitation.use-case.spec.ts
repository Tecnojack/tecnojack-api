import { CreateInvitationUseCase } from './create-invitation.use-case.js';
import type { InvitationRepositoryPort } from '../ports/invitation.repository.port.js';
import type { EventsFacade } from '../../../events/public/events.facade.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { Invitation } from '../../domain/entities/invitation.entity.js';

describe('CreateInvitationUseCase', () => {
  let useCase: CreateInvitationUseCase;
  let mockRepo: jest.Mocked<InvitationRepositoryPort>;
  let mockEventsFacade: jest.Mocked<EventsFacade>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockImplementation((i: Invitation) => Promise.resolve(i)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findBySlug: jest.fn().mockResolvedValue(null),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('INV-000001'),
    };

    mockEventsFacade = {
      getEvent: jest.fn().mockResolvedValue({ id: 'event-1' }),
    } as unknown as jest.Mocked<EventsFacade>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateInvitationUseCase(mockRepo, mockEventsFacade, mockEventPublisher);
  });

  it('should create invitation when event exists and slug is unique', async () => {
    const res = await useCase.execute({
      eventId: 'event-1',
      slug: 'boda-luis-y-diana',
      title: 'Boda Luis & Diana',
    });

    expect(res.code).toBe('INV-000001');
    expect(mockEventsFacade.getEvent.mock.calls.length).toBe(1);
    expect(mockRepo.save.mock.calls.length).toBe(1);
  });
});
