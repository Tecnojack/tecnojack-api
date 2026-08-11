import { Injectable, Inject } from '@nestjs/common';
import {
  CONTRACT_REPOSITORY,
  type ContractRepositoryPort,
  type ListContractsFilter,
} from '../ports/contract.repository.port.js';
import type { Contract } from '../../domain/entities/contract.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ListContractsUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepo: ContractRepositoryPort,
  ) {}

  async execute(filter: ListContractsFilter): Promise<PaginatedResult<Contract>> {
    return this.contractRepo.findAll(filter);
  }
}
