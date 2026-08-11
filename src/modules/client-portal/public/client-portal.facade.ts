import { Injectable } from '@nestjs/common';
import { GetClientDashboardUseCase } from '../application/get-client-dashboard/get-client-dashboard.use-case.js';
import { GetClientGalleriesUseCase } from '../application/get-client-galleries/get-client-galleries.use-case.js';
import { GetClientDeliverablesUseCase } from '../application/get-client-deliverables/get-client-deliverables.use-case.js';
import { GetClientTimelineUseCase } from '../application/get-client-timeline/get-client-timeline.use-case.js';
import type {
  ClientDashboardModel,
  ClientGallerySummaryModel,
  ClientDeliverableSummaryModel,
  ClientTimelineItemModel,
} from '../domain/models/client-dashboard.model.js';

@Injectable()
export class ClientPortalFacade {
  constructor(
    private readonly getClientDashboardUseCase: GetClientDashboardUseCase,
    private readonly getClientGalleriesUseCase: GetClientGalleriesUseCase,
    private readonly getClientDeliverablesUseCase: GetClientDeliverablesUseCase,
    private readonly getClientTimelineUseCase: GetClientTimelineUseCase,
  ) {}

  getClientDashboard(eventIdentifier: string): Promise<ClientDashboardModel> {
    return this.getClientDashboardUseCase.execute(eventIdentifier);
  }

  getClientGalleries(eventIdentifier: string): Promise<ClientGallerySummaryModel[]> {
    return this.getClientGalleriesUseCase.execute(eventIdentifier);
  }

  getClientDeliverables(eventIdentifier: string): Promise<ClientDeliverableSummaryModel[]> {
    return this.getClientDeliverablesUseCase.execute(eventIdentifier);
  }

  getClientTimeline(eventIdentifier: string): Promise<ClientTimelineItemModel[]> {
    return this.getClientTimelineUseCase.execute(eventIdentifier);
  }
}
