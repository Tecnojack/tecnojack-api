import { Injectable, Inject } from '@nestjs/common';
import {
  DELIVERABLE_REPOSITORY,
  type DeliverableRepositoryPort,
} from '../ports/deliverable.repository.port.js';
import type { Deliverable } from '../../domain/entities/deliverable.entity.js';
import { DeliverableNotFoundException } from '../../domain/errors/deliverables.errors.js';

@Injectable()
export class GetDeliverableUseCase {
  constructor(
    @Inject(DELIVERABLE_REPOSITORY)
    private readonly deliverableRepo: DeliverableRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<Deliverable> {
    const isCode = identifier.toUpperCase().startsWith('DEL-');
    const deliverable = isCode
      ? await this.deliverableRepo.findByCode(identifier)
      : await this.deliverableRepo.findById(identifier);

    if (!deliverable) {
      throw new DeliverableNotFoundException(identifier);
    }

    return deliverable;
  }
}
