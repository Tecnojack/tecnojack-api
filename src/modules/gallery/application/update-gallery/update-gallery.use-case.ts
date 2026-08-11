import { Injectable, Inject } from '@nestjs/common';
import {
  GALLERY_REPOSITORY,
  type GalleryRepositoryPort,
} from '../ports/gallery.repository.port.js';
import type { Gallery } from '../../domain/entities/gallery.entity.js';
import { GallerySettings, type GallerySettingsProps } from '../../domain/value-objects/gallery-settings.value-object.js';
import type { GalleryVisibility } from '../../domain/enums/gallery.enums.js';
import { GalleryNotFoundException } from '../../domain/errors/gallery.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface UpdateGalleryCommand {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  visibility?: GalleryVisibility;
  coverMediaAssetId?: string;
  settings?: GallerySettingsProps;
  actorId?: string;
}

@Injectable()
export class UpdateGalleryUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: GalleryRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: UpdateGalleryCommand): Promise<Gallery> {
    const gallery = await this.galleryRepo.findById(command.id);
    if (!gallery) {
      throw new GalleryNotFoundException(command.id);
    }

    const settings = command.settings
      ? new GallerySettings({ ...gallery.settings, ...command.settings })
      : undefined;

    gallery.updateDetails(
      {
        name: command.name,
        slug: command.slug,
        description: command.description,
        visibility: command.visibility,
        coverMediaAssetId: command.coverMediaAssetId,
        settings,
      },
      command.actorId,
    );

    const saved = await this.galleryRepo.save(gallery);
    await this.eventPublisher.publishAll(gallery.domainEvents);
    gallery.clearDomainEvents();

    return saved;
  }
}
