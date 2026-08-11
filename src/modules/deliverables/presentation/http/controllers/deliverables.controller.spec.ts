import { DeliverablesController } from './deliverables.controller.js';
import type { CreateDeliverableUseCase } from '../../../application/create-deliverable/create-deliverable.use-case.js';
import type { GetDeliverableUseCase } from '../../../application/get-deliverable/get-deliverable.use-case.js';
import type { UpdateDeliverableUseCase } from '../../../application/update-deliverable/update-deliverable.use-case.js';
import type { ManageDeliverableStateUseCase } from '../../../application/manage-deliverable-state/manage-deliverable-state.use-case.js';
import type { ManageDeliverableItemsUseCase } from '../../../application/manage-deliverable-items/manage-deliverable-items.use-case.js';
import type { ListDeliverablesUseCase } from '../../../application/list-deliverables/list-deliverables.use-case.js';
import { Deliverable } from '../../../domain/entities/deliverable.entity.js';

describe('DeliverablesController', () => {
  let controller: DeliverablesController;
  let sampleDeliverable: Deliverable;

  beforeEach(() => {
    sampleDeliverable = Deliverable.create({
      code: 'DEL-000001',
      name: 'Paquete de Fotografías Impresas',
      eventId: crypto.randomUUID(),
    });

    const createUseCase = {
      execute: jest.fn().mockResolvedValue(sampleDeliverable),
    } as unknown as CreateDeliverableUseCase;

    const getUseCase = {
      execute: jest.fn().mockResolvedValue(sampleDeliverable),
    } as unknown as GetDeliverableUseCase;

    const updateUseCase = {
      execute: jest.fn().mockResolvedValue(sampleDeliverable),
    } as unknown as UpdateDeliverableUseCase;

    const stateUseCase = {
      markAsReady: jest.fn().mockResolvedValue(sampleDeliverable),
      markAsDelivered: jest.fn().mockResolvedValue(sampleDeliverable),
      archive: jest.fn().mockResolvedValue(sampleDeliverable),
      restore: jest.fn().mockResolvedValue(sampleDeliverable),
    } as unknown as ManageDeliverableStateUseCase;

    const itemUseCase = {
      addItem: jest.fn().mockResolvedValue(sampleDeliverable),
      removeItem: jest.fn().mockResolvedValue(sampleDeliverable),
    } as unknown as ManageDeliverableItemsUseCase;

    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleDeliverable],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListDeliverablesUseCase;

    controller = new DeliverablesController(
      createUseCase,
      getUseCase,
      updateUseCase,
      stateUseCase,
      itemUseCase,
      listUseCase,
    );
  });

  it('should create deliverable via controller', async () => {
    const res = await controller.create({
      name: 'Paquete de Fotografías Impresas',
      eventId: crypto.randomUUID(),
    });
    expect(res.code).toBe('DEL-000001');
  });

  it('should get deliverable by identifier', async () => {
    const res = await controller.findOne('DEL-000001');
    expect(res.code).toBe('DEL-000001');
  });

  it('should list deliverables', async () => {
    const res = await controller.findAll({});
    expect(res.data.length).toBe(1);
    expect(res.total).toBe(1);
  });
});
