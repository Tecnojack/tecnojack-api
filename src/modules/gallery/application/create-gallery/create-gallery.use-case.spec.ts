import { CreateGalleryUseCase } from './create-gallery.use-case.js';
import type { GalleryRepositoryPort } from '../ports/gallery.repository.port.js';
import type { EventsFacade } from '../../../events/public/events.facade.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { Gallery } from '../../domain/entities/gallery.entity.js';
import { GalleryStatus } from '../../domain/enums/gallery.enums.js';

describe('CreateGalleryUseCase', () => {
  let useCase: CreateGalleryUseCase;
  let mockGalleryRepo: jest.Mocked<GalleryRepositoryPort>;
  let mockEventsFacade: jest.Mocked<EventsFacade>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockGalleryRepo = {
      save: jest.fn().mockImplementation((g: Gallery) => Promise.resolve(g)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('GAL-000001'),
    };

    mockEventsFacade = {
      getEvent: jest.fn().mockResolvedValue({ id: 'event-1' }),
    } as unknown as jest.Mocked<EventsFacade>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateGalleryUseCase(
      mockGalleryRepo,
      mockEventsFacade,
      mockEventPublisher,
    );
  });

  it('should create a DRAFT gallery successfully verifying Event existence via EventsFacade', async () => {
    const gallery = await useCase.execute({
      name: 'Fotos Oficiales Boda',
      eventId: 'event-1',
    });

    expect(gallery.code).toBe('GAL-000001');
    expect(gallery.name).toBe('Fotos Oficiales Boda');
    expect(gallery.status).toBe(GalleryStatus.DRAFT);
    expect(mockEventsFacade.getEvent.mock.calls.length).toBe(1);
    expect(mockGalleryRepo.save.mock.calls.length).toBe(1);
    expect(mockEventPublisher.publishAll.mock.calls.length).toBe(1);
  });
});
