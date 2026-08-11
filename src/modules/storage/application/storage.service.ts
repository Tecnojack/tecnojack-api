import { Injectable, Inject } from '@nestjs/common';
import {
  STORAGE_PROVIDER,
  type StorageProviderPort,
} from '../domain/ports/storage-provider.port.js';
import { StoragePathGeneratorService } from '../domain/services/storage-path-generator.service.js';
import { StorageValidatorService } from '../domain/services/storage-validator.service.js';
import type {
  StorageFile,
  UploadOptions,
  StoredFileObject,
  StorageFileMetadata,
} from '../domain/types/storage.types.js';
import { storageConfig } from '../../../config/storage.config.js';

export interface StorageConfigValues {
  provider: string;
  bucket: string;
  localRoot: string;
  baseUrl: string;
  maxFileSizeBytes: number;
  allowedExtensions: string[];
}

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly provider: StorageProviderPort,
    private readonly pathGenerator: StoragePathGeneratorService,
    private readonly validator: StorageValidatorService,
    @Inject(storageConfig.KEY)
    private readonly config: StorageConfigValues,
  ) {}

  async uploadFile(
    file: StorageFile,
    options: UploadOptions = {},
  ): Promise<StoredFileObject> {
    const sizeBytes = file.size ?? file.buffer.length;
    const maxSizeBytes = options.maxSizeBytes ?? this.config.maxFileSizeBytes;
    this.validator.validateSize(sizeBytes, maxSizeBytes);

    const allowedExtensions = options.allowedExtensions ?? this.config.allowedExtensions;
    this.validator.validateExtension(file.originalName, allowedExtensions);

    const mimeType = this.validator.inferMimeType(file.originalName, file.mimeType);

    const filename = options.overrideFilename ?? file.originalName;
    const relativePath = options.preserveOriginalName
      ? `${options.subfolder ? `${options.subfolder.replace(/^\/+|\/+$/g, '')}/` : ''}${this.pathGenerator.normalizeFilename(filename)}`
      : this.pathGenerator.generatePath(filename, options.subfolder);

    return this.provider.upload(file.buffer, relativePath, mimeType);
  }

  async downloadFile(relativePath: string): Promise<Buffer> {
    return this.provider.download(relativePath);
  }

  async deleteFile(relativePath: string): Promise<void> {
    return this.provider.delete(relativePath);
  }

  async fileExists(relativePath: string): Promise<boolean> {
    return this.provider.exists(relativePath);
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<StoredFileObject> {
    return this.provider.move(sourcePath, destinationPath);
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<StoredFileObject> {
    return this.provider.copy(sourcePath, destinationPath);
  }

  async getFileMetadata(relativePath: string): Promise<StorageFileMetadata> {
    return this.provider.getMetadata(relativePath);
  }

  async getFileUrl(relativePath: string): Promise<string> {
    return this.provider.getUrl(relativePath);
  }
}
