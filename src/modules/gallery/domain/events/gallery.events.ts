import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { GalleryStatus } from '../enums/gallery.enums.js';

export interface GalleryCreatedPayload {
  galleryId: string;
  code: string;
  name: string;
  eventId: string;
  status: GalleryStatus;
  createdBy?: string | null;
}

export class GalleryCreatedEvent extends BaseDomainEvent<GalleryCreatedPayload> {
  constructor(payload: GalleryCreatedPayload) {
    super('gallery.created', payload.galleryId, payload);
  }
}

export interface GalleryPublishedPayload {
  galleryId: string;
  code: string;
  publishedAt: Date;
  publishedBy?: string | null;
}

export class GalleryPublishedEvent extends BaseDomainEvent<GalleryPublishedPayload> {
  constructor(payload: GalleryPublishedPayload) {
    super('gallery.published', payload.galleryId, payload);
  }
}

export interface GalleryUnpublishedPayload {
  galleryId: string;
  code: string;
  unpublishedBy?: string | null;
}

export class GalleryUnpublishedEvent extends BaseDomainEvent<GalleryUnpublishedPayload> {
  constructor(payload: GalleryUnpublishedPayload) {
    super('gallery.unpublished', payload.galleryId, payload);
  }
}

export interface GalleryAssetAddedPayload {
  galleryId: string;
  mediaAssetId: string;
  albumId?: string | null;
  addedBy?: string | null;
}

export class GalleryAssetAddedEvent extends BaseDomainEvent<GalleryAssetAddedPayload> {
  constructor(payload: GalleryAssetAddedPayload) {
    super('gallery.asset_added', payload.galleryId, payload);
  }
}

export interface GalleryAssetRemovedPayload {
  galleryId: string;
  mediaAssetId: string;
  removedBy?: string | null;
}

export class GalleryAssetRemovedEvent extends BaseDomainEvent<GalleryAssetRemovedPayload> {
  constructor(payload: GalleryAssetRemovedPayload) {
    super('gallery.asset_removed', payload.galleryId, payload);
  }
}

export interface GalleryArchivedPayload {
  galleryId: string;
  code: string;
  archivedAt: Date;
  archivedBy?: string | null;
}

export class GalleryArchivedEvent extends BaseDomainEvent<GalleryArchivedPayload> {
  constructor(payload: GalleryArchivedPayload) {
    super('gallery.archived', payload.galleryId, payload);
  }
}

export interface GalleryRestoredPayload {
  galleryId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class GalleryRestoredEvent extends BaseDomainEvent<GalleryRestoredPayload> {
  constructor(payload: GalleryRestoredPayload) {
    super('gallery.restored', payload.galleryId, payload);
  }
}
