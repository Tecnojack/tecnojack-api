import { MediaAssetsController } from './media-assets.controller.js';
import type { RegisterMediaAssetUseCase } from '../../../application/register-media-asset/register-media-asset.use-case.js';
import type { GetMediaAssetUseCase } from '../../../application/get-media-asset/get-media-asset.use-case.js';
import type { UpdateMediaAssetUseCase } from '../../../application/update-media-asset/update-media-asset.use-case.js';
import type { ArchiveMediaAssetUseCase } from '../../../application/archive-media-asset/archive-media-asset.use-case.js';
import type { RestoreMediaAssetUseCase } from '../../../application/restore-media-asset/restore-media-asset.use-case.js';
import type { ListMediaAssetsUseCase } from '../../../application/list-media-assets/list-media-assets.use-case.js';
import { MediaAsset } from '../../../domain/entities/media-asset.entity.js';
import { MediaType } from '../../../domain/enums/media.enums.js';
import { MediaMetadata } from '../../../domain/value-objects/media-metadata.value-object.js';

describe('MediaAssetsController', () => {
  let controller: MediaAssetsController;
  let sampleAsset: MediaAsset;

  beforeEach(() => {
    sampleAsset = MediaAsset.create({
      code: 'MED-000001',
      type: MediaType.IMAGE,
      metadata: new MediaMetadata({
        originalName: 'test.jpg',
        normalizedName: 'test.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1024,
        path: '2026/08/11/test.jpg',
        url: 'http://localhost/uploads/2026/08/11/test.jpg',
      }),
    });

    const registerUseCase = {
      execute: jest.fn().mockResolvedValue(sampleAsset),
    } as unknown as RegisterMediaAssetUseCase;

    const getUseCase = {
      execute: jest.fn().mockResolvedValue(sampleAsset),
    } as unknown as GetMediaAssetUseCase;

    const updateUseCase = {
      execute: jest.fn().mockResolvedValue(sampleAsset),
    } as unknown as UpdateMediaAssetUseCase;

    const archiveUseCase = {
      execute: jest.fn().mockResolvedValue(sampleAsset),
    } as unknown as ArchiveMediaAssetUseCase;

    const restoreUseCase = {
      execute: jest.fn().mockResolvedValue(sampleAsset),
    } as unknown as RestoreMediaAssetUseCase;

    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleAsset],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListMediaAssetsUseCase;

    controller = new MediaAssetsController(
      registerUseCase,
      getUseCase,
      updateUseCase,
      archiveUseCase,
      restoreUseCase,
      listUseCase,
    );
  });

  it('should register media asset via controller endpoint', async () => {
    const res = await controller.register({
      originalName: 'test.jpg',
      storagePath: '2026/08/11/test.jpg',
    });

    expect(res.code).toBe('MED-000001');
    expect(res.originalName).toBe('test.jpg');
  });

  it('should find asset by identifier', async () => {
    const res = await controller.findOne('MED-000001');
    expect(res.code).toBe('MED-000001');
  });

  it('should list assets', async () => {
    const res = await controller.findAll({});
    expect(res.data.length).toBe(1);
    expect(res.total).toBe(1);
  });
});
