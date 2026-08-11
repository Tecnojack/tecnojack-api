import { LocalStorageProvider } from './local-storage.provider.js';
import type { ConfigType } from '@nestjs/config';
import type { storageConfig } from '../../../../config/storage.config.js';
import {
  FileNotFoundStorageException,
  PathTraversalStorageException,
} from '../../domain/errors/storage.errors.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

describe('LocalStorageProvider', () => {
  let provider: LocalStorageProvider;
  const mockConfig: ConfigType<typeof storageConfig> = {
    provider: 'local',
    bucket: 'tecnojack',
    localRoot: 'storage/test-uploads',
    baseUrl: 'http://localhost:3000/uploads',
    maxFileSizeBytes: 10_000_000,
    allowedExtensions: ['png', 'jpg', 'pdf'],
  };

  const testDir = path.resolve(process.cwd(), 'storage/test-uploads');

  beforeEach(async () => {
    provider = new LocalStorageProvider(mockConfig);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  });

  it('should upload a file and return stored file object', async () => {
    const buffer = Buffer.from('Hello World Storage Test');
    const result = await provider.upload(buffer, 'test/file.txt', 'text/plain');

    expect(result.path).toBe('test/file.txt');
    expect(result.filename).toBe('file.txt');
    expect(result.sizeBytes).toBe(buffer.length);
    expect(result.url).toBe('http://localhost:3000/uploads/test/file.txt');

    const exists = await provider.exists('test/file.txt');
    expect(exists).toBe(true);
  });

  it('should download uploaded file buffer', async () => {
    const buffer = Buffer.from('Sample Data');
    await provider.upload(buffer, 'data.txt', 'text/plain');

    const downloaded = await provider.download('data.txt');
    expect(downloaded.toString()).toBe('Sample Data');
  });

  it('should throw FileNotFoundStorageException when downloading non-existing file', async () => {
    await expect(provider.download('non-existing.txt')).rejects.toThrow(
      FileNotFoundStorageException,
    );
  });

  it('should delete a file', async () => {
    const buffer = Buffer.from('Delete Me');
    await provider.upload(buffer, 'delete.txt', 'text/plain');

    await provider.delete('delete.txt');
    const exists = await provider.exists('delete.txt');
    expect(exists).toBe(false);
  });

  it('should throw PathTraversalStorageException when accessing outside root directory', async () => {
    await expect(provider.download('../../../etc/passwd')).rejects.toThrow(
      PathTraversalStorageException,
    );
  });

  it('should move file to new destination', async () => {
    const buffer = Buffer.from('Move Me');
    await provider.upload(buffer, 'source.txt', 'text/plain');

    const moved = await provider.move('source.txt', 'dest/moved.txt');
    expect(moved.path).toBe('dest/moved.txt');
    expect(await provider.exists('source.txt')).toBe(false);
    expect(await provider.exists('dest/moved.txt')).toBe(true);
  });

  it('should copy file to new destination', async () => {
    const buffer = Buffer.from('Copy Me');
    await provider.upload(buffer, 'source-copy.txt', 'text/plain');

    const copied = await provider.copy('source-copy.txt', 'dest/copied.txt');
    expect(copied.path).toBe('dest/copied.txt');
    expect(await provider.exists('source-copy.txt')).toBe(true);
    expect(await provider.exists('dest/copied.txt')).toBe(true);
  });
});
