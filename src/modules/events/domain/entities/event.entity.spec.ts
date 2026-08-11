import { Event } from './event.entity.js';
import { EventLifecycleStatus, EventProductionPhase, EventDateStatus } from '../enums/events.enums.js';
import { EventSession } from './event-session.entity.js';
import { InvalidEventStatusTransitionException, EventAlreadyDeletedException } from '../errors/events.errors.js';

describe('Event Aggregate Entity', () => {
  it('should create a valid DRAFT Event and raise EventCreatedEvent', () => {
    const event = Event.create({
      code: 'EVT-000001',
      name: 'Boda Gabriel y Mercedes',
      eventTypeId: crypto.randomUUID(),
    });

    expect(event.id).toBeDefined();
    expect(event.code).toBe('EVT-000001');
    expect(event.lifecycleStatus).toBe(EventLifecycleStatus.DRAFT);
    expect(event.productionPhase).toBe(EventProductionPhase.INQUIRY);
    expect(event.domainEvents.length).toBe(1);
    expect(event.domainEvents[0]!.eventName).toBe('events.event.created');
  });

  it('should activate draft event', () => {
    const event = Event.create({
      code: 'EVT-000002',
      name: 'Fiesta Quinceañera Sofia',
      eventTypeId: crypto.randomUUID(),
    });
    event.clearDomainEvents();

    event.activate('user-admin');
    expect(event.lifecycleStatus).toBe(EventLifecycleStatus.ACTIVE);
    expect(event.domainEvents.length).toBe(1);
    expect(event.domainEvents[0]!.eventName).toBe('events.event.activated');
  });

  it('should change production phase when event is ACTIVE', () => {
    const event = Event.create({
      code: 'EVT-000003',
      name: 'Video Musical Jack',
      eventTypeId: crypto.randomUUID(),
    });
    event.activate();
    event.clearDomainEvents();

    event.changePhase(EventProductionPhase.PRODUCTION);
    expect(event.productionPhase).toBe(EventProductionPhase.PRODUCTION);
    expect(event.domainEvents[0]!.eventName).toBe('events.event.phase_changed');
  });

  it('should throw error when changing production phase on DRAFT event', () => {
    const event = Event.create({
      code: 'EVT-000004',
      name: 'Evento Corporativo',
      eventTypeId: crypto.randomUUID(),
    });

    expect(() => event.changePhase(EventProductionPhase.PRODUCTION)).toThrow(
      InvalidEventStatusTransitionException,
    );
  });

  it('should add session and recalculate date status', () => {
    const event = Event.create({
      code: 'EVT-000005',
      name: 'Boda Camilo y Laura',
      eventTypeId: crypto.randomUUID(),
    });
    expect(event.dateStatus).toBe(EventDateStatus.UNSCHEDULED);

    const session = new EventSession({
      eventId: event.id,
      name: 'Ceremonia Religiosa',
      startAt: new Date('2026-10-15T16:00:00Z'),
      endAt: new Date('2026-10-15T18:00:00Z'),
    });

    event.addSession(session);
    expect(event.sessions.length).toBe(1);
    expect(event.dateStatus).toBe(EventDateStatus.CONFIRMED);
  });

  it('should soft delete and throw on subsequent mutations', () => {
    const event = Event.create({
      code: 'EVT-000006',
      name: 'Grado Universidad',
      eventTypeId: crypto.randomUUID(),
    });

    event.softDelete('user-1');
    expect(event.isDeleted()).toBe(true);
    expect(event.lifecycleStatus).toBe(EventLifecycleStatus.ARCHIVED);

    expect(() => event.softDelete('user-1')).toThrow(EventAlreadyDeletedException);
    expect(() => event.activate()).toThrow(EventAlreadyDeletedException);
  });
});
