import { Injectable, Inject } from '@nestjs/common';
import {
  GALLERY_REPOSITORY,
  type GalleryRepositoryPort,
} from '../ports/gallery.repository.port.js';
import type { Gallery } from '../../domain/entities/gallery.entity.js';
import { GalleryNotFoundException } from '../../domain/errors/gallery.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

@Injectable()
export class ManageGalleryStateUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: GalleryRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async publish(id: string, actorId?: string): Promise<Gallery> {
    const gallery = await this.getGallery(id);
    gallery.publish(actorId);
    return this.saveAndPublish(gallery);
  }

  async unpublish(id: string, actorId?: string): Promise<Gallery> {
    const gallery = await this.getGallery(id);
    gallery.unpublish(actorId);
    return this.saveAndPublish(gallery);
  }

  async archive(id: string, actorId?: string): Promise<Gallery> {
    const gallery = await this.getGallery(id);
    gallery.softDelete(actorId);
    return this.saveAndPublish(gallery);
  }

  async restore(id: string, actorId?: string): Promise<Gallery> {
    const gallery = await this.getGallery(id);
    gallery.restore(actorId);
    return this.saveAndPublish(gallery);
  }

  private async getGallery(id: string): Promise<Gallery> {
    const gallery = await this.galleryRepo.findById(id);
    if (!gallery) {
      throw new GalleryNotFoundException(id);
    }
    return gallery;
  }

  private async saveAndPublish(gallery: Gallery): Promise<Gallery> {
    const saved = await this.galleryRepo.save(gallery);
    await this.eventPublisher.publishAll(gallery.domainEvents);
    gallery.clearDomainEvents();
    return saved;
  }
}
