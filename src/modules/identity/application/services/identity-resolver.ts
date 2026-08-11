import { Injectable, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import type { User } from '../../domain/entities/user.entity.js';

@Injectable()
export class IdentityResolver {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
  ) {}

  async resolveFromTokenPayload(payload: { sub: string }): Promise<User | null> {
    return this.repo.findUserById(payload.sub);
  }

  async resolveFromApiKey(rawApiKey: string): Promise<User | null> {
    const keyHash = createHash('sha256').update(rawApiKey).digest('hex');
    const apiKey = await this.repo.findAPIKeyByHash(keyHash);
    if (!apiKey || !apiKey.isActive || apiKey.isExpired()) {
      return null;
    }
    return this.repo.findUserById(apiKey.userId);
  }
}
