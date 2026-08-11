import type { DomainEvent } from '../events/domain-event.interface.js';

export abstract class AggregateRoot<TId = string> {
  protected readonly _id: TId;
  private readonly _domainEvents: DomainEvent[] = [];

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  get domainEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }
}
