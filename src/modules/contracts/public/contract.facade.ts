import { Injectable } from '@nestjs/common';
import { CreateContractUseCase, type CreateContractCommand } from '../application/create-contract/create-contract.use-case.js';
import { GetContractUseCase } from '../application/get-contract/get-contract.use-case.js';
import { UpdateContractUseCase, type UpdateContractCommand } from '../application/update-contract/update-contract.use-case.js';
import { ManageContractStateUseCase } from '../application/manage-contract-state/manage-contract-state.use-case.js';
import { ListContractsUseCase } from '../application/list-contracts/list-contracts.use-case.js';
import type { ListContractsFilter } from '../application/ports/contract.repository.port.js';
import type { Contract } from '../domain/entities/contract.entity.js';
import type { PaginatedResult } from '../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ContractFacade {
  constructor(
    private readonly createContractUseCase: CreateContractUseCase,
    private readonly getContractUseCase: GetContractUseCase,
    private readonly updateContractUseCase: UpdateContractUseCase,
    private readonly manageContractStateUseCase: ManageContractStateUseCase,
    private readonly listContractsUseCase: ListContractsUseCase,
  ) {}

  createContract(command: CreateContractCommand): Promise<Contract> {
    return this.createContractUseCase.execute(command);
  }

  getContract(identifier: string): Promise<Contract> {
    return this.getContractUseCase.execute(identifier);
  }

  updateContract(command: UpdateContractCommand): Promise<Contract> {
    return this.updateContractUseCase.execute(command);
  }

  listContracts(filter: ListContractsFilter): Promise<PaginatedResult<Contract>> {
    return this.listContractsUseCase.execute(filter);
  }

  publishContract(id: string, actorId?: string): Promise<Contract> {
    return this.manageContractStateUseCase.publish(id, actorId);
  }

  executeContract(id: string, actorId?: string): Promise<Contract> {
    return this.manageContractStateUseCase.markAsExecuted(id, actorId);
  }
}
