import type { Gallery } from '../../domain/entities/gallery.entity.js';
import type { GalleryStatus, GalleryVisibility } from '../../domain/enums/gallery.enums.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const GALLERY_REPOSITORY = Symbol('GALLERY_REPOSITORY');

export interface ListGalleriesFilter {
  page?: number;
  limit?: number;
  eventId?: string;
  status?: GalleryStatus;
  visibility?: GalleryVisibility;
  search?: string;
  includeDeleted?: boolean;
}

export interface GalleryRepositoryPort {
  save(gallery: Gallery): Promise<Gallery>;
  findById(id: string): Promise<Gallery | null>;
  findByCode(code: string): Promise<Gallery | null>;
  findAll(filter: ListGalleriesFilter): Promise<PaginatedResult<Gallery>>;
  nextCode(): Promise<string>;
}
