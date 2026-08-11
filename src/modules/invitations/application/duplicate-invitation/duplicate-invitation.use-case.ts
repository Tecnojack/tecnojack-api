import { Injectable, Inject } from '@nestjs/common';
import {
  INVITATION_REPOSITORY,
  type InvitationRepositoryPort,
} from '../ports/invitation.repository.port.js';
import { Invitation } from '../../domain/entities/invitation.entity.js';
import { InvitationNotFoundException } from '../../domain/errors/invitations.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface DuplicateInvitationCommand {
  sourceId: string;
  newSlug: string;
  newTitle: string;
  actorId?: string;
}

@Injectable()
export class DuplicateInvitationUseCase {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly repo: InvitationRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: DuplicateInvitationCommand): Promise<Invitation> {
    const source = await this.repo.findById(command.sourceId);
    if (!source) {
      throw new InvitationNotFoundException(command.sourceId);
    }

    const existingSlug = await this.repo.findBySlug(command.newSlug);
    if (existingSlug) {
      throw new Error(`Invitation slug "${command.newSlug}" is already in use.`);
    }

    const code = await this.repo.nextCode();

    const duplicate = Invitation.create(
      {
        code,
        eventId: source.eventId,
        slug: command.newSlug,
        title: command.newTitle,
        description: source.description,
        language: source.language,
        visibility: source.visibility,
        passwordHash: source.passwordHash,
        expiresAt: source.expiresAt,
        galleryId: source.galleryId,
        coverMediaId: source.coverMediaId,
        musicUrl: source.musicUrl,
        theme: source.theme,
      },
      command.actorId,
    );

    const saved = await this.repo.save(duplicate);
    await this.eventPublisher.publishAll(duplicate.domainEvents);
    duplicate.clearDomainEvents();

    return saved;
  }
}
