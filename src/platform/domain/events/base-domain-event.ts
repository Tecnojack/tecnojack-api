import type { DomainEvent } from './domain-event.interface.js';

export abstract class BaseDomainEvent<T = unknown> implements DomainEvent<T> {
  readonly eventId: string;
  readonly occurredOn: Date;

  constructor(
    readonly eventName: string,
    readonly aggregateId: string,
    readonly payload: T,
    eventId?: string,
    occurredOn?: Date,
  ) {
    this.eventId = eventId ?? crypto.randomUUID();
    this.occurredOn = occurredOn ?? new Date();
  }
}
