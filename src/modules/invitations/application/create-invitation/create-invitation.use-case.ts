import { Injectable, Inject } from '@nestjs/common';
import {
  INVITATION_REPOSITORY,
  type InvitationRepositoryPort,
} from '../ports/invitation.repository.port.js';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { Invitation } from '../../domain/entities/invitation.entity.js';
import { InvitationVisibility } from '../../domain/enums/invitations.enums.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface CreateInvitationCommand {
  eventId: string;
  slug: string;
  title: string;
  description?: string;
  language?: string;
  visibility?: InvitationVisibility;
  password?: string;
  expiresAt?: Date;
  theme?: Record<string, unknown>;
  actorId?: string;
}

@Injectable()
export class CreateInvitationUseCase {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly repo: InvitationRepositoryPort,
    private readonly eventsFacade: EventsFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: CreateInvitationCommand): Promise<Invitation> {
    // Validate Event exists using EventsFacade
    await this.eventsFacade.getEvent(command.eventId);

    const existingSlug = await this.repo.findBySlug(command.slug);
    if (existingSlug) {
      throw new Error(`Invitation slug "${command.slug}" is already in use.`);
    }

    const code = await this.repo.nextCode();
    const invitation = Invitation.create(
      {
        code,
        eventId: command.eventId,
        slug: command.slug,
        title: command.title,
        description: command.description,
        language: command.language,
        visibility: command.visibility,
        passwordHash: command.password ?? null, // Simplification (pure password string for domain mock logic)
        expiresAt: command.expiresAt,
        theme: command.theme,
      },
      command.actorId,
    );

    const saved = await this.repo.save(invitation);
    await this.eventPublisher.publishAll(invitation.domainEvents);
    invitation.clearDomainEvents();

    return saved;
  }
}
