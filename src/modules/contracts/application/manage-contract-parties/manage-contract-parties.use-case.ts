import { Injectable, Inject } from '@nestjs/common';
import {
  CONTRACT_REPOSITORY,
  type ContractRepositoryPort,
} from '../ports/contract.repository.port.js';
import { PeopleFacade } from '../../../people/public/people.facade.js';
import type { Contract } from '../../domain/entities/contract.entity.js';
import { ContractParty } from '../../domain/entities/contract-party.entity.js';
import type { ContractPartyRole } from '../../domain/enums/contracts.enums.js';
import { ContractNotFoundException } from '../../domain/errors/contracts.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface AddContractPartyCommand {
  contractId: string;
  personId?: string;
  organizationId?: string;
  role: ContractPartyRole;
  isPrimary?: boolean;
  actorId?: string;
}

@Injectable()
export class ManageContractPartiesUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepo: ContractRepositoryPort,
    private readonly peopleFacade: PeopleFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async addParty(command: AddContractPartyCommand): Promise<Contract> {
    const contract = await this.contractRepo.findById(command.contractId);
    if (!contract) {
      throw new ContractNotFoundException(command.contractId);
    }

    if (command.personId) {
      await this.peopleFacade.findPersonByIdOrCode(command.personId);
    } else if (command.organizationId) {
      await this.peopleFacade.findOrganizationByIdOrCode(command.organizationId);
    } else {
      throw new Error('Either personId or organizationId must be provided for a ContractParty.');
    }

    const party = new ContractParty({
      contractId: contract.id,
      personId: command.personId,
      organizationId: command.organizationId,
      role: command.role,
      isPrimary: command.isPrimary,
    });

    contract.addParty(party, command.actorId);

    const saved = await this.contractRepo.save(contract);
    await this.eventPublisher.publishAll(contract.domainEvents);
    contract.clearDomainEvents();

    return saved;
  }
}
