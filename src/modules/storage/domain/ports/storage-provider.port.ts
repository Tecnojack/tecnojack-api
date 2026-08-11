import type {
  StoredFileObject,
  StorageFileMetadata,
} from '../types/storage.types.js';

export const STORAGE_PROVIDER = Symbol('STORAGE_PROVIDER');

export interface StorageProviderPort {
  upload(
    buffer: Buffer,
    relativePath: string,
    mimeType: string,
  ): Promise<StoredFileObject>;

  download(relativePath: string): Promise<Buffer>;

  delete(relativePath: string): Promise<void>;

  exists(relativePath: string): Promise<boolean>;

  move(sourcePath: string, destinationPath: string): Promise<StoredFileObject>;

  copy(sourcePath: string, destinationPath: string): Promise<StoredFileObject>;

  getMetadata(relativePath: string): Promise<StorageFileMetadata>;

  getUrl(relativePath: string): Promise<string>;
}
