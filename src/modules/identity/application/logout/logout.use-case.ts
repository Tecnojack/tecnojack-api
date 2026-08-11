import { Injectable, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { SessionNotFoundException } from '../../domain/errors/identity.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';
import { SessionRevokedEvent } from '../../domain/events/identity.events.js';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const session = await this.repo.findSessionByRefreshTokenHash(hash);
    if (!session) {
      throw new SessionNotFoundException('provided refresh token');
    }

    session.revoke();
    await this.repo.saveSession(session);

    await this.eventPublisher.publish(
      new SessionRevokedEvent({
        sessionId: session.id,
        userId: session.userId,
      }),
    );
  }
}
