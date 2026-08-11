import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import { MediaStatus, type MediaType } from '../enums/media.enums.js';
import type { MediaMetadata } from '../value-objects/media-metadata.value-object.js';
import type { MediaChecksum } from '../value-objects/media-checksum.value-object.js';
import type { MediaDimensions } from '../value-objects/media-dimensions.value-object.js';
import type { MediaDuration } from '../value-objects/media-duration.value-object.js';
import { MediaAssetAlreadyDeletedException } from '../errors/media.errors.js';
import {
  MediaAssetRegisteredEvent,
  MediaAssetUpdatedEvent,
  MediaAssetArchivedEvent,
  MediaAssetRestoredEvent,
} from '../events/media.events.js';

export interface MediaAssetProps {
  id?: string;
  code: string;
  type: MediaType;
  status?: MediaStatus;
  metadata: MediaMetadata;
  checksum?: MediaChecksum | null;
  dimensions?: MediaDimensions | null;
  duration?: MediaDuration | null;
  audit?: AuditInfo;
}

export class MediaAsset extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private readonly _type: MediaType;
  private _status: MediaStatus;
  private _metadata: MediaMetadata;
  private _checksum: MediaChecksum | null;
  private _dimensions: MediaDimensions | null;
  private _duration: MediaDuration | null;
  private _audit: AuditInfo;

  constructor(props: MediaAssetProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Media asset code cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._type = props.type;
    this._status = props.status ?? MediaStatus.READY;
    this._metadata = props.metadata;
    this._checksum = props.checksum ?? null;
    this._dimensions = props.dimensions ?? null;
    this._duration = props.duration ?? null;
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: MediaAssetProps, actorId?: string): MediaAsset {
    const asset = new MediaAsset({
      ...props,
      audit: AuditInfo.create(actorId),
    });

    asset.addDomainEvent(
      new MediaAssetRegisteredEvent({
        mediaAssetId: asset.id,
        code: asset.code,
        type: asset.type,
        status: asset.status,
        originalName: asset.metadata.originalName,
        mimeType: asset.metadata.mimeType,
        sizeBytes: asset.metadata.sizeBytes,
        url: asset.metadata.url,
        createdBy: actorId ?? null,
      }),
    );

    return asset;
  }

  get code(): string {
    return this._code;
  }

  get type(): MediaType {
    return this._type;
  }

  get status(): MediaStatus {
    return this._status;
  }

  get metadata(): MediaMetadata {
    return this._metadata;
  }

  get checksum(): MediaChecksum | null {
    return this._checksum;
  }

  get dimensions(): MediaDimensions | null {
    return this._dimensions;
  }

  get duration(): MediaDuration | null {
    return this._duration;
  }

  get audit(): AuditInfo {
    return this._audit;
  }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateMetadata(metadata: MediaMetadata, actorId?: string): void {
    this.ensureNotDeleted();
    this._metadata = metadata;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new MediaAssetUpdatedEvent({
        mediaAssetId: this.id,
        code: this._code,
        updatedFields: ['metadata'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  updateChecksum(checksum: MediaChecksum | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._checksum = checksum;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new MediaAssetUpdatedEvent({
        mediaAssetId: this.id,
        code: this._code,
        updatedFields: ['checksum'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  updateDimensions(dimensions: MediaDimensions | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._dimensions = dimensions;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new MediaAssetUpdatedEvent({
        mediaAssetId: this.id,
        code: this._code,
        updatedFields: ['dimensions'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  updateDuration(duration: MediaDuration | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._duration = duration;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new MediaAssetUpdatedEvent({
        mediaAssetId: this.id,
        code: this._code,
        updatedFields: ['duration'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  changeStatus(status: MediaStatus, actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === status) return;

    this._status = status;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new MediaAssetUpdatedEvent({
        mediaAssetId: this.id,
        code: this._code,
        updatedFields: ['status'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new MediaAssetAlreadyDeletedException(this.id);
    }

    this._audit = this._audit.softDelete(actorId);
    this._status = MediaStatus.ARCHIVED;

    this.addDomainEvent(
      new MediaAssetArchivedEvent({
        mediaAssetId: this.id,
        code: this._code,
        deletedAt: this._audit.deletedAt!,
        deletedBy: actorId ?? null,
      }),
    );
  }

  restore(actorId?: string): void {
    if (!this._audit.isDeleted()) return;

    this._audit = this._audit.restore(actorId);
    this._status = MediaStatus.READY;

    this.addDomainEvent(
      new MediaAssetRestoredEvent({
        mediaAssetId: this.id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new MediaAssetAlreadyDeletedException(this.id);
    }
  }
}
