import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetClientDashboardUseCase } from '../../../application/get-client-dashboard/get-client-dashboard.use-case.js';
import { GetClientGalleriesUseCase } from '../../../application/get-client-galleries/get-client-galleries.use-case.js';
import { GetClientDeliverablesUseCase } from '../../../application/get-client-deliverables/get-client-deliverables.use-case.js';
import { GetClientTimelineUseCase } from '../../../application/get-client-timeline/get-client-timeline.use-case.js';
import {
  ClientDashboardResponseDto,
  ClientGallerySummaryDto,
  ClientDeliverableSummaryDto,
  ClientTimelineItemDto,
  ClientEventSummaryDto,
} from '../dtos/client-dashboard-response.dto.js';

@ApiTags('Client Portal')
@Controller('client-portal')
export class ClientPortalController {
  constructor(
    private readonly getClientDashboardUseCase: GetClientDashboardUseCase,
    private readonly getClientGalleriesUseCase: GetClientGalleriesUseCase,
    private readonly getClientDeliverablesUseCase: GetClientDeliverablesUseCase,
    private readonly getClientTimelineUseCase: GetClientTimelineUseCase,
  ) {}

  @Get('events/:eventIdentifier/dashboard')
  @ApiOperation({ summary: 'Get unified client dashboard for an event' })
  @ApiParam({ name: 'eventIdentifier', description: 'Event UUID or Business Code (EVT-XXXXXX)' })
  @ApiResponse({ status: 200, type: ClientDashboardResponseDto })
  async getDashboard(
    @Param('eventIdentifier') eventIdentifier: string,
  ): Promise<ClientDashboardResponseDto> {
    return this.getClientDashboardUseCase.execute(eventIdentifier);
  }

  @Get('events/:eventIdentifier/summary')
  @ApiOperation({ summary: 'Get client summary for an event' })
  @ApiParam({ name: 'eventIdentifier', description: 'Event UUID or Business Code (EVT-XXXXXX)' })
  @ApiResponse({ status: 200, type: ClientEventSummaryDto })
  async getSummary(
    @Param('eventIdentifier') eventIdentifier: string,
  ): Promise<ClientEventSummaryDto> {
    const dashboard = await this.getClientDashboardUseCase.execute(eventIdentifier);
    return dashboard.event;
  }

  @Get('events/:eventIdentifier/galleries')
  @ApiOperation({ summary: 'Get published galleries for a client event' })
  @ApiParam({ name: 'eventIdentifier', description: 'Event UUID or Business Code (EVT-XXXXXX)' })
  @ApiResponse({ status: 200, type: [ClientGallerySummaryDto] })
  async getGalleries(
    @Param('eventIdentifier') eventIdentifier: string,
  ): Promise<ClientGallerySummaryDto[]> {
    return this.getClientGalleriesUseCase.execute(eventIdentifier);
  }

  @Get('events/:eventIdentifier/deliverables')
  @ApiOperation({ summary: 'Get client deliverables for an event' })
  @ApiParam({ name: 'eventIdentifier', description: 'Event UUID or Business Code (EVT-XXXXXX)' })
  @ApiResponse({ status: 200, type: [ClientDeliverableSummaryDto] })
  async getDeliverables(
    @Param('eventIdentifier') eventIdentifier: string,
  ): Promise<ClientDeliverableSummaryDto[]> {
    return this.getClientDeliverablesUseCase.execute(eventIdentifier);
  }

  @Get('events/:eventIdentifier/timeline')
  @ApiOperation({ summary: 'Get event timeline for client' })
  @ApiParam({ name: 'eventIdentifier', description: 'Event UUID or Business Code (EVT-XXXXXX)' })
  @ApiResponse({ status: 200, type: [ClientTimelineItemDto] })
  async getTimeline(
    @Param('eventIdentifier') eventIdentifier: string,
  ): Promise<ClientTimelineItemDto[]> {
    return this.getClientTimelineUseCase.execute(eventIdentifier);
  }
}
