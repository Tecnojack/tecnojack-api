import { Injectable } from '@nestjs/common';
import { StorageService } from '../application/storage.service.js';
import type {
  StorageFile,
  UploadOptions,
  StoredFileObject,
  StorageFileMetadata,
} from '../domain/types/storage.types.js';

@Injectable()
export class StorageFacade {
  constructor(private readonly storageService: StorageService) {}

  uploadFile(file: StorageFile, options?: UploadOptions): Promise<StoredFileObject> {
    return this.storageService.uploadFile(file, options);
  }

  downloadFile(relativePath: string): Promise<Buffer> {
    return this.storageService.downloadFile(relativePath);
  }

  deleteFile(relativePath: string): Promise<void> {
    return this.storageService.deleteFile(relativePath);
  }

  fileExists(relativePath: string): Promise<boolean> {
    return this.storageService.fileExists(relativePath);
  }

  moveFile(sourcePath: string, destinationPath: string): Promise<StoredFileObject> {
    return this.storageService.moveFile(sourcePath, destinationPath);
  }

  copyFile(sourcePath: string, destinationPath: string): Promise<StoredFileObject> {
    return this.storageService.copyFile(sourcePath, destinationPath);
  }

  getFileMetadata(relativePath: string): Promise<StorageFileMetadata> {
    return this.storageService.getFileMetadata(relativePath);
  }

  getFileUrl(relativePath: string): Promise<string> {
    return this.storageService.getFileUrl(relativePath);
  }
}
