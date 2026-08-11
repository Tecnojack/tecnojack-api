import { Injectable, Inject } from '@nestjs/common';
import {
  CONTRACT_REPOSITORY,
  type ContractRepositoryPort,
} from '../ports/contract.repository.port.js';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { DeliverableFacade } from '../../../deliverables/public/deliverable.facade.js';
import { Contract } from '../../domain/entities/contract.entity.js';
import type { ContractTemplateType } from '../../domain/enums/contracts.enums.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface CreateContractCommand {
  title: string;
  description?: string;
  eventId: string;
  deliverableId?: string;
  templateType?: ContractTemplateType;
  notes?: string;
  expiresAt?: Date;
  actorId?: string;
}

@Injectable()
export class CreateContractUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepo: ContractRepositoryPort,
    private readonly eventsFacade: EventsFacade,
    private readonly deliverableFacade: DeliverableFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: CreateContractCommand): Promise<Contract> {
    await this.eventsFacade.getEvent(command.eventId);

    if (command.deliverableId) {
      await this.deliverableFacade.getDeliverable(command.deliverableId);
    }

    const code = await this.contractRepo.nextCode();

    const contract = Contract.create(
      {
        code,
        title: command.title,
        description: command.description,
        eventId: command.eventId,
        deliverableId: command.deliverableId,
        templateType: command.templateType,
        notes: command.notes,
        expiresAt: command.expiresAt,
      },
      command.actorId,
    );

    const saved = await this.contractRepo.save(contract);
    await this.eventPublisher.publishAll(contract.domainEvents);
    contract.clearDomainEvents();

    return saved;
  }
}
