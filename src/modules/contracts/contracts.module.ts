import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module.js';
import { PeopleModule } from '../people/people.module.js';
import { DeliverablesModule } from '../deliverables/deliverables.module.js';
import { CONTRACT_REPOSITORY } from './application/ports/contract.repository.port.js';
import { PrismaContractRepository } from './infrastructure/persistence/prisma/repositories/prisma-contract.repository.js';
import { CreateContractUseCase } from './application/create-contract/create-contract.use-case.js';
import { GetContractUseCase } from './application/get-contract/get-contract.use-case.js';
import { UpdateContractUseCase } from './application/update-contract/update-contract.use-case.js';
import { ManageContractStateUseCase } from './application/manage-contract-state/manage-contract-state.use-case.js';
import { ManageContractVersionsUseCase } from './application/manage-contract-versions/manage-contract-versions.use-case.js';
import { ManageContractPartiesUseCase } from './application/manage-contract-parties/manage-contract-parties.use-case.js';
import { ListContractsUseCase } from './application/list-contracts/list-contracts.use-case.js';
import { ContractsController } from './presentation/http/controllers/contracts.controller.js';
import { ContractFacade } from './public/contract.facade.js';

@Module({
  imports: [EventsModule, PeopleModule, DeliverablesModule],
  controllers: [ContractsController],
  providers: [
    {
      provide: CONTRACT_REPOSITORY,
      useClass: PrismaContractRepository,
    },
    CreateContractUseCase,
    GetContractUseCase,
    UpdateContractUseCase,
    ManageContractStateUseCase,
    ManageContractVersionsUseCase,
    ManageContractPartiesUseCase,
    ListContractsUseCase,
    ContractFacade,
  ],
  exports: [ContractFacade, CONTRACT_REPOSITORY],
})
export class ContractsModule {}
