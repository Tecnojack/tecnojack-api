import { Injectable, Inject } from '@nestjs/common';
import {
  EVENT_REPOSITORY,
  type EventRepositoryPort,
} from '../ports/event.repository.port.js';
import type { Event } from '../../domain/entities/event.entity.js';
import { EventBrief, type EventBriefProps } from '../../domain/value-objects/event-brief.value-object.js';
import type { EventPriority } from '../../domain/enums/events.enums.js';
import { EventNotFoundException } from '../../domain/errors/events.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface UpdateEventCommand {
  id: string;
  name?: string;
  slug?: string;
  priority?: EventPriority;
  timezone?: string;
  ownerUserId?: string;
  estimatedStartAt?: Date;
  estimatedEndAt?: Date;
  brief?: EventBriefProps;
  actorId?: string;
}

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepo: EventRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: UpdateEventCommand): Promise<Event> {
    const event = await this.eventRepo.findById(command.id);
    if (!event) {
      throw new EventNotFoundException(command.id);
    }

    const brief = command.brief ? new EventBrief({ ...event.brief, ...command.brief }) : undefined;

    event.updateDetails(
      {
        name: command.name,
        slug: command.slug,
        priority: command.priority,
        timezone: command.timezone,
        ownerUserId: command.ownerUserId,
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
