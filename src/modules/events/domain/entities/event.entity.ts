import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import {
  EventLifecycleStatus,
  EventProductionPhase,
  EventDateStatus,
  EventPriority,
} from '../enums/events.enums.js';
import { EventBrief } from '../value-objects/event-brief.value-object.js';
import type { EventSession } from './event-session.entity.js';
import {
  EventAlreadyDeletedException,
  InvalidEventStatusTransitionException,
} from '../errors/events.errors.js';
import {
  EventCreatedEvent,
  EventActivatedEvent,
  EventUpdatedEvent,
  EventProductionPhaseChangedEvent,
  EventCompletedEvent,
  EventCancelledEvent,
  EventArchivedEvent,
  EventRestoredEvent,
  EventSessionAddedEvent,
} from '../events/events.domain-events.js';

export interface EventProps {
  id?: string;
  code: string;
  name: string;
  slug?: string | null;
  eventTypeId: string;
  lifecycleStatus?: EventLifecycleStatus;
  productionPhase?: EventProductionPhase;
  dateStatus?: EventDateStatus;
  priority?: EventPriority;
  ownerUserId?: string | null;
  timezone?: string;
  estimatedStartAt?: Date | null;
  estimatedEndAt?: Date | null;
  confirmedStartAt?: Date | null;
  confirmedEndAt?: Date | null;
  brief?: EventBrief;
  cancellationReason?: string | null;
  cancelledAt?: Date | null;
  completedAt?: Date | null;
  closedAt?: Date | null;
  archivedAt?: Date | null;
  sessions?: EventSession[];
  audit?: AuditInfo;
}

