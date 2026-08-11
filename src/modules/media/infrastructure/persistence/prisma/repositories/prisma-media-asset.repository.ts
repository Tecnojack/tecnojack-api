import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { MediaAsset } from '../../../../domain/entities/media-asset.entity.js';
import {
  type MediaAssetRepositoryPort,
  type ListMediaAssetsFilter,
} from '../../../../application/ports/media-asset.repository.port.js';
import { type PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import { MediaAssetMapper } from '../mappers/media-asset.mapper.js';
import { MediaType, MediaStatus } from '../../../../domain/enums/media.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaMediaAssetRepository implements MediaAssetRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(mediaAsset: MediaAsset): Promise<MediaAsset> {
    const data = MediaAssetMapper.toPersistence(mediaAsset);

    const saved = await this.prisma.mediaAsset.upsert({
      where: { id: mediaAsset.id },
      create: data,
      update: data,
    });

    return MediaAssetMapper.toDomain(saved);
  }

  async findById(id: string): Promise<MediaAsset | null> {
    const found = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!found) return null;
    return MediaAssetMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<MediaAsset | null> {
    const found = await this.prisma.mediaAsset.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!found) return null;
    return MediaAssetMapper.toDomain(found);
  }

  async findByChecksum(hash: string): Promise<MediaAsset | null> {
    const found = await this.prisma.mediaAsset.findFirst({
      where: {
        checksumHash: hash.toLowerCase(),
        deletedAt: null,
      },
    });

    if (!found) return null;
    return MediaAssetMapper.toDomain(found);
  }

  async findAll(filter: ListMediaAssetsFilter): Promise<PaginatedResult<MediaAsset>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.MediaAssetWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { originalName: { contains: query, mode: 'insensitive' } },
          { mimeType: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.MediaAssetWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.type ? { type: filter.type as unknown as MediaType } : {}),
      ...(filter.status ? { status: filter.status as unknown as MediaStatus } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.mediaAsset.count({ where });
    const records = await this.prisma.mediaAsset.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: records.map((r) => MediaAssetMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('MED');
  }
}
