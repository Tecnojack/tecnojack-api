import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { EventType } from '../../../../domain/entities/event-type.entity.js';
import type { EventTypeRepositoryPort } from '../../../../application/ports/event.repository.port.js';
import { EventTypeMapper } from '../mappers/event-type.mapper.js';

@Injectable()
export class PrismaEventTypeRepository implements EventTypeRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(eventType: EventType): Promise<EventType> {
    const data = EventTypeMapper.toPersistence(eventType);
    const saved = await this.prisma.eventTypeModel.upsert({
      where: { id: eventType.id },
      create: data,
      update: data,
    });
    return EventTypeMapper.toDomain(saved);
  }

  async findById(id: string): Promise<EventType | null> {
    const found = await this.prisma.eventTypeModel.findUnique({
      where: { id },
    });
    if (!found) return null;
    return EventTypeMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<EventType | null> {
    const found = await this.prisma.eventTypeModel.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!found) return null;
    return EventTypeMapper.toDomain(found);
  }

  async findAll(onlyActive = true): Promise<EventType[]> {
    const found = await this.prisma.eventTypeModel.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
    return found.map((f) => EventTypeMapper.toDomain(f));
  }
}
