import { GetClientDashboardUseCase } from './get-client-dashboard.use-case.js';
import type { EventsFacade } from '../../../events/public/events.facade.js';
import type { GalleryFacade } from '../../../gallery/public/gallery.facade.js';
import type { DeliverableFacade } from '../../../deliverables/public/deliverable.facade.js';
import type { PeopleFacade } from '../../../people/public/people.facade.js';
import { EventBrief } from '../../../events/domain/value-objects/event-brief.value-object.js';
import { GallerySettings } from '../../../gallery/domain/value-objects/gallery-settings.value-object.js';

describe('GetClientDashboardUseCase', () => {
  let useCase: GetClientDashboardUseCase;
  let mockEventsFacade: jest.Mocked<EventsFacade>;
  let mockGalleryFacade: jest.Mocked<GalleryFacade>;
  let mockDeliverableFacade: jest.Mocked<DeliverableFacade>;
  let mockPeopleFacade: jest.Mocked<PeopleFacade>;

  beforeEach(() => {
    mockEventsFacade = {
      getEvent: jest.fn().mockResolvedValue({
        id: 'event-1',
        code: 'EVT-000001',
        name: 'Boda Gabriel y Mercedes',
        slug: 'boda-gabriel-mercedes',
        eventTypeId: 'type-1',
        lifecycleStatus: 'ACTIVE',
        productionPhase: 'PRODUCTION',
        dateStatus: 'CONFIRMED',
        priority: 'HIGH',
        ownerUserId: 'person-1',
        timezone: 'America/Bogota',
        estimatedStartAt: new Date('2026-10-15T16:00:00Z'),
        estimatedEndAt: new Date('2026-10-15T23:00:00Z'),
        confirmedStartAt: new Date('2026-10-15T16:00:00Z'),
        confirmedEndAt: new Date('2026-10-15T23:00:00Z'),
        brief: new EventBrief({ summary: 'Resumen de boda elegante' }),
        completedAt: null,
        sessions: [
          {
            id: 'session-1',
            eventId: 'event-1',
            locationId: 'loc-1',
            type: 'CEREMONY',
            name: 'Ceremonia Religiosa',
            description: 'Iglesia Principal',
            status: 'COMPLETED',
            dateStatus: 'CONFIRMED',
            startAt: new Date('2026-10-15T16:00:00Z'),
            endAt: new Date('2026-10-15T18:00:00Z'),
            timezone: 'America/Bogota',
            allDay: false,
            sortOrder: 1,
            notes: null,
          },
        ],
      }),
    } as unknown as jest.Mocked<EventsFacade>;

    mockGalleryFacade = {
      listGalleries: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'gallery-1',
            code: 'GAL-000001',
            name: 'Galería de Boda',
            slug: 'galeria-boda',
            description: 'Fotos oficiales',
            coverMediaAssetId: 'media-1',
            settings: new GallerySettings({ allowDownload: true, allowFavorites: true }),
            publishedAt: new Date('2026-10-16T10:00:00Z'),
            albums: [{ id: 'album-1' }],
            assetReferences: [{ id: 'ref-1' }, { id: 'ref-2' }],
          },
        ],
        total: 1,
      }),
    } as unknown as jest.Mocked<GalleryFacade>;

    mockDeliverableFacade = {
      listDeliverables: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'deliverable-1',
            code: 'DEL-000001',
            name: 'Álbum Impreso 30x40',
            description: 'Empaquetado especial',
            type: 'PRINTED_ALBUM',
            status: 'DELIVERED',
            deliveryMethod: 'PHYSICAL_SHIPPING',
            estimatedDeliveryAt: new Date('2026-11-01T00:00:00Z'),
            deliveredAt: new Date('2026-10-30T15:00:00Z'),
            trackingNumber: 'TRACK-12345',
            deliveryNotes: 'Entregado a la novia',
            items: [
              {
                id: 'item-1',
                title: 'Álbum Físico',
                description: 'Tapa dura cuero',
                quantity: 1,
                isCompleted: true,
              },
            ],
          },
        ],
        total: 1,
      }),
    } as unknown as jest.Mocked<DeliverableFacade>;

    mockPeopleFacade = {
      findPersonByIdOrCode: jest.fn().mockResolvedValue({
        id: 'person-1',
        name: { displayName: 'Gabriel García' },
        contactPoints: [
          { type: 'EMAIL', value: 'gabriel@example.com' },
          { type: 'PHONE', value: '+573001234567' },
        ],
      }),
      findOrganizationByIdOrCode: jest.fn(),
    } as unknown as jest.Mocked<PeopleFacade>;

    useCase = new GetClientDashboardUseCase(
      mockEventsFacade,
      mockGalleryFacade,
      mockDeliverableFacade,
      mockPeopleFacade,
    );
  });

  it('should build complete ClientDashboard aggregating all facades', async () => {
    const dashboard = await useCase.execute('EVT-000001');

    expect(dashboard.event.code).toBe('EVT-000001');
    expect(dashboard.event.name).toBe('Boda Gabriel y Mercedes');
    expect(dashboard.progressPercentage).toBe(100);
    expect(dashboard.participants.length).toBe(1);
    expect(dashboard.participants[0]!.displayName).toBe('Gabriel García');
    expect(dashboard.publishedGalleries.length).toBe(1);
    expect(dashboard.publishedGalleries[0]!.code).toBe('GAL-000001');
    expect(dashboard.deliverables.length).toBe(1);
    expect(dashboard.deliverables[0]!.code).toBe('DEL-000001');
    expect(dashboard.timeline.length).toBe(2);
    expect(dashboard.nextActions.length).toBe(1);

    expect(mockEventsFacade.getEvent.mock.calls.length).toBe(1);
    expect(mockGalleryFacade.listGalleries.mock.calls.length).toBe(1);
    expect(mockDeliverableFacade.listDeliverables.mock.calls.length).toBe(1);
    expect(mockPeopleFacade.findPersonByIdOrCode.mock.calls.length).toBe(1);
  });
});
