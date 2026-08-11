import { Injectable, Inject } from '@nestjs/common';
import {
  EVENT_REPOSITORY,
  type EventRepositoryPort,
} from '../ports/event.repository.port.js';
import type { Event } from '../../domain/entities/event.entity.js';
import { EventNotFoundException } from '../../domain/errors/events.errors.js';

@Injectable()
export class GetEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepo: EventRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<Event> {
    const isCode = identifier.toUpperCase().startsWith('EVT-') || identifier.toUpperCase().startsWith('EV-');
    const event = isCode
      ? await this.eventRepo.findByCode(identifier)
      : await this.eventRepo.findById(identifier);

    if (!event) {
      throw new EventNotFoundException(identifier);
    }

    return event;
  }
}
