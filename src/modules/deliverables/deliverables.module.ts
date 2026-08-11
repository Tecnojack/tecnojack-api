import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module.js';
import { PeopleModule } from '../people/people.module.js';
import { MediaModule } from '../media/media.module.js';
import { GalleryModule } from '../gallery/gallery.module.js';
import { DELIVERABLE_REPOSITORY } from './application/ports/deliverable.repository.port.js';
import { PrismaDeliverableRepository } from './infrastructure/persistence/prisma/repositories/prisma-deliverable.repository.js';
import { CreateDeliverableUseCase } from './application/create-deliverable/create-deliverable.use-case.js';
import { GetDeliverableUseCase } from './application/get-deliverable/get-deliverable.use-case.js';
import { UpdateDeliverableUseCase } from './application/update-deliverable/update-deliverable.use-case.js';
import { ManageDeliverableStateUseCase } from './application/manage-deliverable-state/manage-deliverable-state.use-case.js';
import { ManageDeliverableItemsUseCase } from './application/manage-deliverable-items/manage-deliverable-items.use-case.js';
import { ListDeliverablesUseCase } from './application/list-deliverables/list-deliverables.use-case.js';
import { DeliverablesController } from './presentation/http/controllers/deliverables.controller.js';
import { DeliverableFacade } from './public/deliverable.facade.js';

@Module({
  imports: [EventsModule, PeopleModule, MediaModule, GalleryModule],
  controllers: [DeliverablesController],
  providers: [
    {
      provide: DELIVERABLE_REPOSITORY,
      useClass: PrismaDeliverableRepository,
    },
    CreateDeliverableUseCase,
    GetDeliverableUseCase,
    UpdateDeliverableUseCase,
    ManageDeliverableStateUseCase,
    ManageDeliverableItemsUseCase,
    ListDeliverablesUseCase,
    DeliverableFacade,
  ],
  exports: [DeliverableFacade, DELIVERABLE_REPOSITORY],
})
export class DeliverablesModule {}
