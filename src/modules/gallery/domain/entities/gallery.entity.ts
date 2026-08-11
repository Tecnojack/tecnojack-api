import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import { GalleryStatus, GalleryVisibility } from '../enums/gallery.enums.js';
import { GallerySettings } from '../value-objects/gallery-settings.value-object.js';
import type { GalleryAlbum } from './gallery-album.entity.js';
import type { GalleryAssetReference } from './gallery-asset-reference.entity.js';
import {
  GalleryAlreadyDeletedException,
  GalleryAssetAlreadyExistsException,
  InvalidGalleryStatusTransitionException,
} from '../errors/gallery.errors.js';
import {
  GalleryCreatedEvent,
  GalleryPublishedEvent,
  GalleryUnpublishedEvent,
  GalleryAssetAddedEvent,
  GalleryAssetRemovedEvent,
  GalleryArchivedEvent,
  GalleryRestoredEvent,
} from '../events/gallery.events.js';

export interface GalleryProps {
  id?: string;
  code: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  eventId: string;
  status?: GalleryStatus;
  visibility?: GalleryVisibility;
  password?: string | null;
  coverMediaAssetId?: string | null;
  settings?: GallerySettings;
  publishedAt?: Date | null;
  archivedAt?: Date | null;
  albums?: GalleryAlbum[];
  assetReferences?: GalleryAssetReference[];
  audit?: AuditInfo;
}

export class Gallery extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _name: string;
  private _slug: string | null;
  private _description: string | null;
  private readonly _eventId: string;
  private _status: GalleryStatus;
  private _visibility: GalleryVisibility;
  private _coverMediaAssetId: string | null;
  private _settings: GallerySettings;
  private _publishedAt: Date | null;
  private _archivedAt: Date | null;
  private _albums: GalleryAlbum[];
  private _assetReferences: GalleryAssetReference[];
  private _audit: AuditInfo;

  constructor(props: GalleryProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Gallery code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Gallery name cannot be empty.');
    }
    if (!props.eventId || props.eventId.trim().length === 0) {
      throw new Error('Gallery eventId cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._name = props.name.trim();
    this._slug = props.slug?.trim() ?? null;
    this._description = props.description?.trim() ?? null;
    this._eventId = props.eventId;
    this._status = props.status ?? GalleryStatus.DRAFT;
    this._visibility = props.visibility ?? GalleryVisibility.PRIVATE;
    this._coverMediaAssetId = props.coverMediaAssetId ?? null;
    this._settings = props.settings ?? new GallerySettings({ password: props.password });
    this._publishedAt = props.publishedAt ?? null;
    this._archivedAt = props.archivedAt ?? null;
    this._albums = props.albums ? [...props.albums] : [];
    this._assetReferences = props.assetReferences ? [...props.assetReferences] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: GalleryProps, actorId?: string): Gallery {
    const gallery = new Gallery({
      ...props,
      audit: AuditInfo.create(actorId),
    });

    gallery.addDomainEvent(
      new GalleryCreatedEvent({
        galleryId: gallery.id,
        code: gallery.code,
        name: gallery.name,
        eventId: gallery.eventId,
        status: gallery.status,
        createdBy: actorId ?? null,
      }),
    );

    return gallery;
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get slug(): string | null { return this._slug; }
  get description(): string | null { return this._description; }
  get eventId(): string { return this._eventId; }
  get status(): GalleryStatus { return this._status; }
  get visibility(): GalleryVisibility { return this._visibility; }
  get coverMediaAssetId(): string | null { return this._coverMediaAssetId; }
  get settings(): GallerySettings { return this._settings; }
  get publishedAt(): Date | null { return this._publishedAt; }
  get archivedAt(): Date | null { return this._archivedAt; }
  get albums(): readonly GalleryAlbum[] { return this._albums; }
  get assetReferences(): readonly GalleryAssetReference[] { return this._assetReferences; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(
    props: Partial<Pick<GalleryProps, 'name' | 'slug' | 'description' | 'visibility' | 'coverMediaAssetId' | 'settings'>>,
    actorId?: string,
  ): void {
    this.ensureNotDeleted();
    if (props.name) this._name = props.name.trim();
    if (props.slug !== undefined) this._slug = props.slug?.trim() ?? null;
    if (props.description !== undefined) this._description = props.description?.trim() ?? null;
    if (props.visibility) this._visibility = props.visibility;
    if (props.coverMediaAssetId !== undefined) this._coverMediaAssetId = props.coverMediaAssetId;
    if (props.settings) this._settings = props.settings;

    this._audit = this._audit.touch(actorId);
  }

  publish(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === GalleryStatus.PUBLISHED) return;

    this._status = GalleryStatus.PUBLISHED;
    this._publishedAt = new Date();
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new GalleryPublishedEvent({
        galleryId: this.id,
        code: this._code,
        publishedAt: this._publishedAt,
        publishedBy: actorId ?? null,
      }),
    );
  }

  unpublish(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status !== GalleryStatus.PUBLISHED) {
      throw new InvalidGalleryStatusTransitionException(this._status, GalleryStatus.UNPUBLISHED);
    }

    this._status = GalleryStatus.UNPUBLISHED;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new GalleryUnpublishedEvent({
        galleryId: this.id,
        code: this._code,
        unpublishedBy: actorId ?? null,
      }),
    );
  }

  addAlbum(album: GalleryAlbum, actorId?: string): void {
    this.ensureNotDeleted();
    this._albums.push(album);
    this._audit = this._audit.touch(actorId);
  }

  addAssetReference(assetRef: GalleryAssetReference, actorId?: string): void {
    this.ensureNotDeleted();
    const exists = this._assetReferences.some((r) => r.mediaAssetId === assetRef.mediaAssetId);
    if (exists) {
      throw new GalleryAssetAlreadyExistsException(this.id, assetRef.mediaAssetId);
    }

    this._assetReferences.push(assetRef);
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new GalleryAssetAddedEvent({
        galleryId: this.id,
        mediaAssetId: assetRef.mediaAssetId,
        albumId: assetRef.albumId,
        addedBy: actorId ?? null,
      }),
    );
  }

  removeAssetReference(mediaAssetId: string, actorId?: string): void {
    this.ensureNotDeleted();
    const initialCount = this._assetReferences.length;
    this._assetReferences = this._assetReferences.filter((r) => r.mediaAssetId !== mediaAssetId);

    if (this._assetReferences.length < initialCount) {
      this._audit = this._audit.touch(actorId);
      this.addDomainEvent(
        new GalleryAssetRemovedEvent({
          galleryId: this.id,
          mediaAssetId,
          removedBy: actorId ?? null,
        }),
      );
    }
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new GalleryAlreadyDeletedException(this.id);
    }

    this._audit = this._audit.softDelete(actorId);
    this._status = GalleryStatus.ARCHIVED;
    this._archivedAt = this._audit.deletedAt;

    this.addDomainEvent(
      new GalleryArchivedEvent({
        galleryId: this.id,
        code: this._code,
        archivedAt: this._audit.deletedAt!,
        archivedBy: actorId ?? null,
      }),
    );
  }

  restore(actorId?: string): void {
    if (!this._audit.isDeleted()) return;

    this._audit = this._audit.restore(actorId);
    this._status = GalleryStatus.DRAFT;
    this._archivedAt = null;

    this.addDomainEvent(
      new GalleryRestoredEvent({
        galleryId: this.id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new GalleryAlreadyDeletedException(this.id);
    }
  }
}
