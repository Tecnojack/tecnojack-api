import { Injectable } from '@nestjs/common';
import { CreateEventUseCase, type CreateEventCommand } from '../application/create-event/create-event.use-case.js';
import { GetEventUseCase } from '../application/get-event/get-event.use-case.js';
import { UpdateEventUseCase, type UpdateEventCommand } from '../application/update-event/update-event.use-case.js';
import { ManageEventStateUseCase } from '../application/manage-event-state/manage-event-state.use-case.js';
import { ListEventsUseCase } from '../application/list-events/list-events.use-case.js';
import type { ListEventsFilter } from '../application/ports/event.repository.port.js';
import type { Event } from '../domain/entities/event.entity.js';
import type { PaginatedResult } from '../../../platform/domain/types/pagination.types.js';

@Injectable()
export class EventsFacade {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getEventUseCase: GetEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly manageEventStateUseCase: ManageEventStateUseCase,
    private readonly listEventsUseCase: ListEventsUseCase,
  ) {}

  createEvent(command: CreateEventCommand): Promise<Event> {
    return this.createEventUseCase.execute(command);
  }

  getEvent(identifier: string): Promise<Event> {
    return this.getEventUseCase.execute(identifier);
  }

  updateEvent(command: UpdateEventCommand): Promise<Event> {
    return this.updateEventUseCase.execute(command);
  }

  listEvents(filter: ListEventsFilter): Promise<PaginatedResult<Event>> {
    return this.listEventsUseCase.execute(filter);
  }

  activateEvent(id: string, actorId?: string): Promise<Event> {
    return this.manageEventStateUseCase.activate(id, actorId);
  }

  cancelEvent(id: string, reason: string, actorId?: string): Promise<Event> {
    return this.manageEventStateUseCase.cancel(id, reason, actorId);
  }

  archiveEvent(id: string, actorId?: string): Promise<Event> {
    return this.manageEventStateUseCase.archive(id, actorId);
  }
}
