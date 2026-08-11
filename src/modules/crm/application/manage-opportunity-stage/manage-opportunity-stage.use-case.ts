import { Injectable, Inject } from '@nestjs/common';
import {
  OPPORTUNITY_REPOSITORY,
  type OpportunityRepositoryPort,
} from '../ports/opportunity.repository.port.js';
import type { Opportunity } from '../../domain/entities/opportunity.entity.js';
import type { CRMPipelineStage } from '../../domain/enums/crm.enums.js';
import { CustomerJourney } from '../../domain/entities/customer-journey.entity.js';
import { OpportunityNotFoundException } from '../../domain/errors/crm.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface TransitionOpportunityCommand {
  id: string;
  newStage: CRMPipelineStage;
  notes?: string;
  actorId?: string;
}

export interface ConvertOpportunityCommand {
  id: string;
  eventId: string;
  contractId?: string;
  paymentId?: string;
  actorId?: string;
}

@Injectable()
export class ManageOpportunityStageUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY)
    private readonly opportunityRepo: OpportunityRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async transitionTo(command: TransitionOpportunityCommand): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(command.id);
    const fromStage = opportunity.stage;

    opportunity.transitionTo(command.newStage, command.notes, command.actorId);

    const journeyEntry = new CustomerJourney({
      opportunityId: opportunity.id,
      fromStage,
      toStage: command.newStage,
      notes: command.notes,
      actorId: command.actorId,
    });
    opportunity.addJourneyEntry(journeyEntry);

    return this.saveAndPublish(opportunity);
  }

  async convert(command: ConvertOpportunityCommand): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(command.id);
    opportunity.convert(command.eventId, command.contractId, command.paymentId, command.actorId);
    return this.saveAndPublish(opportunity);
  }

  async archive(id: string, actorId?: string): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(id);
    opportunity.softDelete(actorId);
    return this.saveAndPublish(opportunity);
  }

  async restore(id: string, actorId?: string): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(id);
    opportunity.restore(actorId);
    return this.saveAndPublish(opportunity);
  }

  private async getOrThrow(id: string): Promise<Opportunity> {
    const found = await this.opportunityRepo.findById(id);
    if (!found) throw new OpportunityNotFoundException(id);
    return found;
  }

  private async saveAndPublish(opportunity: Opportunity): Promise<Opportunity> {
    const saved = await this.opportunityRepo.save(opportunity);
    await this.eventPublisher.publishAll(opportunity.domainEvents);
    opportunity.clearDomainEvents();
    return saved;
  }
}
