import { Module } from '@nestjs/common';
import { PeopleModule } from '../people/people.module.js';
import { MediaModule } from '../media/media.module.js';
import {
  EVENT_REPOSITORY,
  EVENT_TYPE_REPOSITORY,
  LOCATION_REPOSITORY,
} from './application/ports/event.repository.port.js';
import { PrismaEventRepository } from './infrastructure/persistence/prisma/repositories/prisma-event.repository.js';
import { PrismaEventTypeRepository } from './infrastructure/persistence/prisma/repositories/prisma-event-type.repository.js';
import { PrismaLocationRepository } from './infrastructure/persistence/prisma/repositories/prisma-location.repository.js';
import { CreateEventUseCase } from './application/create-event/create-event.use-case.js';
import { GetEventUseCase } from './application/get-event/get-event.use-case.js';
import { UpdateEventUseCase } from './application/update-event/update-event.use-case.js';
import { ManageEventStateUseCase } from './application/manage-event-state/manage-event-state.use-case.js';
import { ListEventsUseCase } from './application/list-events/list-events.use-case.js';
import { ManageSessionsUseCase } from './application/manage-sessions/manage-sessions.use-case.js';
import { EventsController } from './presentation/http/controllers/events.controller.js';
import { EventsFacade } from './public/events.facade.js';

@Module({
  imports: [PeopleModule, MediaModule],
  controllers: [EventsController],
  providers: [
    {
      provide: EVENT_REPOSITORY,
      useClass: PrismaEventRepository,
    },
    {
      provide: EVENT_TYPE_REPOSITORY,
      useClass: PrismaEventTypeRepository,
    },
    {
      provide: LOCATION_REPOSITORY,
      useClass: PrismaLocationRepository,
    },
    CreateEventUseCase,
    GetEventUseCase,
    UpdateEventUseCase,
    ManageEventStateUseCase,
    ListEventsUseCase,
    ManageSessionsUseCase,
    EventsFacade,
  ],
  exports: [EventsFacade, EVENT_REPOSITORY, EVENT_TYPE_REPOSITORY, LOCATION_REPOSITORY],
})
export class EventsModule {}
