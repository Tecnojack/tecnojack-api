import type { MediaAssetModel as PrismaMediaAsset } from '../../../../../../generated/prisma/models/MediaAsset.js';
import type {
  MediaType as PrismaMediaType,
  MediaStatus as PrismaMediaStatus,
} from '../../../../../../generated/prisma/enums.js';
import type { MediaAsset } from '../../../../domain/entities/media-asset.entity.js';
import { MediaAsset as MediaAssetEntity } from '../../../../domain/entities/media-asset.entity.js';
import type { MediaType, MediaStatus } from '../../../../domain/enums/media.enums.js';
import { MediaMetadata } from '../../../../domain/value-objects/media-metadata.value-object.js';
import { MediaChecksum } from '../../../../domain/value-objects/media-checksum.value-object.js';
import { MediaDimensions } from '../../../../domain/value-objects/media-dimensions.value-object.js';
import { MediaDuration } from '../../../../domain/value-objects/media-duration.value-object.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';

export interface PersistenceMediaAssetData {
  id: string;
  code: string;
  type: PrismaMediaType;
  status: PrismaMediaStatus;
  originalName: string;
  normalizedName: string;
  mimeType: string;
  sizeBytes: bigint;
  path: string;
  url: string;
  checksumAlgo?: string | null;
  checksumHash?: string | null;
  width?: number | null;
  height?: number | null;
  aspectRatio?: string | null;
  durationSec?: number | null;
  createdAt: Date;
  createdBy?: string | null;
  updatedAt: Date;
  updatedBy?: string | null;
  deletedAt?: Date | null;
  deletedBy?: string | null;
}

export class MediaAssetMapper {
  static toDomain(raw: PrismaMediaAsset): MediaAsset {
    const metadata = new MediaMetadata({
      originalName: raw.originalName,
      normalizedName: raw.normalizedName,
      mimeType: raw.mimeType,
      sizeBytes: Number(raw.sizeBytes),
      path: raw.path,
      url: raw.url,
    });

    const checksum = raw.checksumHash
      ? new MediaChecksum({ algorithm: raw.checksumAlgo ?? 'sha256', hash: raw.checksumHash })
      : null;

    const dimensions = raw.width && raw.height
      ? new MediaDimensions({ width: raw.width, height: raw.height, aspectRatio: raw.aspectRatio ?? undefined })
      : null;

    const duration = raw.durationSec !== null && raw.durationSec !== undefined
      ? new MediaDuration({ seconds: raw.durationSec })
      : null;

    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });

    return new MediaAssetEntity({
      id: raw.id,
      code: raw.code,
      type: raw.type as unknown as MediaType,
      status: raw.status as unknown as MediaStatus,
      metadata,
      checksum,
      dimensions,
      duration,
      audit,
    });
  }

  static toPersistence(asset: MediaAsset): PersistenceMediaAssetData {
    return {
      id: asset.id,
      code: asset.code,
      type: asset.type as unknown as PrismaMediaType,
      status: asset.status as unknown as PrismaMediaStatus,
      originalName: asset.metadata.originalName,
      normalizedName: asset.metadata.normalizedName,
      mimeType: asset.metadata.mimeType,
      sizeBytes: BigInt(asset.metadata.sizeBytes),
      path: asset.metadata.path,
      url: asset.metadata.url,
      checksumAlgo: asset.checksum?.algorithm ?? null,
      checksumHash: asset.checksum?.hash ?? null,
      width: asset.dimensions?.width ?? null,
      height: asset.dimensions?.height ?? null,
      aspectRatio: asset.dimensions?.aspectRatio ?? null,
      durationSec: asset.duration?.seconds ?? null,
      createdAt: asset.audit.createdAt,
      createdBy: asset.audit.createdBy,
      updatedAt: asset.audit.updatedAt,
      updatedBy: asset.audit.updatedBy,
      deletedAt: asset.audit.deletedAt,
      deletedBy: asset.audit.deletedBy,
    };
  }
}
