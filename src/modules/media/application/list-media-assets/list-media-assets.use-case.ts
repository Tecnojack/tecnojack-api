import { Injectable, Inject } from '@nestjs/common';
import {
  MEDIA_ASSET_REPOSITORY,
  type MediaAssetRepositoryPort,
  type ListMediaAssetsFilter,
} from '../ports/media-asset.repository.port.js';
import type { MediaAsset } from '../../domain/entities/media-asset.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ListMediaAssetsUseCase {
  constructor(
    @Inject(MEDIA_ASSET_REPOSITORY)
    private readonly repository: MediaAssetRepositoryPort,
  ) {}

  async execute(filter: ListMediaAssetsFilter): Promise<PaginatedResult<MediaAsset>> {
    return this.repository.findAll(filter);
  }
}
