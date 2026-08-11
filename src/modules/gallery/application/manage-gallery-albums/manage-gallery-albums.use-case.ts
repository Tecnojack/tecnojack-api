import { Injectable, Inject } from '@nestjs/common';
import {
  GALLERY_REPOSITORY,
  type GalleryRepositoryPort,
} from '../ports/gallery.repository.port.js';
import type { Gallery } from '../../domain/entities/gallery.entity.js';
import { GalleryAlbum } from '../../domain/entities/gallery-album.entity.js';
import { GalleryNotFoundException } from '../../domain/errors/gallery.errors.js';

export interface CreateGalleryAlbumCommand {
  galleryId: string;
  name: string;
  description?: string;
  coverMediaAssetId?: string;
  sortOrder?: number;
  actorId?: string;
}

@Injectable()
export class ManageGalleryAlbumsUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: GalleryRepositoryPort,
  ) {}

  async createAlbum(command: CreateGalleryAlbumCommand): Promise<Gallery> {
    const gallery = await this.galleryRepo.findById(command.galleryId);
    if (!gallery) {
      throw new GalleryNotFoundException(command.galleryId);
    }

    const album = new GalleryAlbum({
      galleryId: gallery.id,
      name: command.name,
      description: command.description,
      coverMediaAssetId: command.coverMediaAssetId,
      sortOrder: command.sortOrder ?? gallery.albums.length,
    });

    gallery.addAlbum(album, command.actorId);

    return this.galleryRepo.save(gallery);
  }
}
