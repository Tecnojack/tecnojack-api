import type { MediaAsset } from '../../domain/entities/media-asset.entity.js';
import type { MediaType, MediaStatus } from '../../domain/enums/media.enums.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const MEDIA_ASSET_REPOSITORY = Symbol('MEDIA_ASSET_REPOSITORY');

export interface ListMediaAssetsFilter {
  page?: number;
  limit?: number;
  type?: MediaType;
  status?: MediaStatus;
  search?: string;
  includeDeleted?: boolean;
}

export interface MediaAssetRepositoryPort {
  save(mediaAsset: MediaAsset): Promise<MediaAsset>;
  findById(id: string): Promise<MediaAsset | null>;
  findByCode(code: string): Promise<MediaAsset | null>;
  findByChecksum(hash: string): Promise<MediaAsset | null>;
  findAll(filter: ListMediaAssetsFilter): Promise<PaginatedResult<MediaAsset>>;
  nextCode(): Promise<string>;
}
