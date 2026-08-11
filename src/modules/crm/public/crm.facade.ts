import { Injectable } from '@nestjs/common';
import { CreateOpportunityUseCase, type CreateOpportunityCommand } from '../application/create-opportunity/create-opportunity.use-case.js';
import { GetOpportunityUseCase } from '../application/get-opportunity/get-opportunity.use-case.js';
import { ListOpportunitiesUseCase } from '../application/list-opportunities/list-opportunities.use-case.js';
import { ManageOpportunityStageUseCase } from '../application/manage-opportunity-stage/manage-opportunity-stage.use-case.js';
import type { ListOpportunitiesFilter } from '../application/ports/opportunity.repository.port.js';
import type { Opportunity } from '../domain/entities/opportunity.entity.js';
import type { PaginatedResult } from '../../../platform/domain/types/pagination.types.js';

@Injectable()
export class CRMFacade {
  constructor(
    private readonly createOpportunityUseCase: CreateOpportunityUseCase,
    private readonly getOpportunityUseCase: GetOpportunityUseCase,
    private readonly listOpportunitiesUseCase: ListOpportunitiesUseCase,
    private readonly manageOpportunityStageUseCase: ManageOpportunityStageUseCase,
  ) {}

  createOpportunity(command: CreateOpportunityCommand): Promise<Opportunity> {
    return this.createOpportunityUseCase.execute(command);
  }

  getOpportunity(identifier: string): Promise<Opportunity> {
    return this.getOpportunityUseCase.execute(identifier);
  }

  listOpportunities(filter: ListOpportunitiesFilter): Promise<PaginatedResult<Opportunity>> {
    return this.listOpportunitiesUseCase.execute(filter);
  }

  convertOpportunity(command: { id: string; eventId: string; contractId?: string; paymentId?: string; actorId?: string }): Promise<Opportunity> {
    return this.manageOpportunityStageUseCase.convert(command);
  }
}
