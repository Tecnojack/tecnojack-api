import { Injectable, Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepositoryPort,
  type ListPaymentsFilter,
} from '../ports/payment.repository.port.js';
import type { Payment } from '../../domain/entities/payment.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

@Injectable()
export class ListPaymentsUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(filter: ListPaymentsFilter): Promise<PaginatedResult<Payment>> {
    return this.paymentRepo.findAll(filter);
  }
}