export class Event extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _name: string;
  private _slug: string | null;
  private _eventTypeId: string;
  private _lifecycleStatus: EventLifecycleStatus;
  private _productionPhase: EventProductionPhase;
  private _dateStatus: EventDateStatus;
  private _priority: EventPriority;
  private _ownerUserId: string | null;
  private _timezone: string;
  private _estimatedStartAt: Date | null;
  private _estimatedEndAt: Date | null;
  private _confirmedStartAt: Date | null;
  private _confirmedEndAt: Date | null;
  private _brief: EventBrief;
  private _cancellationReason: string | null;
  private _cancelledAt: Date | null;
  private _completedAt: Date | null;
  private _closedAt: Date | null;
  private _archivedAt: Date | null;
  private _sessions: EventSession[];
  private _audit: AuditInfo;

  constructor(props: EventProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Event code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Event name cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._name = props.name.trim();
    this._slug = props.slug?.trim() ?? null;
    this._eventTypeId = props.eventTypeId;
    this._lifecycleStatus = props.lifecycleStatus ?? EventLifecycleStatus.DRAFT;
    this._productionPhase = props.productionPhase ?? EventProductionPhase.INQUIRY;
    this._dateStatus = props.dateStatus ?? EventDateStatus.UNSCHEDULED;
    this._priority = props.priority ?? EventPriority.MEDIUM;
    this._ownerUserId = props.ownerUserId ?? null;
    this._timezone = props.timezone?.trim() ?? 'UTC';
    this._estimatedStartAt = props.estimatedStartAt ?? null;
    this._estimatedEndAt = props.estimatedEndAt ?? null;
    this._confirmedStartAt = props.confirmedStartAt ?? null;
    this._confirmedEndAt = props.confirmedEndAt ?? null;
    this._brief = props.brief ?? new EventBrief();
    this._cancellationReason = props.cancellationReason ?? null;
    this._cancelledAt = props.cancelledAt ?? null;
    this._completedAt = props.completedAt ?? null;
    this._closedAt = props.closedAt ?? null;
    this._archivedAt = props.archivedAt ?? null;
    this._sessions = props.sessions ? [...props.sessions] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: EventProps, actorId?: string): Event {
    const event = new Event({
      ...props,
      audit: AuditInfo.create(actorId),
    });

    event.addDomainEvent(
      new EventCreatedEvent({
        eventId: event.id,
        code: event.code,
        name: event.name,
        eventTypeId: event.eventTypeId,
        lifecycleStatus: event.lifecycleStatus,
        productionPhase: event.productionPhase,
        createdBy: actorId ?? null,
      }),
    );

    return event;
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get slug(): string | null { return this._slug; }
  get eventTypeId(): string { return this._eventTypeId; }
  get lifecycleStatus(): EventLifecycleStatus { return this._lifecycleStatus; }
  get productionPhase(): EventProductionPhase { return this._productionPhase; }
  get dateStatus(): EventDateStatus { return this._dateStatus; }
  get priority(): EventPriority { return this._priority; }
  get ownerUserId(): string | null { return this._ownerUserId; }
  get timezone(): string { return this._timezone; }
  get estimatedStartAt(): Date | null { return this._estimatedStartAt; }
  get estimatedEndAt(): Date | null { return this._estimatedEndAt; }
  get confirmedStartAt(): Date | null { return this._confirmedStartAt; }
  get confirmedEndAt(): Date | null { return this._confirmedEndAt; }
  get brief(): EventBrief { return this._brief; }
  get cancellationReason(): string | null { return this._cancellationReason; }
  get cancelledAt(): Date | null { return this._cancelledAt; }
  get completedAt(): Date | null { return this._completedAt; }
  get closedAt(): Date | null { return this._closedAt; }
  get archivedAt(): Date | null { return this._archivedAt; }
  get sessions(): readonly EventSession[] { return this._sessions; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(props: Partial<Pick<EventProps, 'name' | 'slug' | 'priority' | 'timezone' | 'ownerUserId' | 'estimatedStartAt' | 'estimatedEndAt' | 'brief'>>, actorId?: string): void {
    this.ensureNotDeleted();
    if (this._lifecycleStatus === EventLifecycleStatus.CLOSED) {
      throw new InvalidEventStatusTransitionException(this._lifecycleStatus, 'UPDATE', 'Closed events cannot be edited.');
    }

    if (props.name) this._name = props.name.trim();
    if (props.slug !== undefined) this._slug = props.slug?.trim() ?? null;
    if (props.priority !== undefined) this._priority = props.priority;
    if (props.timezone) this._timezone = props.timezone.trim();
    if (props.ownerUserId !== undefined) this._ownerUserId = props.ownerUserId ?? null;
    if (props.estimatedStartAt !== undefined) this._estimatedStartAt = props.estimatedStartAt;
    if (props.estimatedEndAt !== undefined) this._estimatedEndAt = props.estimatedEndAt;
    if (props.brief) this._brief = props.brief;

    this._audit = this._audit.touch(actorId);
    this.addDomainEvent(
      new EventUpdatedEvent({
        eventId: this.id,
        code: this._code,
        updatedFields: ['name', 'brief', 'dates'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  activate(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._lifecycleStatus !== EventLifecycleStatus.DRAFT) {
      throw new InvalidEventStatusTransitionException(this._lifecycleStatus, EventLifecycleStatus.ACTIVE);
    }

    this._lifecycleStatus = EventLifecycleStatus.ACTIVE;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new EventActivatedEvent({
        eventId: this.id,
        code: this._code,
        activatedAt: new Date(),
        activatedBy: actorId ?? null,
      }),
    );
  }

  changePhase(phase: EventProductionPhase, actorId?: string): void {
    this.ensureNotDeleted();
    if (this._lifecycleStatus !== EventLifecycleStatus.ACTIVE) {
      throw new InvalidEventStatusTransitionException(this._lifecycleStatus, phase, 'Only ACTIVE events can change production phase.');
    }

    const previousPhase = this._productionPhase;
    this._productionPhase = phase;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new EventProductionPhaseChangedEvent({
        eventId: this.id,
        code: this._code,
        previousPhase,
        newPhase: phase,
        updatedBy: actorId ?? null,
      }),
    );
  }

  complete(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._lifecycleStatus !== EventLifecycleStatus.ACTIVE) {
      throw new InvalidEventStatusTransitionException(this._lifecycleStatus, EventLifecycleStatus.COMPLETED);
    }

    this._lifecycleStatus = EventLifecycleStatus.COMPLETED;
    this._productionPhase = EventProductionPhase.FINISHED;
    this._completedAt = new Date();
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new EventCompletedEvent({
        eventId: this.id,
        code: this._code,
        completedAt: this._completedAt,
        completedBy: actorId ?? null,
      }),
    );
  }

  cancel(reason: string, actorId?: string): void {
    this.ensureNotDeleted();
    if (!reason || reason.trim().length === 0) {
      throw new Error('Cancellation reason is required.');
    }
    if (this._lifecycleStatus === EventLifecycleStatus.CLOSED || this._lifecycleStatus === EventLifecycleStatus.CANCELLED) {
      throw new InvalidEventStatusTransitionException(this._lifecycleStatus, EventLifecycleStatus.CANCELLED);
    }

    this._lifecycleStatus = EventLifecycleStatus.CANCELLED;
    this._cancellationReason = reason.trim();
    this._cancelledAt = new Date();
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new EventCancelledEvent({
        eventId: this.id,
        code: this._code,
        reason: this._cancellationReason,
        cancelledAt: this._cancelledAt,
        cancelledBy: actorId ?? null,
      }),
    );
  }

  addSession(session: EventSession, actorId?: string): void {
    this.ensureNotDeleted();
    this._sessions.push(session);
    this.recalculateDateStatus();
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new EventSessionAddedEvent({
        eventId: this.id,
        sessionId: session.id,
        sessionName: session.name,
        addedBy: actorId ?? null,
      }),
    );
  }

  private recalculateDateStatus(): void {
    if (this._sessions.length === 0) {
      this._dateStatus = EventDateStatus.UNSCHEDULED;
      return;
    }
    const confirmedCount = this._sessions.filter((s) => s.startAt !== null && s.endAt !== null).length;
    if (confirmedCount === this._sessions.length) {
      this._dateStatus = EventDateStatus.CONFIRMED;
    } else if (confirmedCount > 0) {
      this._dateStatus = EventDateStatus.PARTIALLY_CONFIRMED;
    } else {
      this._dateStatus = EventDateStatus.TENTATIVE;
    }
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new EventAlreadyDeletedException(this.id);
    }

    this._audit = this._audit.softDelete(actorId);
    this._lifecycleStatus = EventLifecycleStatus.ARCHIVED;
    this._archivedAt = this._audit.deletedAt;

    this.addDomainEvent(
      new EventArchivedEvent({
        eventId: this.id,
        code: this._code,
        deletedAt: this._audit.deletedAt!,
        deletedBy: actorId ?? null,
      }),
    );
  }

  restore(actorId?: string): void {
    if (!this._audit.isDeleted()) return;

    this._audit = this._audit.restore(actorId);
    this._lifecycleStatus = EventLifecycleStatus.ACTIVE;
    this._archivedAt = null;

    this.addDomainEvent(
      new EventRestoredEvent({
        eventId: this.id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new EventAlreadyDeletedException(this.id);
    }
  }
}
