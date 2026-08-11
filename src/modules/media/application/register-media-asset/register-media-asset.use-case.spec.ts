import { RegisterMediaAssetUseCase } from './register-media-asset.use-case.js';
import type { MediaAssetRepositoryPort } from '../ports/media-asset.repository.port.js';
import type { StorageFacade } from '../../../storage/public/storage.facade.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { MediaAsset } from '../../domain/entities/media-asset.entity.js';
import { MediaType } from '../../domain/enums/media.enums.js';

describe('RegisterMediaAssetUseCase', () => {
  let useCase: RegisterMediaAssetUseCase;
  let mockRepo: jest.Mocked<MediaAssetRepositoryPort>;
  let mockStorageFacade: jest.Mocked<StorageFacade>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockImplementation((asset: MediaAsset) => Promise.resolve(asset)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByChecksum: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('MED-000001'),
    };

    mockStorageFacade = {
      uploadFile: jest.fn().mockResolvedValue({
        path: '2026/08/11/abcd-photo.jpg',
        filename: 'abcd-photo.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 10240,
        url: 'http://localhost:3000/uploads/2026/08/11/abcd-photo.jpg',
        createdAt: new Date(),
      }),
      downloadFile: jest.fn(),
      deleteFile: jest.fn(),
      fileExists: jest.fn(),
      moveFile: jest.fn(),
      copyFile: jest.fn(),
      getFileMetadata: jest.fn().mockResolvedValue({
        path: '2026/08/11/abcd-photo.jpg',
        sizeBytes: 10240,
        mimeType: 'image/jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      getFileUrl: jest.fn().mockResolvedValue('http://localhost:3000/uploads/2026/08/11/abcd-photo.jpg'),
    } as unknown as jest.Mocked<StorageFacade>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new RegisterMediaAssetUseCase(mockRepo, mockStorageFacade, mockEventPublisher);
  });

  it('should register a media asset using buffer input via StorageFacade', async () => {
    const asset = await useCase.execute({
      buffer: Buffer.from('dummy image content'),
      originalName: 'wedding-photo.jpg',
      mimeType: 'image/jpeg',
    });

    expect(asset.code).toBe('MED-000001');
    expect(asset.type).toBe(MediaType.IMAGE);
    expect(asset.metadata.originalName).toBe('wedding-photo.jpg');
    expect(mockStorageFacade.uploadFile.mock.calls.length).toBe(1);
    expect(mockRepo.save.mock.calls.length).toBe(1);
    expect(mockEventPublisher.publishAll.mock.calls.length).toBe(1);
  });

  it('should register a media asset using an existing storage path', async () => {
    const asset = await useCase.execute({
      storagePath: '2026/08/11/abcd-photo.jpg',
      originalName: 'photo.jpg',
    });

    expect(asset.code).toBe('MED-000001');
    expect(asset.metadata.path).toBe('2026/08/11/abcd-photo.jpg');
    expect(mockStorageFacade.getFileMetadata.mock.calls.length).toBe(1);
  });
});
