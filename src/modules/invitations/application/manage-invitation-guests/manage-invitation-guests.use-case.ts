import { Injectable, Inject } from '@nestjs/common';
import {
  INVITATION_REPOSITORY,
  type InvitationRepositoryPort,
} from '../ports/invitation.repository.port.js';
import type { Invitation } from '../../domain/entities/invitation.entity.js';
import { InvitationGuest } from '../../domain/entities/invitation-guest.entity.js';
import { InvitationNotFoundException } from '../../domain/errors/invitations.errors.js';
import { NotificationFacade } from '../../../notifications/public/notification.facade.js';
import { NotificationChannel } from '../../../notifications/public/index.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface AddGuestCommand {
  invitationId: string;
  displayName: string;
  email?: string;
  phone?: string;
  maxCompanions?: number;
  personId?: string;
  actorId?: string;
  notifyGuest?: boolean;
}

export interface RSVPCommand {
  invitationId: string;
  guestId: string;
  isComing: boolean;
  companions?: string[];
  dietaryRestrictions?: string;
  guestNotes?: string;
}

@Injectable()
export class ManageInvitationGuestsUseCase {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly repo: InvitationRepositoryPort,
    private readonly notificationsFacade: NotificationFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async addGuest(command: AddGuestCommand): Promise<Invitation> {
    const invitation = await this.repo.findById(command.invitationId);
    if (!invitation) throw new InvitationNotFoundException(command.invitationId);

    const guest = new InvitationGuest({
      displayName: command.displayName,
      email: command.email,
      phone: command.phone,
      maxCompanions: command.maxCompanions,
      personId: command.personId,
    });

    invitation.addGuest(guest, command.actorId);
    const saved = await this.repo.save(invitation);

    // Notify guest using NotificationFacade if requested
    if (command.notifyGuest && (command.email || command.phone)) {
      try {
        await this.notificationsFacade.sendNotification({
          channel: command.email ? NotificationChannel.EMAIL : NotificationChannel.SMS,
          recipients: [{ recipientAddress: command.email ?? command.phone! }],
          variables: {
            body: `Hola ${command.displayName}, has sido invitado a: ${invitation.title}. Ingresa al enlace para confirmar tu asistencia: /invitations/${invitation.slug}`,
          },
        });
      } catch {
        // Suppress dispatch failures to avoid rolling back DB writes
      }
    }

    return saved;
  }

  async confirmRSVP(command: RSVPCommand): Promise<Invitation> {
    const invitation = await this.repo.findById(command.invitationId);
    if (!invitation) throw new InvitationNotFoundException(command.invitationId);

    if (command.isComing) {
      invitation.confirmRSVP(
        command.guestId,
        command.companions ?? [],
        command.dietaryRestrictions,
        command.guestNotes,
      );
    } else {
      invitation.declineRSVP(command.guestId, command.guestNotes);
    }

    const saved = await this.repo.save(invitation);
    await this.eventPublisher.publishAll(invitation.domainEvents);
    invitation.clearDomainEvents();

    return saved;
  }
}
