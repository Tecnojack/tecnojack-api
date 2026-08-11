import { Injectable, Inject } from '@nestjs/common';
import {
  DELIVERABLE_REPOSITORY,
  type DeliverableRepositoryPort,
  type ListDeliverablesFilter,
} from '../ports/deliverable.repository.port.js';
import type { Deliverable } from '../../domain/entities/deliverable.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ListDeliverablesUseCase {
  constructor(
    @Inject(DELIVERABLE_REPOSITORY)
    private readonly deliverableRepo: DeliverableRepositoryPort,
  ) {}

  async execute(filter: ListDeliverablesFilter): Promise<PaginatedResult<Deliverable>> {
    return this.deliverableRepo.findAll(filter);
  }
}
