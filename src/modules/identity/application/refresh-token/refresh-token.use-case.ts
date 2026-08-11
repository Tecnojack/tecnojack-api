import { Injectable, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { AuthenticationService } from '../services/authentication.service.js';
import { SessionNotFoundException } from '../../domain/errors/identity.errors.js';
import type { AuthTokens } from '../login/login.use-case.js';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
    private readonly authService: AuthenticationService,
  ) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const session = await this.repo.findSessionByRefreshTokenHash(hash);
    if (!session || session.isRevoked || session.isExpired()) {
      throw new SessionNotFoundException('provided refresh token');
    }

    const user = await this.repo.findUserById(session.userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId ?? '',
      roles: [...user.roleIds],
    };

    const accessToken = this.authService.signToken(payload, 900);

    const newRawRefreshToken = crypto.randomUUID();
    const newHash = createHash('sha256').update(newRawRefreshToken).digest('hex');
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    session.rotate(newHash, newExpiresAt);
    await this.repo.saveSession(session);

    return {
      accessToken,
      refreshToken: newRawRefreshToken,
      expiresInSeconds: 900,
    };
  }
}
