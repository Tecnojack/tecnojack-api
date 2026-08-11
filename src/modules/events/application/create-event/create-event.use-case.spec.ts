import { CreateEventUseCase } from './create-event.use-case.js';
import type { EventRepositoryPort, EventTypeRepositoryPort } from '../ports/event.repository.port.js';
import type { PeopleFacade } from '../../../people/public/people.facade.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { Event } from '../../domain/entities/event.entity.js';
import { EventType } from '../../domain/entities/event-type.entity.js';
import { EventLifecycleStatus } from '../../domain/enums/events.enums.js';

describe('CreateEventUseCase', () => {
  let useCase: CreateEventUseCase;
  let mockEventRepo: jest.Mocked<EventRepositoryPort>;
  let mockEventTypeRepo: jest.Mocked<EventTypeRepositoryPort>;
  let mockPeopleFacade: jest.Mocked<PeopleFacade>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  const sampleEventType = new EventType({
    id: crypto.randomUUID(),
    code: 'WEDDING',
    name: 'Boda',
    isActive: true,
  });

  beforeEach(() => {
    mockEventRepo = {
      save: jest.fn().mockImplementation((e: Event) => Promise.resolve(e)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('EVT-000001'),
    };

    mockEventTypeRepo = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(sampleEventType),
      findByCode: jest.fn(),
      findAll: jest.fn(),
    };

    mockPeopleFacade = {
      findPersonByIdOrCode: jest.fn().mockResolvedValue({ id: 'person-1' }),
      findOrganizationByIdOrCode: jest.fn(),
    } as unknown as jest.Mocked<PeopleFacade>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateEventUseCase(
      mockEventRepo,
      mockEventTypeRepo,
      mockPeopleFacade,
      mockEventPublisher,
    );
  });

  it('should create a DRAFT event successfully', async () => {
    const event = await useCase.execute({
      name: 'Boda Gabriel y Mercedes',
      eventTypeId: sampleEventType.id,
      ownerUserId: 'person-1',
    });

    expect(event.code).toBe('EVT-000001');
    expect(event.name).toBe('Boda Gabriel y Mercedes');
    expect(event.lifecycleStatus).toBe(EventLifecycleStatus.DRAFT);
    expect(mockEventRepo.save.mock.calls.length).toBe(1);
    expect(mockEventPublisher.publishAll.mock.calls.length).toBe(1);
  });
});
