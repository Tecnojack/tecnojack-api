import { Injectable, Logger } from '@nestjs/common';
import type { DomainEventPublisherPort } from '../../domain/events/domain-event-publisher.port.js';
import type { DomainEvent } from '../../domain/events/domain-event.interface.js';

@Injectable()
export class InMemoryDomainEventPublisher implements DomainEventPublisherPort {
  private readonly logger = new Logger(InMemoryDomainEventPublisher.name);

  async publish(event: DomainEvent): Promise<void> {
    this.logger.log(`[DomainEvent] ${event.eventName} published for Aggregate ${event.aggregateId}`);
    await Promise.resolve();
  }

  async publishAll(events: readonly DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
