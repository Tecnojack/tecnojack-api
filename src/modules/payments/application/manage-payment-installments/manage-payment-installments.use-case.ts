import { Injectable, Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepositoryPort,
} from '../ports/payment.repository.port.js';
import type { Payment } from '../../domain/entities/payment.entity.js';
import { PaymentInstallment } from '../../domain/entities/payment-installment.entity.js';
import { PaymentNotFoundException } from '../../domain/errors/payments.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface AddPaymentInstallmentCommand {
  paymentId: string;
  title: string;
  amount: number;
  dueDate: Date;
  actorId?: string;
}

@Injectable()
export class ManagePaymentInstallmentsUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async addInstallment(command: AddPaymentInstallmentCommand): Promise<Payment> {
    const payment = await this.paymentRepo.findById(command.paymentId);
    if (!payment) {
      throw new PaymentNotFoundException(command.paymentId);
    }

    const nextInstallmentNumber = payment.installments.length + 1;

    const installment = new PaymentInstallment({
      paymentId: payment.id,
      installmentNumber: nextInstallmentNumber,
      title: command.title,
      amount: command.amount,
      dueDate: command.dueDate,
    });

    payment.addInstallment(installment, command.actorId);

    const saved = await this.paymentRepo.save(payment);
    await this.eventPublisher.publishAll(payment.domainEvents);
    payment.clearDomainEvents();

    return saved;
  }
}
