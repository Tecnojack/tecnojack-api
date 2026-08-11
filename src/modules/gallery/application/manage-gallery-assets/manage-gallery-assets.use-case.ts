import { Injectable, Inject } from '@nestjs/common';
import {
  GALLERY_REPOSITORY,
  type GalleryRepositoryPort,
} from '../ports/gallery.repository.port.js';
import { MediaFacade } from '../../../media/public/media.facade.js';
import type { Gallery } from '../../domain/entities/gallery.entity.js';
import { GalleryAssetReference } from '../../domain/entities/gallery-asset-reference.entity.js';
import { GalleryNotFoundException } from '../../domain/errors/gallery.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface AddGalleryAssetCommand {
  galleryId: string;
  mediaAssetId: string;
  albumId?: string;
  title?: string;
  caption?: string;
  sortOrder?: number;
  actorId?: string;
}

@Injectable()
export class ManageGalleryAssetsUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: GalleryRepositoryPort,
    private readonly mediaFacade: MediaFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async addAsset(command: AddGalleryAssetCommand): Promise<Gallery> {
    const gallery = await this.galleryRepo.findById(command.galleryId);
    if (!gallery) {
      throw new GalleryNotFoundException(command.galleryId);
    }

    // Verify existence of MediaAsset via MediaFacade exclusively
    await this.mediaFacade.getAsset(command.mediaAssetId);

    const assetRef = new GalleryAssetReference({
      galleryId: gallery.id,
      albumId: command.albumId,
      mediaAssetId: command.mediaAssetId,
      title: command.title,
      caption: command.caption,
      sortOrder: command.sortOrder ?? gallery.assetReferences.length,
    });

    gallery.addAssetReference(assetRef, command.actorId);

    const saved = await this.galleryRepo.save(gallery);
    await this.eventPublisher.publishAll(gallery.domainEvents);
    gallery.clearDomainEvents();

    return saved;
  }

  async removeAsset(galleryId: string, mediaAssetId: string, actorId?: string): Promise<Gallery> {
    const gallery = await this.galleryRepo.findById(galleryId);
    if (!gallery) {
      throw new GalleryNotFoundException(galleryId);
    }

    gallery.removeAssetReference(mediaAssetId, actorId);

    const saved = await this.galleryRepo.save(gallery);
    await this.eventPublisher.publishAll(gallery.domainEvents);
    gallery.clearDomainEvents();

    return saved;
  }
}
