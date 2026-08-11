import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module.js';
import { MEDIA_ASSET_REPOSITORY } from './application/ports/media-asset.repository.port.js';
import { PrismaMediaAssetRepository } from './infrastructure/persistence/prisma/repositories/prisma-media-asset.repository.js';
import { RegisterMediaAssetUseCase } from './application/register-media-asset/register-media-asset.use-case.js';
import { GetMediaAssetUseCase } from './application/get-media-asset/get-media-asset.use-case.js';
import { UpdateMediaAssetUseCase } from './application/update-media-asset/update-media-asset.use-case.js';
import { ArchiveMediaAssetUseCase } from './application/archive-media-asset/archive-media-asset.use-case.js';
import { RestoreMediaAssetUseCase } from './application/restore-media-asset/restore-media-asset.use-case.js';
import { ListMediaAssetsUseCase } from './application/list-media-assets/list-media-assets.use-case.js';
import { MediaAssetsController } from './presentation/http/controllers/media-assets.controller.js';
import { MediaFacade } from './public/media.facade.js';

@Module({
  imports: [StorageModule],
  controllers: [MediaAssetsController],
  providers: [
    {
      provide: MEDIA_ASSET_REPOSITORY,
      useClass: PrismaMediaAssetRepository,
    },
    RegisterMediaAssetUseCase,
    GetMediaAssetUseCase,
    UpdateMediaAssetUseCase,
    ArchiveMediaAssetUseCase,
    RestoreMediaAssetUseCase,
    ListMediaAssetsUseCase,
    MediaFacade,
  ],
  exports: [MediaFacade, MEDIA_ASSET_REPOSITORY],
})
export class MediaModule {}
