import { Injectable, Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepositoryPort,
} from '../ports/payment.repository.port.js';
import type { Payment } from '../../domain/entities/payment.entity.js';
import { PaymentNotFoundException } from '../../domain/errors/payments.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

@Injectable()
export class ManagePaymentStateUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async markAsOverdue(id: string, actorId?: string): Promise<Payment> {
    const payment = await this.getPayment(id);
    payment.markAsOverdue(actorId);
    return this.saveAndPublish(payment);
  }

  async archive(id: string, actorId?: string): Promise<Payment> {
    const payment = await this.getPayment(id);
    payment.softDelete(actorId);
    return this.saveAndPublish(payment);
  }

  async restore(id: string, actorId?: string): Promise<Payment> {
    const payment = await this.getPayment(id);
    payment.restore(actorId);
    return this.saveAndPublish(payment);
  }

  private async getPayment(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findById(id);
    if (!payment) {
      throw new PaymentNotFoundException(id);
    }
    return payment;
  }

  private async saveAndPublish(payment: Payment): Promise<Payment> {
    const saved = await this.paymentRepo.save(payment);
    await this.eventPublisher.publishAll(payment.domainEvents);
    payment.clearDomainEvents();
    return saved;
  }
}
