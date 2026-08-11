import { StorageService } from './storage.service.js';
import type { StorageProviderPort } from '../domain/ports/storage-provider.port.js';
import { StoragePathGeneratorService } from '../domain/services/storage-path-generator.service.js';
import { StorageValidatorService } from '../domain/services/storage-validator.service.js';
import type { ConfigType } from '@nestjs/config';
import type { storageConfig } from '../../../config/storage.config.js';
import type { StoredFileObject } from '../domain/types/storage.types.js';

describe('StorageService', () => {
  let service: StorageService;
  let mockProvider: jest.Mocked<StorageProviderPort>;
  let pathGenerator: StoragePathGeneratorService;
  let validator: StorageValidatorService;

  const mockConfig: ConfigType<typeof storageConfig> = {
    provider: 'local',
    bucket: 'tecnojack',
    localRoot: 'storage/test',
    baseUrl: 'http://localhost:3000/uploads',
    maxFileSizeBytes: 10_000_000,
    allowedExtensions: ['png', 'jpg', 'pdf'],
  };

  const sampleStoredFile: StoredFileObject = {
    path: '2026/08/11/abcd-photo.png',
    filename: 'abcd-photo.png',
    mimeType: 'image/png',
    sizeBytes: 1024,
    url: 'http://localhost:3000/uploads/2026/08/11/abcd-photo.png',
    createdAt: new Date(),
  };

  beforeEach(() => {
    mockProvider = {
      upload: jest.fn().mockResolvedValue(sampleStoredFile),
      download: jest.fn().mockResolvedValue(Buffer.from('test')),
      delete: jest.fn().mockResolvedValue(undefined),
      exists: jest.fn().mockResolvedValue(true),
      move: jest.fn().mockResolvedValue(sampleStoredFile),
      copy: jest.fn().mockResolvedValue(sampleStoredFile),
      getMetadata: jest.fn().mockResolvedValue({
        path: '2026/08/11/abcd-photo.png',
        sizeBytes: 1024,
        mimeType: 'image/png',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      getUrl: jest.fn().mockResolvedValue('http://localhost:3000/uploads/2026/08/11/abcd-photo.png'),
    };

    pathGenerator = new StoragePathGeneratorService();
    validator = new StorageValidatorService();
    service = new StorageService(mockProvider, pathGenerator, validator, mockConfig);
  });

  it('should upload a file orchestrating validation and provider upload', async () => {
    const file = {
      buffer: Buffer.from('image content'),
      originalName: 'photo.png',
      size: 1024,
    };

    const result = await service.uploadFile(file, { subfolder: 'avatars' });
    expect(result.path).toBe('2026/08/11/abcd-photo.png');
    expect(mockProvider.upload.mock.calls.length).toBe(1);
  });

  it('should download a file by relative path', async () => {
    const buffer = await service.downloadFile('test.pdf');
    expect(buffer.toString()).toBe('test');
  });

  it('should check if a file exists', async () => {
    const exists = await service.fileExists('test.pdf');
    expect(exists).toBe(true);
  });
});
