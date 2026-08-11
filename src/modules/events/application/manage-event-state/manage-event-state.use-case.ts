import { Injectable, Inject } from '@nestjs/common';
import {
  EVENT_REPOSITORY,
  type EventRepositoryPort,
} from '../ports/event.repository.port.js';
import type { Event } from '../../domain/entities/event.entity.js';
import type { EventProductionPhase } from '../../domain/enums/events.enums.js';
import { EventNotFoundException } from '../../domain/errors/events.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

@Injectable()
export class ManageEventStateUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepo: EventRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async activate(id: string, actorId?: string): Promise<Event> {
    const event = await this.getEvent(id);
    event.activate(actorId);
    return this.saveAndPublish(event);
  }

  async changePhase(id: string, phase: EventProductionPhase, actorId?: string): Promise<Event> {
    const event = await this.getEvent(id);
    event.changePhase(phase, actorId);
    return this.saveAndPublish(event);
  }

  async complete(id: string, actorId?: string): Promise<Event> {
    const event = await this.getEvent(id);
    event.complete(actorId);
    return this.saveAndPublish(event);
  }

  async cancel(id: string, reason: string, actorId?: string): Promise<Event> {
    const event = await this.getEvent(id);
    event.cancel(reason, actorId);
    return this.saveAndPublish(event);
  }

  async archive(id: string, actorId?: string): Promise<Event> {
    const event = await this.getEvent(id);
    event.softDelete(actorId);
    return this.saveAndPublish(event);
  }

  async restore(id: string, actorId?: string): Promise<Event> {
    const event = await this.getEvent(id);
    event.restore(actorId);
    return this.saveAndPublish(event);
  }

  private async getEvent(id: string): Promise<Event> {
    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new EventNotFoundException(id);
    }
    return event;
  }

  private async saveAndPublish(event: Event): Promise<Event> {
    const saved = await this.eventRepo.save(event);
    await this.eventPublisher.publishAll(event.domainEvents);
    event.clearDomainEvents();
    return saved;
  }
}
