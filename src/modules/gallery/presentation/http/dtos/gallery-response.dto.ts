import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GalleryStatus, GalleryVisibility } from '../../../domain/enums/gallery.enums.js';
import type { Gallery } from '../../../domain/entities/gallery.entity.js';

export class GalleryAlbumResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() galleryId!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiPropertyOptional() coverMediaAssetId?: string | null;
  @ApiProperty() sortOrder!: number;
}

export class GalleryAssetReferenceResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() galleryId!: string;
  @ApiPropertyOptional() albumId?: string | null;
  @ApiProperty() mediaAssetId!: string;
  @ApiPropertyOptional() title?: string | null;
  @ApiPropertyOptional() caption?: string | null;
  @ApiProperty() sortOrder!: number;
}

export class GalleryResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() slug?: string | null;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() eventId!: string;
  @ApiProperty({ enum: GalleryStatus }) status!: GalleryStatus;
  @ApiProperty({ enum: GalleryVisibility }) visibility!: GalleryVisibility;
  @ApiPropertyOptional() coverMediaAssetId?: string | null;
  @ApiProperty() allowDownload!: boolean;
  @ApiProperty() allowFavorites!: boolean;
  @ApiProperty() allowComments!: boolean;
  @ApiPropertyOptional() publishedAt?: Date | null;
  @ApiPropertyOptional() archivedAt?: Date | null;
  @ApiProperty({ type: [GalleryAlbumResponseDto] }) albums!: GalleryAlbumResponseDto[];
  @ApiProperty({ type: [GalleryAssetReferenceResponseDto] }) assetReferences!: GalleryAssetReferenceResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() createdBy?: string | null;
  @ApiProperty() updatedAt!: Date;
  @ApiPropertyOptional() updatedBy?: string | null;
  @ApiPropertyOptional() deletedAt?: Date | null;

  static fromDomain(gallery: Gallery): GalleryResponseDto {
    const dto = new GalleryResponseDto();
    dto.id = gallery.id;
    dto.code = gallery.code;
    dto.name = gallery.name;
    dto.slug = gallery.slug;
    dto.description = gallery.description;
    dto.eventId = gallery.eventId;
    dto.status = gallery.status;
    dto.visibility = gallery.visibility;
    dto.coverMediaAssetId = gallery.coverMediaAssetId;
    dto.allowDownload = gallery.settings.allowDownload;
    dto.allowFavorites = gallery.settings.allowFavorites;
    dto.allowComments = gallery.settings.allowComments;
    dto.publishedAt = gallery.publishedAt;
    dto.archivedAt = gallery.archivedAt;
    dto.albums = gallery.albums.map((a) => ({
      id: a.id,
      galleryId: a.galleryId,
      name: a.name,
      description: a.description,
      coverMediaAssetId: a.coverMediaAssetId,
      sortOrder: a.sortOrder,
    }));
    dto.assetReferences = gallery.assetReferences.map((r) => ({
      id: r.id,
      galleryId: r.galleryId,
      albumId: r.albumId,
      mediaAssetId: r.mediaAssetId,
      title: r.title,
      caption: r.caption,
      sortOrder: r.sortOrder,
    }));
    dto.createdAt = gallery.audit.createdAt;
    dto.createdBy = gallery.audit.createdBy;
    dto.updatedAt = gallery.audit.updatedAt;
    dto.updatedBy = gallery.audit.updatedBy;
    dto.deletedAt = gallery.audit.deletedAt;
    return dto;
  }
}
