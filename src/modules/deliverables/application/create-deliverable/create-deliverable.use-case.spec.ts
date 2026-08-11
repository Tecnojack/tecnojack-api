import { CreateDeliverableUseCase } from './create-deliverable.use-case.js';
import type { DeliverableRepositoryPort } from '../ports/deliverable.repository.port.js';
import type { EventsFacade } from '../../../events/public/events.facade.js';
import type { PeopleFacade } from '../../../people/public/people.facade.js';
import type { GalleryFacade } from '../../../gallery/public/gallery.facade.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { Deliverable } from '../../domain/entities/deliverable.entity.js';
import { DeliverableStatus, DeliverableType } from '../../domain/enums/deliverables.enums.js';

describe('CreateDeliverableUseCase', () => {
  let useCase: CreateDeliverableUseCase;
  let mockDeliverableRepo: jest.Mocked<DeliverableRepositoryPort>;
  let mockEventsFacade: jest.Mocked<EventsFacade>;
  let mockPeopleFacade: jest.Mocked<PeopleFacade>;
  let mockGalleryFacade: jest.Mocked<GalleryFacade>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockDeliverableRepo = {
      save: jest.fn().mockImplementation((d: Deliverable) => Promise.resolve(d)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('DEL-000001'),
    };

    mockEventsFacade = {
      getEvent: jest.fn().mockResolvedValue({ id: 'event-1' }),
    } as unknown as jest.Mocked<EventsFacade>;

    mockPeopleFacade = {
      findPersonByIdOrCode: jest.fn().mockResolvedValue({ id: 'person-1' }),
    } as unknown as jest.Mocked<PeopleFacade>;

    mockGalleryFacade = {
      getGallery: jest.fn().mockResolvedValue({ id: 'gallery-1' }),
    } as unknown as jest.Mocked<GalleryFacade>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateDeliverableUseCase(
      mockDeliverableRepo,
      mockEventsFacade,
      mockPeopleFacade,
      mockGalleryFacade,
      mockEventPublisher,
    );
  });

  it('should create a DRAFT deliverable verifying Event, Person, and Gallery via facades', async () => {
    const deliverable = await useCase.execute({
      name: 'Paquete de Fotografías Impresas',
      eventId: 'event-1',
      recipientPersonId: 'person-1',
      targetGalleryId: 'gallery-1',
      type: DeliverableType.PRINTED_ALBUM,
    });

    expect(deliverable.code).toBe('DEL-000001');
    expect(deliverable.name).toBe('Paquete de Fotografías Impresas');
    expect(deliverable.status).toBe(DeliverableStatus.DRAFT);
    expect(mockEventsFacade.getEvent.mock.calls.length).toBe(1);
    expect(mockPeopleFacade.findPersonByIdOrCode.mock.calls.length).toBe(1);
    expect(mockGalleryFacade.getGallery.mock.calls.length).toBe(1);
    expect(mockDeliverableRepo.save.mock.calls.length).toBe(1);
    expect(mockEventPublisher.publishAll.mock.calls.length).toBe(1);
  });
});
