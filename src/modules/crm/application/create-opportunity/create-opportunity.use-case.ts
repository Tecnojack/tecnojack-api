import { Injectable, Inject } from '@nestjs/common';
import {
  OPPORTUNITY_REPOSITORY,
  type OpportunityRepositoryPort,
} from '../ports/opportunity.repository.port.js';
import { PeopleFacade } from '../../../people/public/people.facade.js';
import { Opportunity } from '../../domain/entities/opportunity.entity.js';
import type { CRMPipelineStage } from '../../domain/enums/crm.enums.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface CreateOpportunityCommand {
  title: string;
  description?: string;
  personId?: string;
  organizationId?: string;
  estimatedValue?: number;
  currency?: string;
  probabilityPercentage?: number;
  initialStage?: CRMPipelineStage;
  actorId?: string;
}

@Injectable()
export class CreateOpportunityUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY)
    private readonly opportunityRepo: OpportunityRepositoryPort,
    private readonly peopleFacade: PeopleFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: CreateOpportunityCommand): Promise<Opportunity> {
    if (command.personId) {
      await this.peopleFacade.findPersonByIdOrCode(command.personId);
    } else if (command.organizationId) {
      await this.peopleFacade.findOrganizationByIdOrCode(command.organizationId);
    }

    const code = await this.opportunityRepo.nextCode();

    const opportunity = Opportunity.create(
      {
        code,
        title: command.title,
        description: command.description,
        personId: command.personId,
        organizationId: command.organizationId,
        estimatedValue: command.estimatedValue,
        currency: command.currency,
        probabilityPercentage: command.probabilityPercentage,
        stage: command.initialStage,
      },
      command.actorId,
    );

    const saved = await this.opportunityRepo.save(opportunity);
    await this.eventPublisher.publishAll(opportunity.domainEvents);
    opportunity.clearDomainEvents();

    return saved;
  }
}
