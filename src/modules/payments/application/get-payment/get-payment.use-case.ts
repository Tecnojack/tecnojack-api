import { Injectable, Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepositoryPort,
} from '../ports/payment.repository.port.js';
import type { Payment } from '../../domain/entities/payment.entity.js';
import { PaymentNotFoundException } from '../../domain/errors/payments.errors.js';

@Injectable()
export class GetPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(identifier: string): Promise<Payment> {
    const isCode = identifier.toUpperCase().startsWith('PAY-');
    const payment = isCode
      ? await this.paymentRepo.findByCode(identifier)
      : await this.paymentRepo.findById(identifier);

    if (!payment) {
      throw new PaymentNotFoundException(identifier);
    }

    return payment;
  }
}
