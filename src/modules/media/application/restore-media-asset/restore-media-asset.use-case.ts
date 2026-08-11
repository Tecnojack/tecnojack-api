import { Injectable, Inject } from '@nestjs/common';
import {
  MEDIA_ASSET_REPOSITORY,
  type MediaAssetRepositoryPort,
} from '../ports/media-asset.repository.port.js';
import type { MediaAsset } from '../../domain/entities/media-asset.entity.js';
import { MediaAssetNotFoundException } from '../../domain/errors/media.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface RestoreMediaAssetCommand {
  id: string;
  actorId?: string;
}

@Injectable()
export class RestoreMediaAssetUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: RestoreMediaAssetCommand): Promise<MediaAsset> {
    const asset = await this.repository.findById(command.id);
    if (!asset) {
      throw new MediaAssetNotFoundException(command.id);
    }

    asset.restore(command.actorId);

    const saved = await this.repository.save(asset);
    await this.eventPublisher.publishAll(asset.domainEvents);
    asset.clearDomainEvents();

    return saved;
  }
}
