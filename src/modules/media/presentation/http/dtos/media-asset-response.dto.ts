import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType, MediaStatus } from '../../../domain/enums/media.enums.js';
import type { MediaAsset } from '../../../domain/entities/media-asset.entity.js';

export class MediaAssetResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty({ enum: MediaType })
  type!: MediaType;

  @ApiProperty({ enum: MediaStatus })
  status!: MediaStatus;

  @ApiProperty()
  originalName!: string;

  @ApiProperty()
  normalizedName!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  sizeBytes!: number;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  url!: string;

  @ApiPropertyOptional()
  checksumHash?: string | null;

  @ApiPropertyOptional()
  width?: number | null;

  @ApiPropertyOptional()
  height?: number | null;

  @ApiPropertyOptional()
  aspectRatio?: string | null;

  @ApiPropertyOptional()
  durationSec?: number | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional()
  createdBy?: string | null;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional()
  updatedBy?: string | null;

  @ApiPropertyOptional()
  deletedAt?: Date | null;

  static fromDomain(asset: MediaAsset): MediaAssetResponseDto {
    const dto = new MediaAssetResponseDto();
    dto.id = asset.id;
    dto.code = asset.code;
    dto.type = asset.type;
    dto.status = asset.status;
    dto.originalName = asset.metadata.originalName;
    dto.normalizedName = asset.metadata.normalizedName;
    dto.mimeType = asset.metadata.mimeType;
    dto.sizeBytes = asset.metadata.sizeBytes;
    dto.path = asset.metadata.path;
    dto.url = asset.metadata.url;
    dto.checksumHash = asset.checksum?.hash ?? null;
    dto.width = asset.dimensions?.width ?? null;
    dto.height = asset.dimensions?.height ?? null;
    dto.aspectRatio = asset.dimensions?.aspectRatio ?? null;
    dto.durationSec = asset.duration?.seconds ?? null;
    dto.createdAt = asset.audit.createdAt;
    dto.createdBy = asset.audit.createdBy;
    dto.updatedAt = asset.audit.updatedAt;
    dto.updatedBy = asset.audit.updatedBy;
    dto.deletedAt = asset.audit.deletedAt;
    return dto;
  }
}
