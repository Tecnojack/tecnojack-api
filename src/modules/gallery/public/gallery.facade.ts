import { Injectable } from '@nestjs/common';
import { CreateGalleryUseCase, type CreateGalleryCommand } from '../application/create-gallery/create-gallery.use-case.js';
import { GetGalleryUseCase } from '../application/get-gallery/get-gallery.use-case.js';
import { UpdateGalleryUseCase, type UpdateGalleryCommand } from '../application/update-gallery/update-gallery.use-case.js';
import { ManageGalleryStateUseCase } from '../application/manage-gallery-state/manage-gallery-state.use-case.js';
import { ManageGalleryAssetsUseCase, type AddGalleryAssetCommand } from '../application/manage-gallery-assets/manage-gallery-assets.use-case.js';
import { ListGalleriesUseCase } from '../application/list-galleries/list-galleries.use-case.js';
import type { ListGalleriesFilter } from '../application/ports/gallery.repository.port.js';
import type { Gallery } from '../domain/entities/gallery.entity.js';
import type { PaginatedResult } from '../../../platform/domain/types/pagination.types.js';

@Injectable()
export class GalleryFacade {
  constructor(
    private readonly createGalleryUseCase: CreateGalleryUseCase,
    private readonly getGalleryUseCase: GetGalleryUseCase,
    private readonly updateGalleryUseCase: UpdateGalleryUseCase,
    private readonly manageGalleryStateUseCase: ManageGalleryStateUseCase,
    private readonly manageGalleryAssetsUseCase: ManageGalleryAssetsUseCase,
    private readonly listGalleriesUseCase: ListGalleriesUseCase,
  ) {}

  createGallery(command: CreateGalleryCommand): Promise<Gallery> {
    return this.createGalleryUseCase.execute(command);
  }

  getGallery(identifier: string): Promise<Gallery> {
    return this.getGalleryUseCase.execute(identifier);
  }

  updateGallery(command: UpdateGalleryCommand): Promise<Gallery> {
    return this.updateGalleryUseCase.execute(command);
  }

  listGalleries(filter: ListGalleriesFilter): Promise<PaginatedResult<Gallery>> {
    return this.listGalleriesUseCase.execute(filter);
  }

  publishGallery(id: string, actorId?: string): Promise<Gallery> {
    return this.manageGalleryStateUseCase.publish(id, actorId);
  }

  addAssetToGallery(command: AddGalleryAssetCommand): Promise<Gallery> {
    return this.manageGalleryAssetsUseCase.addAsset(command);
  }
}
