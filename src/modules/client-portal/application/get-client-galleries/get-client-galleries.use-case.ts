import { Injectable } from '@nestjs/common';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { GalleryFacade } from '../../../gallery/public/gallery.facade.js';
import type { ClientGallerySummaryModel } from '../../domain/models/client-dashboard.model.js';
import { GalleryStatus } from '../../../gallery/public/index.js';
import type { Gallery } from '../../../gallery/public/index.js';

@Injectable()
export class GetClientGalleriesUseCase {
  constructor(
    private readonly eventsFacade: EventsFacade,
    private readonly galleryFacade: GalleryFacade,
  ) {}

  async execute(eventIdentifier: string): Promise<ClientGallerySummaryModel[]> {
    const event = await this.eventsFacade.getEvent(eventIdentifier);
    const result = await this.galleryFacade.listGalleries({
      eventId: event.id,
      status: GalleryStatus.PUBLISHED,
    });

    return result.data.map((g: Gallery) => ({
      id: g.id,
      code: g.code,
      name: g.name,
      slug: g.slug,
      description: g.description,
      coverMediaAssetId: g.coverMediaAssetId,
      allowDownload: g.settings.allowDownload,
      allowFavorites: g.settings.allowFavorites,
      allowComments: g.settings.allowComments,
      publishedAt: g.publishedAt,
      albumCount: g.albums.length,
      assetCount: g.assetReferences.length,
    }));
  }
}
