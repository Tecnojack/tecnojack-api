import { Injectable, Inject } from '@nestjs/common';
import {
  EVENT_REPOSITORY,
  LOCATION_REPOSITORY,
  type EventRepositoryPort,
  type LocationRepositoryPort,
} from '../ports/event.repository.port.js';
import type { Event } from '../../domain/entities/event.entity.js';
import { EventSession } from '../../domain/entities/event-session.entity.js';
import type { EventSessionType, EventSessionStatus } from '../../domain/enums/events.enums.js';
import { EventNotFoundException, LocationNotFoundException } from '../../domain/errors/events.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface AddEventSessionCommand {
  eventId: string;
  name: string;
  type?: EventSessionType;
  description?: string;
  status?: EventSessionStatus;
  startAt?: Date;
  endAt?: Date;
  timezone?: string;
  allDay?: boolean;
  notes?: string;
  locationId?: string;
  actorId?: string;
}

@Injectable()
export class ManageSessionsUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepo: EventRepositoryPort,
    @Inject(LOCATION_REPOSITORY)
    private readonly locationRepo: LocationRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async addSession(command: AddEventSessionCommand): Promise<Event> {
    const event = await this.eventRepo.findById(command.eventId);
    if (!event) {
      throw new EventNotFoundException(command.eventId);
    }

    if (command.locationId) {
      const location = await this.locationRepo.findById(command.locationId);
      if (!location) {
        throw new LocationNotFoundException(command.locationId);
      }
    }

    const session = new EventSession({
      eventId: event.id,
      name: command.name,
      type: command.type,
      description: command.description,
      status: command.status,
      startAt: command.startAt,
      endAt: command.endAt,
      timezone: command.timezone ?? event.timezone,
      allDay: command.allDay,
      notes: command.notes,
      locationId: command.locationId,
    });

    event.addSession(session, command.actorId);

    const saved = await this.eventRepo.save(event);
    await this.eventPublisher.publishAll(event.domainEvents);
    event.clearDomainEvents();

    return saved;
  }
}
