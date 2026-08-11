import { Module } from '@nestjs/common';
import { PeopleModule } from '../people/people.module.js';
import { EventsModule } from '../events/events.module.js';
import { GalleryModule } from '../gallery/gallery.module.js';
import { MediaModule } from '../media/media.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { INVITATION_REPOSITORY } from './application/ports/invitation.repository.port.js';
import { PrismaInvitationRepository } from './infrastructure/persistence/prisma/repositories/prisma-invitation.repository.js';
import { CreateInvitationUseCase } from './application/create-invitation/create-invitation.use-case.js';
import { DuplicateInvitationUseCase } from './application/duplicate-invitation/duplicate-invitation.use-case.js';
import { ManageInvitationGuestsUseCase } from './application/manage-invitation-guests/manage-invitation-guests.use-case.js';
import { ManageInvitationLayoutUseCase } from './application/manage-invitation-layout/manage-invitation-layout.use-case.js';
import { ManageInvitationLifecycleUseCase } from './application/manage-invitation-lifecycle/manage-invitation-lifecycle.use-case.js';
import { ListInvitationsUseCase } from './application/list-invitations/list-invitations.use-case.js';
import { InvitationsController } from './presentation/http/controllers/invitations.controller.js';
import { InvitationFacade } from './public/invitation.facade.js';

@Module({
  imports: [
    PeopleModule,
    EventsModule,
    GalleryModule,
    MediaModule,
    NotificationsModule,
  ],
  controllers: [InvitationsController],
  providers: [
    {
      provide: INVITATION_REPOSITORY,
      useClass: PrismaInvitationRepository,
    },
    CreateInvitationUseCase,
    DuplicateInvitationUseCase,
    ManageInvitationGuestsUseCase,
    ManageInvitationLayoutUseCase,
    ManageInvitationLifecycleUseCase,
    ListInvitationsUseCase,
    InvitationFacade,
  ],
  exports: [InvitationFacade, INVITATION_REPOSITORY],
})
export class InvitationsModule {}
