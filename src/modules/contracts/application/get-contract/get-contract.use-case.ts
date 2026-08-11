import { Injectable, Inject } from '@nestjs/common';
import {
  CONTRACT_REPOSITORY,
  type ContractRepositoryPort,
} from '../ports/contract.repository.port.js';
import type { Contract } from '../../domain/entities/contract.entity.js';
import { ContractNotFoundException } from '../../domain/errors/contracts.errors.js';

@Injectable()
export class GetContractUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepo: ContractRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<Contract> {
    const isCode = identifier.toUpperCase().startsWith('CTR-');
    const contract = isCode
      ? await this.contractRepo.findByCode(identifier)
      : await this.contractRepo.findById(identifier);

    if (!contract) {
      throw new ContractNotFoundException(identifier);
    }

    return contract;
  }
}
