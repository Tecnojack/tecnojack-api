import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Gallery } from '../../../../domain/entities/gallery.entity.js';
import {
  type GalleryRepositoryPort,
  type ListGalleriesFilter,
} from '../../../../application/ports/gallery.repository.port.js';
import { type PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import { GalleryMapper, type PrismaGalleryWithRelations } from '../mappers/gallery.mapper.js';
import type { GalleryStatus, GalleryVisibility } from '../../../../domain/enums/gallery.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaGalleryRepository implements GalleryRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(gallery: Gallery): Promise<Gallery> {
    const data = GalleryMapper.toPersistence(gallery);
    const albumsData = GalleryMapper.toPersistenceAlbums(gallery.albums);
    const assetRefsData = GalleryMapper.toPersistenceAssetReferences(gallery.assetReferences);

    const saved = await this.prisma.$transaction(async (tx) => {
      await tx.galleryAssetReferenceModel.deleteMany({
        where: { galleryId: gallery.id },
      });
      await tx.galleryAlbumModel.deleteMany({
        where: { galleryId: gallery.id },
      });

      const upserted = await tx.galleryModel.upsert({
        where: { id: gallery.id },
        create: {
          ...data,
          albums: {
            create: albumsData.map((a) => ({
              id: a.id,
              name: a.name,
              description: a.description,
              coverMediaAssetId: a.coverMediaAssetId,
              sortOrder: a.sortOrder,
            })),
          },
          assetReferences: {
            create: assetRefsData.map((r) => ({
              id: r.id,
              albumId: r.albumId,
              mediaAssetId: r.mediaAssetId,
              title: r.title,
              caption: r.caption,
              sortOrder: r.sortOrder,
            })),
          },
        },
        update: {
          ...data,
          albums: {
            create: albumsData.map((a) => ({
              id: a.id,
              name: a.name,
              description: a.description,
              coverMediaAssetId: a.coverMediaAssetId,
              sortOrder: a.sortOrder,
            })),
          },
          assetReferences: {
            create: assetRefsData.map((r) => ({
              id: r.id,
              albumId: r.albumId,
              mediaAssetId: r.mediaAssetId,
              title: r.title,
              caption: r.caption,
              sortOrder: r.sortOrder,
            })),
          },
        },
        include: {
          albums: true,
          assetReferences: true,
        },
      });

      return upserted;
    });

    return GalleryMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Gallery | null> {
    const found = await this.prisma.galleryModel.findUnique({
      where: { id },
      include: { albums: true, assetReferences: true },
    });

    if (!found) return null;
    return GalleryMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<Gallery | null> {
    const found = await this.prisma.galleryModel.findUnique({
      where: { code: code.toUpperCase() },
      include: { albums: true, assetReferences: true },
    });

    if (!found) return null;
    return GalleryMapper.toDomain(found);
  }

  async findAll(filter: ListGalleriesFilter): Promise<PaginatedResult<Gallery>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.GalleryModelWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.GalleryModelWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.eventId ? { eventId: filter.eventId } : {}),
      ...(filter.status ? { status: filter.status as unknown as GalleryStatus } : {}),
      ...(filter.visibility ? { visibility: filter.visibility as unknown as GalleryVisibility } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.galleryModel.count({ where });
    const rawRecords = await this.prisma.galleryModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { albums: true, assetReferences: true },
    });

    const records = rawRecords as unknown as PrismaGalleryWithRelations[];

    return {
      data: records.map((r) => GalleryMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('GAL');
  }
}
