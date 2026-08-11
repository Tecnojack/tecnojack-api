import type { EventTypeModel as PrismaEventType } from '../../../../../../generated/prisma/client.js';
import type { EventPriority as PrismaEventPriority } from '../../../../../../generated/prisma/enums.js';
import { EventType } from '../../../../domain/entities/event-type.entity.js';
import type { EventPriority } from '../../../../domain/enums/events.enums.js';

export interface PersistenceEventTypeData {
  id: string;
  code: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  defaultTimezone: string | null;
  defaultPriority: PrismaEventPriority;
  templateVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export class EventTypeMapper {
  static toDomain(raw: PrismaEventType): EventType {
    return new EventType({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      color: raw.color,
      icon: raw.icon,
      isActive: raw.isActive,
      sortOrder: raw.sortOrder,
      defaultTimezone: raw.defaultTimezone,
      defaultPriority: raw.defaultPriority as unknown as EventPriority,
      templateVersion: raw.templateVersion,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: EventType): PersistenceEventTypeData {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      color: entity.color,
      icon: entity.icon,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,
      defaultTimezone: entity.defaultTimezone,
      defaultPriority: entity.defaultPriority as unknown as PrismaEventPriority,
      templateVersion: entity.templateVersion,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
