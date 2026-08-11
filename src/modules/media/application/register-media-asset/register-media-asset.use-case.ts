import { Injectable, Inject } from '@nestjs/common';
import {
  MEDIA_ASSET_REPOSITORY,
  type MediaAssetRepositoryPort,
} from '../ports/media-asset.repository.port.js';
import { StorageFacade } from '../../../storage/public/storage.facade.js';
import { MediaAsset } from '../../domain/entities/media-asset.entity.js';
import { MediaType } from '../../domain/enums/media.enums.js';
import { MediaMetadata } from '../../domain/value-objects/media-metadata.value-object.js';
import { MediaChecksum } from '../../domain/value-objects/media-checksum.value-object.js';
import { MediaDimensions } from '../../domain/value-objects/media-dimensions.value-object.js';
import { MediaDuration } from '../../domain/value-objects/media-duration.value-object.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface RegisterMediaAssetCommand {
  buffer?: Buffer;
  originalName: string;
  mimeType?: string;
  storagePath?: string;
  subfolder?: string;
  checksumHash?: string;
  checksumAlgo?: string;
  width?: number;
  height?: number;
  durationSec?: number;
  actorId?: string;
}

@Injectable()
export class RegisterMediaAssetUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,
    private readonly storageFacade: StorageFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: RegisterMediaAssetCommand): Promise<MediaAsset> {
    let path = command.storagePath;
    let url = '';
    let sizeBytes = 0;
    let mimeType = command.mimeType ?? 'application/octet-stream';

    if (command.buffer) {
      const stored = await this.storageFacade.uploadFile(
        {
          buffer: command.buffer,
          originalName: command.originalName,
          mimeType: command.mimeType,
        },
        { subfolder: command.subfolder ?? 'media' },
      );

      path = stored.path;
      url = stored.url;
      sizeBytes = stored.sizeBytes;
      mimeType = stored.mimeType;
    } else if (path) {
      url = await this.storageFacade.getFileUrl(path);
      const metadata = await this.storageFacade.getFileMetadata(path);
      sizeBytes = metadata.sizeBytes;
      mimeType = metadata.mimeType ?? mimeType;
    } else {
      throw new Error('Either file buffer or storagePath must be provided.');
    }

    if (!path) {
      throw new Error('Storage path could not be resolved.');
    }

    const type = this.determineMediaType(mimeType, command.originalName);
    const code = await this.repository.nextCode();

    const mediaMetadata = new MediaMetadata({
      originalName: command.originalName,
      normalizedName: command.originalName,
      mimeType,
      sizeBytes,
      path,
      url,
    });

    const checksum = command.checksumHash
      ? new MediaChecksum({ algorithm: command.checksumAlgo ?? 'sha256', hash: command.checksumHash })
      : null;

    const dimensions = command.width && command.height
      ? new MediaDimensions({ width: command.width, height: command.height })
      : null;

    const duration = command.durationSec !== undefined
      ? new MediaDuration({ seconds: command.durationSec })
      : null;

    const asset = MediaAsset.create(
      {
        code,
        type,
        metadata: mediaMetadata,
        checksum,
        dimensions,
        duration,
      },
      command.actorId,
    );

    const saved = await this.repository.save(asset);
    await this.eventPublisher.publishAll(asset.domainEvents);
    asset.clearDomainEvents();

    return saved;
  }

  private determineMediaType(mimeType: string, filename: string): MediaType {
    const mime = mimeType.toLowerCase();
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';

    if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return MediaType.IMAGE;
    }
    if (mime.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
      return MediaType.VIDEO;
    }
    if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) {
      return MediaType.AUDIO;
    }
    if (mime.startsWith('application/pdf') || ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) {
      return MediaType.DOCUMENT;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return MediaType.ARCHIVE;
    }
    return MediaType.OTHER;
  }
}
