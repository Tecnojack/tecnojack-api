import { Injectable, Inject } from '@nestjs/common';
import {
  INVITATION_REPOSITORY,
  type InvitationRepositoryPort,
} from '../ports/invitation.repository.port.js';
import type { Invitation } from '../../domain/entities/invitation.entity.js';
import { InvitationNotFoundException } from '../../domain/errors/invitations.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

@Injectable()
export class ManageInvitationLifecycleUseCase {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly repo: InvitationRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async findByIdOrCodeOrSlug(identifier: string): Promise<Invitation> {
    let found: Invitation | null = await this.repo.findById(identifier);
    found ??= await this.repo.findByCode(identifier);
    found ??= await this.repo.findBySlug(identifier);

    if (!found) throw new InvitationNotFoundException(identifier);
    return found;
  }

  async publish(id: string, actorId?: string): Promise<Invitation> {
    const invitation = await this.repo.findById(id);
    if (!invitation) throw new InvitationNotFoundException(id);

    invitation.publish(actorId);
    const saved = await this.repo.save(invitation);
    await this.eventPublisher.publishAll(invitation.domainEvents);
    invitation.clearDomainEvents();

    return saved;
  }

  async unpublish(id: string, actorId?: string): Promise<Invitation> {
    const invitation = await this.repo.findById(id);
    if (!invitation) throw new InvitationNotFoundException(id);

    invitation.unpublish(actorId);
    return this.repo.save(invitation);
  }

  async updateConfig(id: string, config: Record<string, unknown>, actorId?: string): Promise<Invitation> {
    const invitation = await this.repo.findById(id);
    if (!invitation) throw new InvitationNotFoundException(id);

    invitation.updateConfig(config, actorId);
    return this.repo.save(invitation);
  }

  async archive(id: string, actorId?: string): Promise<Invitation> {
    const invitation = await this.repo.findById(id);
    if (!invitation) throw new InvitationNotFoundException(id);

    invitation.softDelete(actorId);
    return this.repo.save(invitation);
  }

  async restore(id: string, actorId?: string): Promise<Invitation> {
    const invitation = await this.repo.findById(id);
    if (!invitation) throw new InvitationNotFoundException(id);

    invitation.restore(actorId);
    return this.repo.save(invitation);
  }
}
