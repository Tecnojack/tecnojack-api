import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { DomainEvent } from '../../../../platform/domain/events/domain-event.interface.js';
export type { DomainEvent };
import type { MediaType, MediaStatus } from '../enums/media.enums.js';

export interface MediaAssetRegisteredPayload {
  mediaAssetId: string;
  code: string;
  type: MediaType;
  status: MediaStatus;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  createdBy?: string | null;
}

export class MediaAssetRegisteredEvent extends BaseDomainEvent<MediaAssetRegisteredPayload> {
  constructor(payload: MediaAssetRegisteredPayload) {
    super('media.asset.registered', payload.mediaAssetId, payload);
  }
}

export interface MediaAssetUpdatedPayload {
  mediaAssetId: string;
  code: string;
  updatedFields: string[];
  updatedBy?: string | null;
}

export class MediaAssetUpdatedEvent extends BaseDomainEvent<MediaAssetUpdatedPayload> {
  constructor(payload: MediaAssetUpdatedPayload) {
    super('media.asset.updated', payload.mediaAssetId, payload);
  }
}

export interface MediaAssetArchivedPayload {
  mediaAssetId: string;
  code: string;
  deletedAt: Date;
  deletedBy?: string | null;
}

export class MediaAssetArchivedEvent extends BaseDomainEvent<MediaAssetArchivedPayload> {
  constructor(payload: MediaAssetArchivedPayload) {
    super('media.asset.archived', payload.mediaAssetId, payload);
  }
}

export interface MediaAssetRestoredPayload {
  mediaAssetId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class MediaAssetRestoredEvent extends BaseDomainEvent<MediaAssetRestoredPayload> {
  constructor(payload: MediaAssetRestoredPayload) {
    super('media.asset.restored', payload.mediaAssetId, payload);
  }
}
