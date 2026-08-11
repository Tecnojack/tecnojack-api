import { Injectable, Inject } from '@nestjs/common';
import {
  GALLERY_REPOSITORY,
  type GalleryRepositoryPort,
} from '../ports/gallery.repository.port.js';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { Gallery } from '../../domain/entities/gallery.entity.js';
import { GallerySettings, type GallerySettingsProps } from '../../domain/value-objects/gallery-settings.value-object.js';
import type { GalleryVisibility } from '../../domain/enums/gallery.enums.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface CreateGalleryCommand {
  name: string;
  slug?: string;
  description?: string;
  eventId: string;
  visibility?: GalleryVisibility;
  password?: string;
  coverMediaAssetId?: string;
  settings?: GallerySettingsProps;
  actorId?: string;
}

@Injectable()
export class CreateGalleryUseCase {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: GalleryRepositoryPort,
    private readonly eventsFacade: EventsFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: CreateGalleryCommand): Promise<Gallery> {
    await this.eventsFacade.getEvent(command.eventId);

    const code = await this.galleryRepo.nextCode();
    const settings = new GallerySettings({
      ...command.settings,
      password: command.password ?? command.settings?.password,
    });

    const gallery = Gallery.create(
      {
        code,
        name: command.name,
        slug: command.slug,
        description: command.description,
        eventId: command.eventId,
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
