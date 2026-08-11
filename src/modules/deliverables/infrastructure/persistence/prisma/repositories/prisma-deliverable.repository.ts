import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Deliverable } from '../../../../domain/entities/deliverable.entity.js';
import {
  type DeliverableRepositoryPort,
  type ListDeliverablesFilter,
} from '../../../../application/ports/deliverable.repository.port.js';
import { type PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import { DeliverableMapper, type PrismaDeliverableWithRelations } from '../mappers/deliverable.mapper.js';
import type { DeliverableType, DeliverableStatus, DeliveryMethod } from '../../../../domain/enums/deliverables.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaDeliverableRepository implements DeliverableRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(deliverable: Deliverable): Promise<Deliverable> {
    const data = DeliverableMapper.toPersistence(deliverable);
    const itemsData = DeliverableMapper.toPersistenceItems(deliverable.items);

    const saved = await this.prisma.$transaction(async (tx) => {
      await tx.deliverableItemModel.deleteMany({
        where: { deliverableId: deliverable.id },
      });

      const upserted = await tx.deliverableModel.upsert({
        where: { id: deliverable.id },
        create: {
          ...data,
          items: {
            create: itemsData.map((i) => ({
              id: i.id,
              mediaAssetId: i.mediaAssetId,
              title: i.title,
              description: i.description,
              quantity: i.quantity,
              isCompleted: i.isCompleted,
              sortOrder: i.sortOrder,
            })),
          },
        },
        update: {
          ...data,
          items: {
            create: itemsData.map((i) => ({
              id: i.id,
              mediaAssetId: i.mediaAssetId,
              title: i.title,
              description: i.description,
              quantity: i.quantity,
              isCompleted: i.isCompleted,
              sortOrder: i.sortOrder,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return upserted;
    });

    return DeliverableMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Deliverable | null> {
    const found = await this.prisma.deliverableModel.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!found) return null;
    return DeliverableMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<Deliverable | null> {
    const found = await this.prisma.deliverableModel.findUnique({
      where: { code: code.toUpperCase() },
      include: { items: true },
    });

    if (!found) return null;
    return DeliverableMapper.toDomain(found);
  }

  async findAll(filter: ListDeliverablesFilter): Promise<PaginatedResult<Deliverable>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.DeliverableModelWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { trackingNumber: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.DeliverableModelWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.eventId ? { eventId: filter.eventId } : {}),
      ...(filter.type ? { type: filter.type as unknown as DeliverableType } : {}),
      ...(filter.status ? { status: filter.status as unknown as DeliverableStatus } : {}),
      ...(filter.deliveryMethod ? { deliveryMethod: filter.deliveryMethod as unknown as DeliveryMethod } : {}),
      ...(filter.recipientPersonId ? { recipientPersonId: filter.recipientPersonId } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.deliverableModel.count({ where });
    const rawRecords = await this.prisma.deliverableModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    const records = rawRecords as unknown as PrismaDeliverableWithRelations[];

    return {
      data: records.map((r) => DeliverableMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('DEL');
  }
}
