import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { storageConfig } from '../../config/storage.config.js';
import { STORAGE_PROVIDER } from './domain/ports/storage-provider.port.js';
import { StoragePathGeneratorService } from './domain/services/storage-path-generator.service.js';
import { StorageValidatorService } from './domain/services/storage-validator.service.js';
import { LocalStorageProvider } from './infrastructure/providers/local-storage.provider.js';
import { StorageService } from './application/storage.service.js';
import { StorageFacade } from './public/storage.facade.js';

@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  providers: [
    StoragePathGeneratorService,
    StorageValidatorService,
    {
      provide: STORAGE_PROVIDER,
      useClass: LocalStorageProvider, // Configurable for S3, R2, Azure, MinIO via provider factory
    },
    StorageService,
    StorageFacade,
  ],
  exports: [StorageService, StorageFacade, STORAGE_PROVIDER],
})
export class StorageModule {}
