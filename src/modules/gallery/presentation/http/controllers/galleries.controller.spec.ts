import { GalleriesController } from './galleries.controller.js';
import type { CreateGalleryUseCase } from '../../../application/create-gallery/create-gallery.use-case.js';
import type { GetGalleryUseCase } from '../../../application/get-gallery/get-gallery.use-case.js';
import type { UpdateGalleryUseCase } from '../../../application/update-gallery/update-gallery.use-case.js';
import type { ManageGalleryStateUseCase } from '../../../application/manage-gallery-state/manage-gallery-state.use-case.js';
import type { ManageGalleryAssetsUseCase } from '../../../application/manage-gallery-assets/manage-gallery-assets.use-case.js';
import type { ManageGalleryAlbumsUseCase } from '../../../application/manage-gallery-albums/manage-gallery-albums.use-case.js';
import type { ListGalleriesUseCase } from '../../../application/list-galleries/list-galleries.use-case.js';
import { Gallery } from '../../../domain/entities/gallery.entity.js';

describe('GalleriesController', () => {
  let controller: GalleriesController;
  let sampleGallery: Gallery;

  beforeEach(() => {
    sampleGallery = Gallery.create({
      code: 'GAL-000001',
      name: 'Fotos Oficiales Boda',
      eventId: crypto.randomUUID(),
    });

    const createUseCase = {
      execute: jest.fn().mockResolvedValue(sampleGallery),
    } as unknown as CreateGalleryUseCase;

    const getUseCase = {
      execute: jest.fn().mockResolvedValue(sampleGallery),
    } as unknown as GetGalleryUseCase;

    const updateUseCase = {
      execute: jest.fn().mockResolvedValue(sampleGallery),
    } as unknown as UpdateGalleryUseCase;

    const stateUseCase = {
      publish: jest.fn().mockResolvedValue(sampleGallery),
      unpublish: jest.fn().mockResolvedValue(sampleGallery),
      archive: jest.fn().mockResolvedValue(sampleGallery),
      restore: jest.fn().mockResolvedValue(sampleGallery),
    } as unknown as ManageGalleryStateUseCase;

    const assetUseCase = {
      addAsset: jest.fn().mockResolvedValue(sampleGallery),
      removeAsset: jest.fn().mockResolvedValue(sampleGallery),
    } as unknown as ManageGalleryAssetsUseCase;

    const albumUseCase = {
      createAlbum: jest.fn().mockResolvedValue(sampleGallery),
    } as unknown as ManageGalleryAlbumsUseCase;

    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleGallery],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListGalleriesUseCase;

    controller = new GalleriesController(
      createUseCase,
      getUseCase,
      updateUseCase,
      stateUseCase,
      assetUseCase,
      albumUseCase,
      listUseCase,
    );
  });

  it('should create gallery via controller', async () => {
    const res = await controller.create({
      name: 'Fotos Oficiales Boda',
      eventId: crypto.randomUUID(),
    });
    expect(res.code).toBe('GAL-000001');
  });

  it('should get gallery by identifier', async () => {
    const res = await controller.findOne('GAL-000001');
    expect(res.code).toBe('GAL-000001');
  });

  it('should list galleries', async () => {
    const res = await controller.findAll({});
    expect(res.data.length).toBe(1);
    expect(res.total).toBe(1);
  });
});
