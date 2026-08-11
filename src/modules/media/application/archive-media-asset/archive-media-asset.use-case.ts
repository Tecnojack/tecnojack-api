import { Injectable, Inject } from '@nestjs/common';
import {
  MEDIA_ASSET_REPOSITORY,
  type MediaAssetRepositoryPort,
} from '../ports/media-asset.repository.port.js';
import { StorageFacade } from '../../../storage/public/storage.facade.js';
import type { MediaAsset } from '../../domain/entities/media-asset.entity.js';
import { MediaAssetNotFoundException } from '../../domain/errors/media.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface ArchiveMediaAssetCommand {
  id: string;
  deletePhysicalFile?: boolean;
  actorId?: string;
}

@Injectable()
export class ArchiveMediaAssetUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,
    private readonly storageFacade: StorageFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: ArchiveMediaAssetCommand): Promise<MediaAsset> {
    const asset = await this.repository.findById(command.id);
    if (!asset) {
      throw new MediaAssetNotFoundException(command.id);
    }

    asset.softDelete(command.actorId);

    if (command.deletePhysicalFile && asset.metadata.path) {
      try {
        await this.storageFacade.deleteFile(asset.metadata.path);
      } catch {
        // Continue soft delete even if physical file is already removed
      }
    }

    const saved = await this.repository.save(asset);
    await this.eventPublisher.publishAll(asset.domainEvents);
    asset.clearDomainEvents();

    return saved;
  }
}
