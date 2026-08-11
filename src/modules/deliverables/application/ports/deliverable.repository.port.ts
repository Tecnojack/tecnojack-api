import type { Deliverable } from '../../domain/entities/deliverable.entity.js';
import type { DeliverableType, DeliverableStatus, DeliveryMethod } from '../../domain/enums/deliverables.enums.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const DELIVERABLE_REPOSITORY = Symbol('DELIVERABLE_REPOSITORY');

export interface ListDeliverablesFilter {
  page?: number;
  limit?: number;
  eventId?: string;
  type?: DeliverableType;
  status?: DeliverableStatus;
  deliveryMethod?: DeliveryMethod;
  recipientPersonId?: string;
  search?: string;
  includeDeleted?: boolean;
}

export interface DeliverableRepositoryPort {
  save(deliverable: Deliverable): Promise<Deliverable>;
  findById(id: string): Promise<Deliverable | null>;
  findByCode(code: string): Promise<Deliverable | null>;
  findAll(filter: ListDeliverablesFilter): Promise<PaginatedResult<Deliverable>>;
  nextCode(): Promise<string>;
}
