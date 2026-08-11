import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateEventUseCase } from '../../../application/create-event/create-event.use-case.js';
import { GetEventUseCase } from '../../../application/get-event/get-event.use-case.js';
import { UpdateEventUseCase } from '../../../application/update-event/update-event.use-case.js';
import { ManageEventStateUseCase } from '../../../application/manage-event-state/manage-event-state.use-case.js';
import { ListEventsUseCase } from '../../../application/list-events/list-events.use-case.js';
import { ManageSessionsUseCase } from '../../../application/manage-sessions/manage-sessions.use-case.js';
import { CreateEventDto } from '../dtos/create-event.dto.js';
import { UpdateEventDto } from '../dtos/update-event.dto.js';
import { QueryEventsDto } from '../dtos/query-events.dto.js';
import { AddEventSessionDto } from '../dtos/add-event-session.dto.js';
import { EventResponseDto } from '../dtos/event-response.dto.js';
import { EventProductionPhase } from '../../../domain/enums/events.enums.js';

export interface PaginatedEventsResponse {
  data: EventResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getEventUseCase: GetEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly manageEventStateUseCase: ManageEventStateUseCase,
    private readonly listEventsUseCase: ListEventsUseCase,
    private readonly manageSessionsUseCase: ManageSessionsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, type: EventResponseDto })
  async create(@Body() dto: CreateEventDto): Promise<EventResponseDto> {
    const event = await this.createEventUseCase.execute({
      name: dto.name,
      slug: dto.slug,
      eventTypeId: dto.eventTypeId,
      priority: dto.priority,
      ownerUserId: dto.ownerUserId,
      timezone: dto.timezone,
      estimatedStartAt: dto.estimatedStartAt,
      estimatedEndAt: dto.estimatedEndAt,
      brief: dto.brief,
    });
    return EventResponseDto.fromDomain(event);
  }

  @Get()
  @ApiOperation({ summary: 'List events with pagination and filters' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QueryEventsDto): Promise<PaginatedEventsResponse> {
    const result = await this.listEventsUseCase.execute({
      page: query.page,
      limit: query.limit,
      eventTypeId: query.eventTypeId,
      lifecycleStatus: query.lifecycleStatus,
      productionPhase: query.productionPhase,
      dateStatus: query.dateStatus,
      priority: query.priority,
      ownerUserId: query.ownerUserId,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });

    return {
      data: result.data.map((event) => EventResponseDto.fromDomain(event)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get event by ID or code (EVT-XXXXXX)' })
  @ApiParam({ name: 'identifier', description: 'UUID or Business Code (EVT-XXXXXX)' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<EventResponseDto> {
    const event = await this.getEventUseCase.execute(identifier);
    return EventResponseDto.fromDomain(event);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event details and brief' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const event = await this.updateEventUseCase.execute({
      id,
      name: dto.name,
      slug: dto.slug,
      priority: dto.priority,
      timezone: dto.timezone,
      ownerUserId: dto.ownerUserId,
      estimatedStartAt: dto.estimatedStartAt,
      estimatedEndAt: dto.estimatedEndAt,
      brief: dto.brief,
    });
    return EventResponseDto.fromDomain(event);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate a draft event' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async activate(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.manageEventStateUseCase.activate(id);
    return EventResponseDto.fromDomain(event);
  }

  @Post(':id/phase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change event production phase' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async changePhase(
    @Param('id') id: string,
    @Body('phase') phase: EventProductionPhase,
  ): Promise<EventResponseDto> {
    const event = await this.manageEventStateUseCase.changePhase(id, phase);
    return EventResponseDto.fromDomain(event);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark operational work as completed' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async complete(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.manageEventStateUseCase.complete(id);
    return EventResponseDto.fromDomain(event);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an event with mandatory reason' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<EventResponseDto> {
    const event = await this.manageEventStateUseCase.cancel(id, reason);
    return EventResponseDto.fromDomain(event);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) an event' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async archive(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.manageEventStateUseCase.archive(id);
    return EventResponseDto.fromDomain(event);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived event' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  async restore(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.manageEventStateUseCase.restore(id);
    return EventResponseDto.fromDomain(event);
  }

  @Post(':id/sessions')
  @ApiOperation({ summary: 'Add a new session to an event' })
  @ApiResponse({ status: 201, type: EventResponseDto })
  async addSession(
    @Param('id') eventId: string,
    @Body() dto: AddEventSessionDto,
  ): Promise<EventResponseDto> {
    const event = await this.manageSessionsUseCase.addSession({
      eventId,
      name: dto.name,
      type: dto.type,
      description: dto.description,
      status: dto.status,
      startAt: dto.startAt,
      endAt: dto.endAt,
      timezone: dto.timezone,
      allDay: dto.allDay,
      notes: dto.notes,
      locationId: dto.locationId,
    });
    return EventResponseDto.fromDomain(event);
  }
}
