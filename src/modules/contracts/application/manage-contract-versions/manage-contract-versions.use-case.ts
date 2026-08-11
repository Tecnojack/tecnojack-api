import { Injectable, Inject } from '@nestjs/common';
import {
  CONTRACT_REPOSITORY,
  type ContractRepositoryPort,
} from '../ports/contract.repository.port.js';
import type { Contract } from '../../domain/entities/contract.entity.js';
import { ContractVersion } from '../../domain/entities/contract-version.entity.js';
import { ContractClause, type ContractClauseProps } from '../../domain/value-objects/contract-clause.value-object.js';
import { ContractNotFoundException } from '../../domain/errors/contracts.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface AddContractVersionCommand {
  contractId: string;
  title: string;
  contentSummary?: string;
  clauses?: ContractClauseProps[];
  changeReason?: string;
  actorId?: string;
}

@Injectable()
export class ManageContractVersionsUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepo: ContractRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async addVersion(command: AddContractVersionCommand): Promise<Contract> {
    const contract = await this.contractRepo.findById(command.contractId);
    if (!contract) {
      throw new ContractNotFoundException(command.contractId);
    }

    const nextVersionNumber = contract.currentVersionNumber + 1;
    const clauses = (command.clauses ?? []).map((c) => new ContractClause(c));

    const version = new ContractVersion({
      contractId: contract.id,
      versionNumber: nextVersionNumber,
      title: command.title,
      contentSummary: command.contentSummary,
      clauses,
      changeReason: command.changeReason,
      createdBy: command.actorId,
    });

    contract.addVersion(version, command.actorId);

    const saved = await this.contractRepo.save(contract);
    await this.eventPublisher.publishAll(contract.domainEvents);
    contract.clearDomainEvents();

    return saved;
  }
}
