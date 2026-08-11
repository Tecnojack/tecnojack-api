import { Injectable, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { APIKey } from '../../domain/entities/api-key.entity.js';
import { APIKeyNotFoundException } from '../../domain/errors/identity.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';
import { APIKeyIssuedEvent } from '../../domain/events/identity.events.js';

export interface CreateAPIKeyCommand {
  userId: string;
  name: string;
  scopes?: string[];
  expiresInDays?: number;
  tenantId?: string;
  actorId?: string;
}

export interface IssuedAPIKey {
  apiKeyRecord: APIKey;
  rawKey: string;
}

@Injectable()
export class ManageAPIKeysUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async createAPIKey(command: CreateAPIKeyCommand): Promise<IssuedAPIKey> {
    const rawKey = `tk_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    const code = await this.repo.nextAPIKeyCode();
    const days = command.expiresInDays ?? 365;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const apiKey = new APIKey({
      code,
      userId: command.userId,
      keyHash,
      name: command.name,
      scopes: command.scopes,
      expiresAt,
      tenantId: command.tenantId,
    });

    const saved = await this.repo.saveAPIKey(apiKey);
    await this.eventPublisher.publish(
      new APIKeyIssuedEvent({
        keyId: saved.id,
        userId: saved.userId,
      }),
    );

    return {
      apiKeyRecord: saved,
      rawKey,
    };
  }

  async rotateAPIKey(id: string, actorId?: string): Promise<IssuedAPIKey> {
    const apiKey = await this.repo.findAPIKeyById(id);
    if (!apiKey) throw new APIKeyNotFoundException(id);

    const rawKey = `tk_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    apiKey.rotate(keyHash, actorId);
    const saved = await this.repo.saveAPIKey(apiKey);

    return {
      apiKeyRecord: saved,
      rawKey,
    };
  }

  async revokeAPIKey(id: string, actorId?: string): Promise<APIKey> {
    const apiKey = await this.repo.findAPIKeyById(id);
    if (!apiKey) throw new APIKeyNotFoundException(id);

    apiKey.revoke(actorId);
    return this.repo.saveAPIKey(apiKey);
  }

  async listAPIKeys(userId: string): Promise<APIKey[]> {
    return this.repo.findAPIKeysByUserId(userId);
  }
}
