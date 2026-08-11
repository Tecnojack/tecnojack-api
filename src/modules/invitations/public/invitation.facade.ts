import { Injectable } from '@nestjs/common';
import { CreateInvitationUseCase, type CreateInvitationCommand } from '../application/create-invitation/create-invitation.use-case.js';
import { ManageInvitationLifecycleUseCase } from '../application/manage-invitation-lifecycle/manage-invitation-lifecycle.use-case.js';
import { ManageInvitationGuestsUseCase, type RSVPCommand } from '../application/manage-invitation-guests/manage-invitation-guests.use-case.js';
import type { Invitation } from '../domain/entities/invitation.entity.js';

@Injectable()
export class InvitationFacade {
  constructor(
    private readonly createUseCase: CreateInvitationUseCase,
    private readonly lifecycleUseCase: ManageInvitationLifecycleUseCase,
    private readonly guestsUseCase: ManageInvitationGuestsUseCase,
  ) {}

  createInvitation(command: CreateInvitationCommand): Promise<Invitation> {
    return this.createUseCase.execute(command);
  }

  getInvitation(identifier: string): Promise<Invitation> {
    return this.lifecycleUseCase.findByIdOrCodeOrSlug(identifier);
  }

  confirmRSVP(command: RSVPCommand): Promise<Invitation> {
    return this.guestsUseCase.confirmRSVP(command);
  }
}
