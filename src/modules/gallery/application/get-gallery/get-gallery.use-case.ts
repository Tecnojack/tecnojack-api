import { Injectable, Inject } from '@nestjs/common';
import {
  GALLERY_REPOSITORY,
  type GalleryRepositoryPort,
} from '../ports/gallery.repository.port.js';
import type { Gallery } from '../../domain/entities/gallery.entity.js';
import { GalleryNotFoundException } from '../../domain/errors/gallery.errors.js';

@Injectable()
export class GetGalleryUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: GalleryRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<Gallery> {
    const isCode = identifier.toUpperCase().startsWith('GAL-');
    const gallery = isCode
      ? await this.galleryRepo.findByCode(identifier)
      : await this.galleryRepo.findById(identifier);

    if (!gallery) {
      throw new GalleryNotFoundException(identifier);
    }

    return gallery;
  }
}
