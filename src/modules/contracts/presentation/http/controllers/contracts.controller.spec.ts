import { ContractsController } from './contracts.controller.js';
import type { CreateContractUseCase } from '../../../application/create-contract/create-contract.use-case.js';
import type { GetContractUseCase } from '../../../application/get-contract/get-contract.use-case.js';
import type { UpdateContractUseCase } from '../../../application/update-contract/update-contract.use-case.js';
import type { ManageContractStateUseCase } from '../../../application/manage-contract-state/manage-contract-state.use-case.js';
import type { ManageContractVersionsUseCase } from '../../../application/manage-contract-versions/manage-contract-versions.use-case.js';
import type { ManageContractPartiesUseCase } from '../../../application/manage-contract-parties/manage-contract-parties.use-case.js';
import type { ListContractsUseCase } from '../../../application/list-contracts/list-contracts.use-case.js';
import { Contract } from '../../../domain/entities/contract.entity.js';

describe('ContractsController', () => {
  let controller: ContractsController;
  let sampleContract: Contract;

  beforeEach(() => {
    sampleContract = Contract.create({
      code: 'CTR-000001',
      title: 'Contrato de Servicios Fotográficos',
      eventId: crypto.randomUUID(),
    });

    const createUseCase = {
      execute: jest.fn().mockResolvedValue(sampleContract),
    } as unknown as CreateContractUseCase;

    const getUseCase = {
      execute: jest.fn().mockResolvedValue(sampleContract),
    } as unknown as GetContractUseCase;

    const updateUseCase = {
      execute: jest.fn().mockResolvedValue(sampleContract),
    } as unknown as UpdateContractUseCase;

    const stateUseCase = {
      publish: jest.fn().mockResolvedValue(sampleContract),
      markAsExecuted: jest.fn().mockResolvedValue(sampleContract),
      archive: jest.fn().mockResolvedValue(sampleContract),
      restore: jest.fn().mockResolvedValue(sampleContract),
    } as unknown as ManageContractStateUseCase;

    const versionUseCase = {
      addVersion: jest.fn().mockResolvedValue(sampleContract),
    } as unknown as ManageContractVersionsUseCase;

    const partyUseCase = {
      addParty: jest.fn().mockResolvedValue(sampleContract),
    } as unknown as ManageContractPartiesUseCase;

    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleContract],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListContractsUseCase;

    controller = new ContractsController(
      createUseCase,
      getUseCase,
      updateUseCase,
      stateUseCase,
      versionUseCase,
      partyUseCase,
      listUseCase,
    );
  });

  it('should create contract via controller', async () => {
    const res = await controller.create({
      title: 'Contrato de Servicios Fotográficos',
      eventId: crypto.randomUUID(),
    });
    expect(res.code).toBe('CTR-000001');
  });

  it('should get contract by identifier', async () => {
    const res = await controller.findOne('CTR-000001');
    expect(res.code).toBe('CTR-000001');
  });

  it('should list contracts', async () => {
    const res = await controller.findAll({});
    expect(res.data.length).toBe(1);
    expect(res.total).toBe(1);
  });
});
