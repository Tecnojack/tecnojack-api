import type { Opportunity } from '../../domain/entities/opportunity.entity.js';
import type { CRMPipelineStage } from '../../domain/enums/crm.enums.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const OPPORTUNITY_REPOSITORY = Symbol('OPPORTUNITY_REPOSITORY');

export interface ListOpportunitiesFilter {
  page?: number;
  limit?: number;
  stage?: CRMPipelineStage;
  personId?: string;
  organizationId?: string;
  search?: string;
  includeDeleted?: boolean;
}

export interface OpportunityRepositoryPort {
  save(opportunity: Opportunity): Promise<Opportunity>;
  findById(id: string): Promise<Opportunity | null>;
  findByCode(code: string): Promise<Opportunity | null>;
  findAll(filter: ListOpportunitiesFilter): Promise<PaginatedResult<Opportunity>>;
  nextCode(): Promise<string>;
}
