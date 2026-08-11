import { Injectable, Inject } from '@nestjs/common';
import {
  MEDIA_ASSET_REPOSITORY,
  type MediaAssetRepositoryPort,
} from '../ports/media-asset.repository.port.js';
import type { MediaAsset } from '../../domain/entities/media-asset.entity.js';
import { MediaAssetNotFoundException } from '../../domain/errors/media.errors.js';

@Injectable()
export class GetMediaAssetUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<MediaAsset> {
    const isCode = identifier.toUpperCase().startsWith('MED-');
    const asset = isCode
      ? await this.repository.findByCode(identifier)
      : await this.repository.findById(identifier);

    if (!asset) {
      throw new MediaAssetNotFoundException(identifier);
    }

    return asset;
  }
}
