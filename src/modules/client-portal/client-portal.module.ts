import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module.js';
import { GalleryModule } from '../gallery/gallery.module.js';
import { DeliverablesModule } from '../deliverables/deliverables.module.js';
import { PeopleModule } from '../people/people.module.js';
import { GetClientDashboardUseCase } from './application/get-client-dashboard/get-client-dashboard.use-case.js';
import { GetClientGalleriesUseCase } from './application/get-client-galleries/get-client-galleries.use-case.js';
import { GetClientDeliverablesUseCase } from './application/get-client-deliverables/get-client-deliverables.use-case.js';
import { GetClientTimelineUseCase } from './application/get-client-timeline/get-client-timeline.use-case.js';
import { ClientPortalController } from './presentation/http/controllers/client-portal.controller.js';
import { ClientPortalFacade } from './public/client-portal.facade.js';

@Module({
  imports: [EventsModule, GalleryModule, DeliverablesModule, PeopleModule],
  controllers: [ClientPortalController],
  providers: [
    GetClientDashboardUseCase,
    GetClientGalleriesUseCase,
    GetClientDeliverablesUseCase,
    GetClientTimelineUseCase,
    ClientPortalFacade,
  ],
  exports: [ClientPortalFacade],
})
export class ClientPortalModule {}
