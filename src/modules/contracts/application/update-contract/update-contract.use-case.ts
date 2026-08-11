import { Injectable, Inject } from '@nestjs/common';
import {
  CONTRACT_REPOSITORY,
  type ContractRepositoryPort,
} from '../ports/contract.repository.port.js';
import type { Contract } from '../../domain/entities/contract.entity.js';
import type { ContractTemplateType } from '../../domain/enums/contracts.enums.js';
import { ContractNotFoundException } from '../../domain/errors/contracts.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface UpdateContractCommand {
  id: string;
  title?: string;
  description?: string;
  deliverableId?: string;
  templateType?: ContractTemplateType;
  notes?: string;
  expiresAt?: Date;
  actorId?: string;
}

@Injectable()
export class UpdateContractUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepo: ContractRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: UpdateContractCommand): Promise<Contract> {
    const contract = await this.contractRepo.findById(command.id);
    if (!contract) {
      throw new ContractNotFoundException(command.id);
    }

    contract.updateDetails(
      {
        title: command.title,
        description: command.description,
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
