import type {
  GalleryModel as PrismaGallery,
  GalleryAlbumModel as PrismaGalleryAlbum,
  GalleryAssetReferenceModel as PrismaGalleryAssetRef,
} from '../../../../../../generated/prisma/client.js';
import type {
  GalleryStatus as PrismaGalleryStatus,
  GalleryVisibility as PrismaGalleryVisibility,
} from '../../../../../../generated/prisma/enums.js';
import { Gallery } from '../../../../domain/entities/gallery.entity.js';
import { GalleryAlbum } from '../../../../domain/entities/gallery-album.entity.js';
import { GalleryAssetReference } from '../../../../domain/entities/gallery-asset-reference.entity.js';
import type { GalleryStatus, GalleryVisibility } from '../../../../domain/enums/gallery.enums.js';
import { GallerySettings } from '../../../../domain/value-objects/gallery-settings.value-object.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';

export type PrismaGalleryWithRelations = PrismaGallery & {
  albums?: PrismaGalleryAlbum[];
  assetReferences?: PrismaGalleryAssetRef[];
};

export interface PersistenceGalleryData {
  id: string;
  code: string;
  name: string;
  slug: string | null;
  description: string | null;
  eventId: string;
  status: PrismaGalleryStatus;
  visibility: PrismaGalleryVisibility;
  password: string | null;
  coverMediaAssetId: string | null;
  allowDownload: boolean;
  allowFavorites: boolean;
  allowComments: boolean;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}

export class GalleryMapper {
  static toDomain(raw: PrismaGalleryWithRelations): Gallery {
    const settings = new GallerySettings({
      allowDownload: raw.allowDownload,
      allowFavorites: raw.allowFavorites,
      allowComments: raw.allowComments,
      password: raw.password,
    });

    const albums = (raw.albums ?? []).map(
      (a) =>
        new GalleryAlbum({
          id: a.id,
          galleryId: a.galleryId,
          name: a.name,
          description: a.description,
          coverMediaAssetId: a.coverMediaAssetId,
          sortOrder: a.sortOrder,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        }),
    );

    const assetReferences = (raw.assetReferences ?? []).map(
      (r) =>
        new GalleryAssetReference({
          id: r.id,
          galleryId: r.galleryId,
          albumId: r.albumId,
          mediaAssetId: r.mediaAssetId,
          title: r.title,
          caption: r.caption,
          sortOrder: r.sortOrder,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
    );

    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });

    return new Gallery({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      eventId: raw.eventId,
      status: raw.status as unknown as GalleryStatus,
      visibility: raw.visibility as unknown as GalleryVisibility,
      password: raw.password,
      coverMediaAssetId: raw.coverMediaAssetId,
      settings,
      publishedAt: raw.publishedAt,
      archivedAt: raw.archivedAt,
      albums,
      assetReferences,
      audit,
    });
  }

  static toPersistence(entity: Gallery): PersistenceGalleryData {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      eventId: entity.eventId,
      status: entity.status as unknown as PrismaGalleryStatus,
      visibility: entity.visibility as unknown as PrismaGalleryVisibility,
      password: entity.settings.password,
      coverMediaAssetId: entity.coverMediaAssetId,
      allowDownload: entity.settings.allowDownload,
      allowFavorites: entity.settings.allowFavorites,
      allowComments: entity.settings.allowComments,
      publishedAt: entity.publishedAt,
      archivedAt: entity.archivedAt,
      createdAt: entity.audit.createdAt,
      createdBy: entity.audit.createdBy,
      updatedAt: entity.audit.updatedAt,
      updatedBy: entity.audit.updatedBy,
      deletedAt: entity.audit.deletedAt,
      deletedBy: entity.audit.deletedBy,
    };
  }

  static toPersistenceAlbums(albums: readonly GalleryAlbum[]): {
    id: string;
    galleryId: string;
    name: string;
    description: string | null;
    coverMediaAssetId: string | null;
    sortOrder: number;
  }[] {
    return albums.map((a: GalleryAlbum) => ({
      id: a.id,
      galleryId: a.galleryId,
      name: a.name,
      description: a.description,
      coverMediaAssetId: a.coverMediaAssetId,
      sortOrder: a.sortOrder,
    }));
  }

  static toPersistenceAssetReferences(assetRefs: readonly GalleryAssetReference[]): {
    id: string;
    galleryId: string;
    albumId: string | null;
    mediaAssetId: string;
    title: string | null;
    caption: string | null;
    sortOrder: number;
  }[] {
    return assetRefs.map((r: GalleryAssetReference) => ({
      id: r.id,
      galleryId: r.galleryId,
      albumId: r.albumId,
      mediaAssetId: r.mediaAssetId,
      title: r.title,
      caption: r.caption,
      sortOrder: r.sortOrder,
    }));
  }
}
