import { Injectable } from '@nestjs/common';
import { RegisterMediaAssetUseCase, type RegisterMediaAssetCommand } from '../application/register-media-asset/register-media-asset.use-case.js';
import { GetMediaAssetUseCase } from '../application/get-media-asset/get-media-asset.use-case.js';
import { UpdateMediaAssetUseCase, type UpdateMediaAssetCommand } from '../application/update-media-asset/update-media-asset.use-case.js';
import { ArchiveMediaAssetUseCase, type ArchiveMediaAssetCommand } from '../application/archive-media-asset/archive-media-asset.use-case.js';
import { RestoreMediaAssetUseCase, type RestoreMediaAssetCommand } from '../application/restore-media-asset/restore-media-asset.use-case.js';
import { ListMediaAssetsUseCase } from '../application/list-media-assets/list-media-assets.use-case.js';
import type { ListMediaAssetsFilter } from '../application/ports/media-asset.repository.port.js';
import type { MediaAsset } from '../domain/entities/media-asset.entity.js';
import type { PaginatedResult } from '../../../platform/domain/types/pagination.types.js';

@Injectable()
export class MediaFacade {
  constructor(
    private readonly registerMediaAssetUseCase: RegisterMediaAssetUseCase,
    private readonly getMediaAssetUseCase: GetMediaAssetUseCase,
    private readonly updateMediaAssetUseCase: UpdateMediaAssetUseCase,
    private readonly archiveMediaAssetUseCase: ArchiveMediaAssetUseCase,
    private readonly restoreMediaAssetUseCase: RestoreMediaAssetUseCase,
    private readonly listMediaAssetsUseCase: ListMediaAssetsUseCase,
  ) {}

  registerAsset(command: RegisterMediaAssetCommand): Promise<MediaAsset> {
    return this.registerMediaAssetUseCase.execute(command);
  }

  getAsset(identifier: string): Promise<MediaAsset> {
    return this.getMediaAssetUseCase.execute(identifier);
  }

  updateAsset(command: UpdateMediaAssetCommand): Promise<MediaAsset> {
    return this.updateMediaAssetUseCase.execute(command);
  }

  archiveAsset(command: ArchiveMediaAssetCommand): Promise<MediaAsset> {
    return this.archiveMediaAssetUseCase.execute(command);
  }

  restoreAsset(command: RestoreMediaAssetCommand): Promise<MediaAsset> {
    return this.restoreMediaAssetUseCase.execute(command);
  }

  listAssets(filter: ListMediaAssetsFilter): Promise<PaginatedResult<MediaAsset>> {
    return this.listMediaAssetsUseCase.execute(filter);
  }
}
