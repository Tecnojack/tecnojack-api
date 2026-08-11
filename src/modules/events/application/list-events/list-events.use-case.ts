import { Injectable, Inject } from '@nestjs/common';
import {
  EVENT_REPOSITORY,
  type EventRepositoryPort,
  type ListEventsFilter,
} from '../ports/event.repository.port.js';
import type { Event } from '../../domain/entities/event.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ListEventsUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepo: EventRepositoryPort,
  ) {}

  async execute(filter: ListEventsFilter): Promise<PaginatedResult<Event>> {
    return this.eventRepo.findAll(filter);
  }
}
