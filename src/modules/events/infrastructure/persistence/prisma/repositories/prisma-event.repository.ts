import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Event } from '../../../../domain/entities/event.entity.js';
import {
  type EventRepositoryPort,
  type ListEventsFilter,
} from '../../../../application/ports/event.repository.port.js';
import { type PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import { EventMapper, type PrismaEventWithRelations } from '../mappers/event.mapper.js';
import {
  EventLifecycleStatus,
  EventProductionPhase,
  EventDateStatus,
  EventPriority,
} from '../../../../domain/enums/events.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaEventRepository implements EventRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(event: Event): Promise<Event> {
    const data = EventMapper.toPersistence(event);
    const sessionsData = EventMapper.toPersistenceSessions(event.sessions);

    const saved = await this.prisma.$transaction(async (tx) => {
      await tx.eventSessionModel.deleteMany({
        where: { eventId: event.id },
      });

      const upserted = await tx.eventModel.upsert({
        where: { id: event.id },
        create: {
          ...data,
          sessions: {
            create: sessionsData.map((s) => ({
              id: s.id,
              locationId: s.locationId,
              type: s.type,
              name: s.name,
              description: s.description,
              status: s.status,
              dateStatus: s.dateStatus,
              startAt: s.startAt,
              endAt: s.endAt,
              timezone: s.timezone,
              allDay: s.allDay,
              sortOrder: s.sortOrder,
              notes: s.notes,
            })),
          },
        },
        update: {
          ...data,
          sessions: {
            create: sessionsData.map((s) => ({
              id: s.id,
              locationId: s.locationId,
              type: s.type,
              name: s.name,
              description: s.description,
              status: s.status,
              dateStatus: s.dateStatus,
              startAt: s.startAt,
              endAt: s.endAt,
              timezone: s.timezone,
              allDay: s.allDay,
              sortOrder: s.sortOrder,
              notes: s.notes,
            })),
          },
        },
        include: {
          sessions: true,
        },
      });

      return upserted;
    });

    return EventMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Event | null> {
    const found = await this.prisma.eventModel.findUnique({
      where: { id },
      include: { sessions: true },
    });

    if (!found) return null;
    return EventMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<Event | null> {
    const found = await this.prisma.eventModel.findUnique({
      where: { code: code.toUpperCase() },
      include: { sessions: true },
    });

    if (!found) return null;
    return EventMapper.toDomain(found);
  }

  async findAll(filter: ListEventsFilter): Promise<PaginatedResult<Event>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.EventModelWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { briefSummary: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.EventModelWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.eventTypeId ? { eventTypeId: filter.eventTypeId } : {}),
      ...(filter.lifecycleStatus ? { lifecycleStatus: filter.lifecycleStatus as unknown as EventLifecycleStatus } : {}),
      ...(filter.productionPhase ? { productionPhase: filter.productionPhase as unknown as EventProductionPhase } : {}),
      ...(filter.dateStatus ? { dateStatus: filter.dateStatus as unknown as EventDateStatus } : {}),
      ...(filter.priority ? { priority: filter.priority as unknown as EventPriority } : {}),
      ...(filter.ownerUserId ? { ownerUserId: filter.ownerUserId } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.eventModel.count({ where });
    const rawRecords = await this.prisma.eventModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { sessions: true },
    });

    const records = rawRecords as unknown as PrismaEventWithRelations[];

    return {
      data: records.map((r) => EventMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('EVT');
  }
}
