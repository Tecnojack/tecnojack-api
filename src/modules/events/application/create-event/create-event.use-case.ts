import { Injectable, Inject } from '@nestjs/common';
import {
  EVENT_REPOSITORY,
  EVENT_TYPE_REPOSITORY,
  type EventRepositoryPort,
  type EventTypeRepositoryPort,
} from '../ports/event.repository.port.js';
import { PeopleFacade } from '../../../people/public/people.facade.js';
import { Event } from '../../domain/entities/event.entity.js';
import { EventBrief, type EventBriefProps } from '../../domain/value-objects/event-brief.value-object.js';
import { EventPriority } from '../../domain/enums/events.enums.js';
import { EventTypeNotFoundException } from '../../domain/errors/events.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface CreateEventCommand {
  name: string;
  slug?: string;
  eventTypeId: string;
  priority?: EventPriority;
  ownerUserId?: string;
  timezone?: string;
  estimatedStartAt?: Date;
  estimatedEndAt?: Date;
  brief?: EventBriefProps;
  actorId?: string;
}

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepo: EventRepositoryPort,
    @Inject(EVENT_TYPE_REPOSITORY)
    private readonly eventTypeRepo: EventTypeRepositoryPort,
    private readonly peopleFacade: PeopleFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: CreateEventCommand): Promise<Event> {
    const eventType = await this.eventTypeRepo.findById(command.eventTypeId);
    if (!eventType?.isActive) {
      throw new EventTypeNotFoundException(command.eventTypeId);
    }

    if (command.ownerUserId) {
      const person = await this.peopleFacade.findPersonByIdOrCode(command.ownerUserId);
      if (!person) {
        await this.peopleFacade.findOrganizationByIdOrCode(command.ownerUserId);
      }
    }

    const code = await this.eventRepo.nextCode();
    const brief = command.brief ? new EventBrief(command.brief) : new EventBrief();

    const event = Event.create(
      {
        code,
        name: command.name,
        slug: command.slug,
        eventTypeId: command.eventTypeId,
        priority: command.priority ?? eventType.defaultPriority,
        ownerUserId: command.ownerUserId,
        timezone: command.timezone ?? eventType.defaultTimezone ?? 'UTC',
        estimatedStartAt: command.estimatedStartAt,
        estimatedEndAt: command.estimatedEndAt,
        brief,
      },
      command.actorId,
    );

    const saved = await this.eventRepo.save(event);
    await this.eventPublisher.publishAll(event.domainEvents);
    event.clearDomainEvents();

    return saved;
  }
}
