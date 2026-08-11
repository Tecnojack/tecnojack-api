import { Injectable, Inject } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { StorageProviderPort } from '../../domain/ports/storage-provider.port.js';
import type {
  StoredFileObject,
  StorageFileMetadata,
} from '../../domain/types/storage.types.js';
import {
  FileNotFoundStorageException,
  PathTraversalStorageException,
  StorageOperationFailedException,
} from '../../domain/errors/storage.errors.js';
import { storageConfig } from '../../../../config/storage.config.js';
import type { StorageConfigValues } from '../../application/storage.service.js';

@Injectable()
export class LocalStorageProvider implements StorageProviderPort {
  private readonly rootDir: string;
  private readonly baseUrl: string;

  constructor(
    @Inject(storageConfig.KEY)
    private readonly config: StorageConfigValues,
  ) {
    this.rootDir = path.resolve(process.cwd(), this.config.localRoot);
    this.baseUrl = this.config.baseUrl.replace(/\/+$/, '');
  }

  private getAbsolutePath(relativePath: string): string {
    const cleanRelative = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const absolute = path.resolve(this.rootDir, cleanRelative);

    if (!absolute.startsWith(this.rootDir)) {
      throw new PathTraversalStorageException(relativePath);
    }

    return absolute;
  }

  async upload(
    buffer: Buffer,
    relativePath: string,
    mimeType: string,
  ): Promise<StoredFileObject> {
    try {
      const absolutePath = this.getAbsolutePath(relativePath);
      const directory = path.dirname(absolutePath);

      await fs.mkdir(directory, { recursive: true });
      await fs.writeFile(absolutePath, buffer);

      const filename = path.basename(relativePath);
      const url = await this.getUrl(relativePath);

      return {
        path: relativePath,
        filename,
        mimeType,
        sizeBytes: buffer.length,
        url,
        createdAt: new Date(),
      };
    } catch (err) {
      if (err instanceof PathTraversalStorageException) throw err;
      throw new StorageOperationFailedException('upload', (err as Error).message);
    }
  }

  async download(relativePath: string): Promise<Buffer> {
    const absolutePath = this.getAbsolutePath(relativePath);
    try {
      return await fs.readFile(absolutePath);
    } catch {
      throw new FileNotFoundStorageException(relativePath);
    }
  }

  async delete(relativePath: string): Promise<void> {
    const absolutePath = this.getAbsolutePath(relativePath);
    try {
      await fs.unlink(absolutePath);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new FileNotFoundStorageException(relativePath);
      }
      throw new StorageOperationFailedException('delete', (err as Error).message);
    }
  }

  async exists(relativePath: string): Promise<boolean> {
    const absolutePath = this.getAbsolutePath(relativePath);
    try {
      await fs.access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }

  async move(sourcePath: string, destinationPath: string): Promise<StoredFileObject> {
    const absSource = this.getAbsolutePath(sourcePath);
    const absDest = this.getAbsolutePath(destinationPath);

    try {
      await fs.mkdir(path.dirname(absDest), { recursive: true });
      await fs.rename(absSource, absDest);

      const metadata = await this.getMetadata(destinationPath);
      const filename = path.basename(destinationPath);
      const url = await this.getUrl(destinationPath);

      return {
        path: destinationPath,
        filename,
        mimeType: metadata.mimeType,
        sizeBytes: metadata.sizeBytes,
        url,
        createdAt: metadata.createdAt,
      };
    } catch (err) {
      if (err instanceof PathTraversalStorageException) throw err;
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new FileNotFoundStorageException(sourcePath);
      }
      throw new StorageOperationFailedException('move', (err as Error).message);
    }
  }

  async copy(sourcePath: string, destinationPath: string): Promise<StoredFileObject> {
    const absSource = this.getAbsolutePath(sourcePath);
    const absDest = this.getAbsolutePath(destinationPath);

    try {
      await fs.mkdir(path.dirname(absDest), { recursive: true });
      await fs.copyFile(absSource, absDest);

      const metadata = await this.getMetadata(destinationPath);
      const filename = path.basename(destinationPath);
      const url = await this.getUrl(destinationPath);

      return {
        path: destinationPath,
        filename,
        mimeType: metadata.mimeType,
        sizeBytes: metadata.sizeBytes,
        url,
        createdAt: metadata.createdAt,
      };
    } catch (err) {
      if (err instanceof PathTraversalStorageException) throw err;
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new FileNotFoundStorageException(sourcePath);
      }
      throw new StorageOperationFailedException('copy', (err as Error).message);
    }
  }

  async getMetadata(relativePath: string): Promise<StorageFileMetadata> {
    const absolutePath = this.getAbsolutePath(relativePath);
    try {
      const stats = await fs.stat(absolutePath);
      const ext = path.extname(relativePath).toLowerCase().replace('.', '');
      const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';

      return {
        path: relativePath,
        sizeBytes: stats.size,
        mimeType,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
      };
    } catch {
      throw new FileNotFoundStorageException(relativePath);
    }
  }

  async getUrl(relativePath: string): Promise<string> {
    const cleanRelative = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
    return Promise.resolve(`${this.baseUrl}/${cleanRelative}`);
  }
}
