import { Injectable, Inject } from '@nestjs/common';
import {
  OPPORTUNITY_REPOSITORY,
  type OpportunityRepositoryPort,
  type ListOpportunitiesFilter,
} from '../ports/opportunity.repository.port.js';
import type { Opportunity } from '../../domain/entities/opportunity.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ListOpportunitiesUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY)
    private readonly opportunityRepo: OpportunityRepositoryPort,
  ) {}

  async execute(filter: ListOpportunitiesFilter): Promise<PaginatedResult<Opportunity>> {
    return this.opportunityRepo.findAll(filter);
  }
}
