import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import type { Session } from '../../domain/entities/session.entity.js';
import { SessionNotFoundException } from '../../domain/errors/identity.errors.js';

@Injectable()
export class ManageSessionsUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
  ) {}

  async listSessions(userId: string): Promise<Session[]> {
    return this.repo.findSessionsByUserId(userId);
  }

  async revokeSession(id: string): Promise<void> {
    const session = await this.repo.findSessionById(id);
    if (!session) throw new SessionNotFoundException(id);

    session.revoke();
    await this.repo.saveSession(session);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    const sessions = await this.repo.findSessionsByUserId(userId);
    for (const session of sessions) {
      if (!session.isRevoked) {
        session.revoke();
        await this.repo.saveSession(session);
      }
    }
  }
}
