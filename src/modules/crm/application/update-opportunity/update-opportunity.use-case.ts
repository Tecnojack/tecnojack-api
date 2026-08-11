import { Injectable, Inject } from '@nestjs/common';
import {
  OPPORTUNITY_REPOSITORY,
  type OpportunityRepositoryPort,
} from '../ports/opportunity.repository.port.js';
import type { Opportunity } from '../../domain/entities/opportunity.entity.js';
import { OpportunityNotFoundException } from '../../domain/errors/crm.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface UpdateOpportunityCommand {
  id: string;
  title?: string;
  description?: string;
  estimatedValue?: number;
  currency?: string;
  probabilityPercentage?: number;
  actorId?: string;
}

@Injectable()
export class UpdateOpportunityUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY)
    private readonly opportunityRepo: OpportunityRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: UpdateOpportunityCommand): Promise<Opportunity> {
    const opportunity = await this.opportunityRepo.findById(command.id);
    if (!opportunity) {
      throw new OpportunityNotFoundException(command.id);
    }

    opportunity.updateDetails(
      {
        title: command.title,
        description: command.description,
        estimatedValue: command.estimatedValue,
        currency: command.currency,
        probabilityPercentage: command.probabilityPercentage,
      },
      command.actorId,
    );

    const saved = await this.opportunityRepo.save(opportunity);
    await this.eventPublisher.publishAll(opportunity.domainEvents);
    opportunity.clearDomainEvents();

    return saved;
  }
}
