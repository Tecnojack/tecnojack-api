import { Injectable } from '@nestjs/common';
import { CreateDeliverableUseCase, type CreateDeliverableCommand } from '../application/create-deliverable/create-deliverable.use-case.js';
import { GetDeliverableUseCase } from '../application/get-deliverable/get-deliverable.use-case.js';
import { UpdateDeliverableUseCase, type UpdateDeliverableCommand } from '../application/update-deliverable/update-deliverable.use-case.js';
import { ManageDeliverableStateUseCase } from '../application/manage-deliverable-state/manage-deliverable-state.use-case.js';
import { ListDeliverablesUseCase } from '../application/list-deliverables/list-deliverables.use-case.js';
import type { ListDeliverablesFilter } from '../application/ports/deliverable.repository.port.js';
import type { Deliverable } from '../domain/entities/deliverable.entity.js';
import type { DeliveryMethod } from '../domain/enums/deliverables.enums.js';
import type { PaginatedResult } from '../../../platform/domain/types/pagination.types.js';

@Injectable()
export class DeliverableFacade {
  constructor(
    private readonly createDeliverableUseCase: CreateDeliverableUseCase,
    private readonly getDeliverableUseCase: GetDeliverableUseCase,
    private readonly updateDeliverableUseCase: UpdateDeliverableUseCase,
    private readonly manageDeliverableStateUseCase: ManageDeliverableStateUseCase,
    private readonly listDeliverablesUseCase: ListDeliverablesUseCase,
  ) {}

  createDeliverable(command: CreateDeliverableCommand): Promise<Deliverable> {
    return this.createDeliverableUseCase.execute(command);
  }

  getDeliverable(identifier: string): Promise<Deliverable> {
    return this.getDeliverableUseCase.execute(identifier);
  }

  updateDeliverable(command: UpdateDeliverableCommand): Promise<Deliverable> {
    return this.updateDeliverableUseCase.execute(command);
  }

  listDeliverables(filter: ListDeliverablesFilter): Promise<PaginatedResult<Deliverable>> {
    return this.listDeliverablesUseCase.execute(filter);
  }

  markAsReady(id: string, actorId?: string): Promise<Deliverable> {
    return this.manageDeliverableStateUseCase.markAsReady(id, actorId);
  }

  markAsDelivered(id: string, deliveryMethod?: DeliveryMethod, notes?: string, actorId?: string): Promise<Deliverable> {
    return this.manageDeliverableStateUseCase.markAsDelivered(id, deliveryMethod, notes, actorId);
  }
}
