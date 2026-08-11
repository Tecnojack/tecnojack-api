import { Injectable, Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepositoryPort,
} from '../ports/payment.repository.port.js';
import type { Payment } from '../../domain/entities/payment.entity.js';
import { PaymentTransaction } from '../../domain/entities/payment-transaction.entity.js';
import type { TransactionType, PaymentMethod } from '../../domain/enums/payments.enums.js';
import { PaymentNotFoundException } from '../../domain/errors/payments.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface RegisterTransactionCommand {
  paymentId: string;
  installmentId?: string;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  referenceNumber?: string;
  notes?: string;
  transactionDate?: Date;
  actorId?: string;
}

@Injectable()
export class RegisterTransactionUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: RegisterTransactionCommand): Promise<Payment> {
    const payment = await this.paymentRepo.findById(command.paymentId);
    if (!payment) {
      throw new PaymentNotFoundException(command.paymentId);
    }

    const transaction = new PaymentTransaction({
      paymentId: payment.id,
      installmentId: command.installmentId,
      transactionType: command.transactionType,
      paymentMethod: command.paymentMethod,
      amount: command.amount,
      referenceNumber: command.referenceNumber,
      notes: command.notes,
      transactionDate: command.transactionDate,
      actorId: command.actorId,
    });

    payment.registerTransaction(transaction, command.actorId);

    const saved = await this.paymentRepo.save(payment);
    await this.eventPublisher.publishAll(payment.domainEvents);
    payment.clearDomainEvents();

    return saved;
  }
}
