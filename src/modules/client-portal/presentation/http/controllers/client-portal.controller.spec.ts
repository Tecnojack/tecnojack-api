import { ClientPortalController } from './client-portal.controller.js';
import type { GetClientDashboardUseCase } from '../../../application/get-client-dashboard/get-client-dashboard.use-case.js';
import type { GetClientGalleriesUseCase } from '../../../application/get-client-galleries/get-client-galleries.use-case.js';
import type { GetClientDeliverablesUseCase } from '../../../application/get-client-deliverables/get-client-deliverables.use-case.js';
import type { GetClientTimelineUseCase } from '../../../application/get-client-timeline/get-client-timeline.use-case.js';
import type { ClientDashboardModel } from '../../../domain/models/client-dashboard.model.js';

describe('ClientPortalController', () => {
  let controller: ClientPortalController;
  let sampleDashboard: ClientDashboardModel;

  beforeEach(() => {
    sampleDashboard = {
      event: {
        id: 'event-1',
        code: 'EVT-000001',
        name: 'Boda Gabriel y Mercedes',
        slug: 'boda-gabriel-mercedes',
        lifecycleStatus: 'ACTIVE',
        productionPhase: 'PRODUCTION',
        dateStatus: 'CONFIRMED',
        priority: 'HIGH',
        timezone: 'America/Bogota',
        estimatedStartAt: new Date('2026-10-15T16:00:00Z'),
        estimatedEndAt: new Date('2026-10-15T23:00:00Z'),
        confirmedStartAt: new Date('2026-10-15T16:00:00Z'),
        confirmedEndAt: new Date('2026-10-15T23:00:00Z'),
        briefSummary: 'Resumen de boda elegante',
        completedAt: null,
      },
      progressPercentage: 100,
      participants: [
        {
          id: 'person-1',
          displayName: 'Gabriel García',
          role: 'Contacto Principal',
        },
      ],
      publishedGalleries: [
        {
          id: 'gallery-1',
          code: 'GAL-000001',
          name: 'Galería de Boda',
          slug: 'galeria-boda',
          description: 'Fotos oficiales',
          coverMediaAssetId: 'media-1',
          allowDownload: true,
          allowFavorites: true,
          allowComments: false,
          publishedAt: new Date('2026-10-16T10:00:00Z'),
          albumCount: 1,
          assetCount: 10,
        },
      ],
      deliverables: [
        {
          id: 'deliverable-1',
          code: 'DEL-000001',
          name: 'Álbum Impreso',
          description: 'Empaquetado especial',
          type: 'PRINTED_ALBUM',
          status: 'DELIVERED',
          deliveryMethod: 'PHYSICAL_SHIPPING',
          estimatedDeliveryAt: new Date('2026-11-01T00:00:00Z'),
          deliveredAt: new Date('2026-10-30T15:00:00Z'),
          trackingNumber: 'TRACK-123',
          deliveryNotes: 'Entregado',
          items: [],
        },
      ],
      timeline: [],
      nextActions: [],
    };

    const dashboardUseCase = {
      execute: jest.fn().mockResolvedValue(sampleDashboard),
    } as unknown as GetClientDashboardUseCase;

    const galleriesUseCase = {
      execute: jest.fn().mockResolvedValue(sampleDashboard.publishedGalleries),
    } as unknown as GetClientGalleriesUseCase;

    const deliverablesUseCase = {
      execute: jest.fn().mockResolvedValue(sampleDashboard.deliverables),
    } as unknown as GetClientDeliverablesUseCase;

    const timelineUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    } as unknown as GetClientTimelineUseCase;

    controller = new ClientPortalController(
      dashboardUseCase,
      galleriesUseCase,
      deliverablesUseCase,
      timelineUseCase,
    );
  });

  it('should get dashboard via controller', async () => {
    const res = await controller.getDashboard('EVT-000001');
    expect(res.event.code).toBe('EVT-000001');
    expect(res.publishedGalleries.length).toBe(1);
    expect(res.deliverables.length).toBe(1);
  });

  it('should get event summary', async () => {
    const res = await controller.getSummary('EVT-000001');
    expect(res.code).toBe('EVT-000001');
  });

  it('should get published galleries', async () => {
    const res = await controller.getGalleries('EVT-000001');
    expect(res.length).toBe(1);
    expect(res[0]!.code).toBe('GAL-000001');
  });
});
