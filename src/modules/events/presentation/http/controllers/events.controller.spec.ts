import { EventsController } from './events.controller.js';
import type { CreateEventUseCase } from '../../../application/create-event/create-event.use-case.js';
import type { GetEventUseCase } from '../../../application/get-event/get-event.use-case.js';
import type { UpdateEventUseCase } from '../../../application/update-event/update-event.use-case.js';
import type { ManageEventStateUseCase } from '../../../application/manage-event-state/manage-event-state.use-case.js';
import type { ListEventsUseCase } from '../../../application/list-events/list-events.use-case.js';
import type { ManageSessionsUseCase } from '../../../application/manage-sessions/manage-sessions.use-case.js';
import { Event } from '../../../domain/entities/event.entity.js';

describe('EventsController', () => {
  let controller: EventsController;
  let sampleEvent: Event;

  beforeEach(() => {
    sampleEvent = Event.create({
      code: 'EVT-000001',
      name: 'Boda Gabriel y Mercedes',
      eventTypeId: crypto.randomUUID(),
    });

    const createUseCase = {
      execute: jest.fn().mockResolvedValue(sampleEvent),
    } as unknown as CreateEventUseCase;

    const getUseCase = {
      execute: jest.fn().mockResolvedValue(sampleEvent),
    } as unknown as GetEventUseCase;

    const updateUseCase = {
      execute: jest.fn().mockResolvedValue(sampleEvent),
    } as unknown as UpdateEventUseCase;

    const stateUseCase = {
      activate: jest.fn().mockResolvedValue(sampleEvent),
      changePhase: jest.fn().mockResolvedValue(sampleEvent),
      complete: jest.fn().mockResolvedValue(sampleEvent),
      cancel: jest.fn().mockResolvedValue(sampleEvent),
      archive: jest.fn().mockResolvedValue(sampleEvent),
      restore: jest.fn().mockResolvedValue(sampleEvent),
    } as unknown as ManageEventStateUseCase;

    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleEvent],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListEventsUseCase;

    const sessionUseCase = {
      addSession: jest.fn().mockResolvedValue(sampleEvent),
    } as unknown as ManageSessionsUseCase;

    controller = new EventsController(
      createUseCase,
      getUseCase,
      updateUseCase,
      stateUseCase,
      listUseCase,
      sessionUseCase,
    );
  });

  it('should create event via controller', async () => {
    const res = await controller.create({
      name: 'Boda Gabriel y Mercedes',
      eventTypeId: crypto.randomUUID(),
    });
    expect(res.code).toBe('EVT-000001');
  });

  it('should get event by identifier', async () => {
    const res = await controller.findOne('EVT-000001');
    expect(res.code).toBe('EVT-000001');
  });

  it('should list events', async () => {
    const res = await controller.findAll({});
    expect(res.data.length).toBe(1);
    expect(res.total).toBe(1);
  });
});
