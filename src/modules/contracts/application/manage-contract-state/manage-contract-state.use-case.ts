import { Injectable, Inject } from '@nestjs/common';
import {
  CONTRACT_REPOSITORY,
  type ContractRepositoryPort,
} from '../ports/contract.repository.port.js';
import type { Contract } from '../../domain/entities/contract.entity.js';
import { ContractNotFoundException } from '../../domain/errors/contracts.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

@Injectable()
export class ManageContractStateUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepo: ContractRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async publish(id: string, actorId?: string): Promise<Contract> {
    const contract = await this.getContract(id);
    contract.publish(actorId);
    return this.saveAndPublish(contract);
  }

  async markAsExecuted(id: string, actorId?: string): Promise<Contract> {
    const contract = await this.getContract(id);
    contract.markAsExecuted(actorId);
    return this.saveAndPublish(contract);
  }

  async archive(id: string, actorId?: string): Promise<Contract> {
    const contract = await this.getContract(id);
    contract.softDelete(actorId);
    return this.saveAndPublish(contract);
  }

  async restore(id: string, actorId?: string): Promise<Contract> {
    const contract = await this.getContract(id);
    contract.restore(actorId);
    return this.saveAndPublish(contract);
  }

  private async getContract(id: string): Promise<Contract> {
    const contract = await this.contractRepo.findById(id);
    if (!contract) {
      throw new ContractNotFoundException(id);
    }
    return contract;
  }

  private async saveAndPublish(contract: Contract): Promise<Contract> {
    const saved = await this.contractRepo.save(contract);
    await this.eventPublisher.publishAll(contract.domainEvents);
    contract.clearDomainEvents();
    return saved;
  }
}
