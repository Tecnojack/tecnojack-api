import { Injectable, Inject } from '@nestjs/common';
import {
  OPPORTUNITY_REPOSITORY,
  type OpportunityRepositoryPort,
} from '../ports/opportunity.repository.port.js';
import type { Opportunity } from '../../domain/entities/opportunity.entity.js';
import { OpportunityNotFoundException } from '../../domain/errors/crm.errors.js';

@Injectable()
export class GetOpportunityUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY)
    private readonly opportunityRepo: OpportunityRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<Opportunity> {
    const isCode = identifier.toUpperCase().startsWith('OPP-');
    const found = isCode
      ? await this.opportunityRepo.findByCode(identifier)
      : await this.opportunityRepo.findById(identifier);

    if (!found) {
      throw new OpportunityNotFoundException(identifier);
    }

    return found;
  }
}
