import type { Event } from '../../domain/entities/event.entity.js';
import type { EventType } from '../../domain/entities/event-type.entity.js';
import type { Location } from '../../domain/entities/location.entity.js';
import type {
  EventLifecycleStatus,
  EventProductionPhase,
  EventDateStatus,
  EventPriority,
} from '../../domain/enums/events.enums.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');
export const EVENT_TYPE_REPOSITORY = Symbol('EVENT_TYPE_REPOSITORY');
export const LOCATION_REPOSITORY = Symbol('LOCATION_REPOSITORY');

export interface ListEventsFilter {
  page?: number;
  limit?: number;
  eventTypeId?: string;
  lifecycleStatus?: EventLifecycleStatus;
  productionPhase?: EventProductionPhase;
  dateStatus?: EventDateStatus;
  priority?: EventPriority;
  ownerUserId?: string;
  search?: string;
  includeDeleted?: boolean;
}

export interface EventRepositoryPort {
  save(event: Event): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  findByCode(code: string): Promise<Event | null>;
  findAll(filter: ListEventsFilter): Promise<PaginatedResult<Event>>;
  nextCode(): Promise<string>;
}

export interface EventTypeRepositoryPort {
  save(eventType: EventType): Promise<EventType>;
  findById(id: string): Promise<EventType | null>;
  findByCode(code: string): Promise<EventType | null>;
  findAll(onlyActive?: boolean): Promise<EventType[]>;
}

export interface LocationRepositoryPort {
  save(location: Location): Promise<Location>;
  findById(id: string): Promise<Location | null>;
  findAll(search?: string, onlyActive?: boolean): Promise<Location[]>;
}
