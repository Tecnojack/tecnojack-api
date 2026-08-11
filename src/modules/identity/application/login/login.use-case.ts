import { Injectable, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { AuthenticationService } from '../services/authentication.service.js';
import { Session } from '../../domain/entities/session.entity.js';
import { InvalidCredentialsException } from '../../domain/errors/identity.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';
import { SessionStartedEvent } from '../../domain/events/identity.events.js';

export interface LoginCommand {
  email: string;
  passwordPlain: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
    private readonly authService: AuthenticationService,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: LoginCommand): Promise<AuthTokens> {
    const user = await this.repo.findUserByEmail(command.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    if (!user.passwordHash.verify(command.passwordPlain)) {
      throw new InvalidCredentialsException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId ?? '',
      roles: [...user.roleIds],
    };

    const accessToken = this.authService.signToken(payload, 900); // 15 mins

    // Refresh token generation
    const rawRefreshToken = crypto.randomUUID();
    const refreshTokenHash = createHash('sha256').update(rawRefreshToken).digest('hex');
    const code = await this.repo.nextSessionCode();

    const session = new Session({
      code,
      userId: user.id,
      refreshTokenHash,
      ipAddress: command.ipAddress,
      userAgent: command.userAgent,
      deviceType: command.deviceType,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      tenantId: user.tenantId,
    });

    await this.repo.saveSession(session);

    await this.eventPublisher.publish(
      new SessionStartedEvent({
        sessionId: session.id,
        userId: user.id,
        ipAddress: command.ipAddress,
      }),
    );

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresInSeconds: 900,
    };
  }
}
