import { Injectable, Inject } from '@nestjs/common';
import {
  MEDIA_ASSET_REPOSITORY,
  type MediaAssetRepositoryPort,
} from '../ports/media-asset.repository.port.js';
import type { MediaAsset } from '../../domain/entities/media-asset.entity.js';
import type { MediaStatus } from '../../domain/enums/media.enums.js';
import { MediaDimensions } from '../../domain/value-objects/media-dimensions.value-object.js';
import { MediaDuration } from '../../domain/value-objects/media-duration.value-object.js';
import { MediaChecksum } from '../../domain/value-objects/media-checksum.value-object.js';
import { MediaAssetNotFoundException } from '../../domain/errors/media.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface UpdateMediaAssetCommand {
  id: string;
  status?: MediaStatus;
  width?: number;
  height?: number;
  durationSec?: number;
  checksumHash?: string;
  checksumAlgo?: string;
  actorId?: string;
}

@Injectable()
export class UpdateMediaAssetUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: UpdateMediaAssetCommand): Promise<MediaAsset> {
    const asset = await this.repository.findById(command.id);
    if (!asset) {
      throw new MediaAssetNotFoundException(command.id);
    }

    if (command.status) {
      asset.changeStatus(command.status, command.actorId);
    }

    if (command.width && command.height) {
      asset.updateDimensions(new MediaDimensions({ width: command.width, height: command.height }), command.actorId);
    }

    if (command.durationSec !== undefined) {
      asset.updateDuration(new MediaDuration({ seconds: command.durationSec }), command.actorId);
    }

    if (command.checksumHash) {
      asset.updateChecksum(
        new MediaChecksum({ algorithm: command.checksumAlgo ?? 'sha256', hash: command.checksumHash }),
        command.actorId,
      );
    }

    const updated = await this.repository.save(asset);
    await this.eventPublisher.publishAll(asset.domainEvents);
    asset.clearDomainEvents();

    return updated;
  }
}
