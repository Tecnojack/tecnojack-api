import { Injectable } from '@nestjs/common';
import { IdentityResolver } from '../application/services/identity-resolver.js';
import { AuthorizationService } from '../application/services/authorization.service.js';
import type { User } from '../domain/entities/user.entity.js';

@Injectable()
export class IdentityFacade {
  constructor(
    private readonly identityResolver: IdentityResolver,
    private readonly authzService: AuthorizationService,
  ) {}

  resolveFromTokenPayload(payload: { sub: string }): Promise<User | null> {
    return this.identityResolver.resolveFromTokenPayload(payload);
  }

  resolveFromApiKey(rawApiKey: string): Promise<User | null> {
    return this.identityResolver.resolveFromApiKey(rawApiKey);
  }

  isAuthorized(
    user: User,
    resource: string,
    action: string,
    resourceAttributes: Record<string, string> = {},
  ): Promise<boolean> {
    return this.authzService.isAuthorized(user, resource, action, resourceAttributes);
  }
}
