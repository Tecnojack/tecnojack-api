import { Injectable, Inject } from '@nestjs/common';
import {
  OPPORTUNITY_REPOSITORY,
  type OpportunityRepositoryPort,
} from '../ports/opportunity.repository.port.js';
import type { Opportunity } from '../../domain/entities/opportunity.entity.js';
import { Quotation } from '../../domain/entities/quotation.entity.js';
import type { QuotationItem } from '../../domain/entities/quotation.entity.js';
import { OpportunityNotFoundException } from '../../domain/errors/crm.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface AddQuotationCommand {
  opportunityId: string;
  title: string;
  items?: QuotationItem[];
  subtotalAmount: number;
  taxAmount?: number;
  totalAmount: number;
  validUntil?: Date;
  actorId?: string;
}

export interface QuotationActionCommand {
  opportunityId: string;
  quotationId: string;
  actorId?: string;
}

@Injectable()
export class ManageQuotationsUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY)
    private readonly opportunityRepo: OpportunityRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async addQuotation(command: AddQuotationCommand): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(command.opportunityId);

    const quotationNumber = `COT-${String(opportunity.quotations.length + 1).padStart(6, '0')}`;

    const quotation = new Quotation({
      opportunityId: opportunity.id,
      quotationNumber,
      title: command.title,
      items: command.items,
      subtotalAmount: command.subtotalAmount,
      taxAmount: command.taxAmount,
      totalAmount: command.totalAmount,
      validUntil: command.validUntil,
      createdBy: command.actorId,
    });

    opportunity.addQuotation(quotation, command.actorId);
    return this.saveAndPublish(opportunity);
  }

  async approveQuotation(command: QuotationActionCommand): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(command.opportunityId);
    opportunity.approveQuotation(command.quotationId, command.actorId);
    return this.saveAndPublish(opportunity);
  }

  async rejectQuotation(command: QuotationActionCommand): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(command.opportunityId);
    opportunity.rejectQuotation(command.quotationId, command.actorId);
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
