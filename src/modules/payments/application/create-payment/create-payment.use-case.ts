import { Injectable, Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  type PaymentRepositoryPort,
} from '../ports/payment.repository.port.js';
import { EventsFacade } from '../../../events/public/events.facade.js';
import { ContractFacade } from '../../../contracts/public/contract.facade.js';
import { DeliverableFacade } from '../../../deliverables/public/deliverable.facade.js';
import { PeopleFacade } from '../../../people/public/people.facade.js';
import { Payment } from '../../domain/entities/payment.entity.js';
import type { PaymentPlan } from '../../domain/enums/payments.enums.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface CreatePaymentCommand {
  title: string;
  description?: string;
  eventId: string;
  contractId?: string;
  deliverableId?: string;
  payerPersonId?: string;
  payerOrganizationId?: string;
  totalAmount: number;
  currency?: string;
  paymentPlan?: PaymentPlan;
  dueDate?: Date;
  actorId?: string;
}

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    private readonly eventsFacade: EventsFacade,
    private readonly contractsFacade: ContractFacade,
    private readonly deliverableFacade: DeliverableFacade,
    private readonly peopleFacade: PeopleFacade,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<Payment> {
    await this.eventsFacade.getEvent(command.eventId);

    if (command.contractId) {
      await this.contractsFacade.getContract(command.contractId);
    }

    if (command.deliverableId) {
      await this.deliverableFacade.getDeliverable(command.deliverableId);
    }

    if (command.payerPersonId) {
      await this.peopleFacade.findPersonByIdOrCode(command.payerPersonId);
    } else if (command.payerOrganizationId) {
      await this.peopleFacade.findOrganizationByIdOrCode(command.payerOrganizationId);
    }

    const code = await this.paymentRepo.nextCode();

    const payment = Payment.create(
      {
        code,
        title: command.title,
        description: command.description,
        eventId: command.eventId,
        contractId: command.contractId,
        deliverableId: command.deliverableId,
        payerPersonId: command.payerPersonId,
        payerOrganizationId: command.payerOrganizationId,
        totalAmount: command.totalAmount,
        currency: command.currency,
        paymentPlan: command.paymentPlan,
        dueDate: command.dueDate,
      },
      command.actorId,
    );

    const saved = await this.paymentRepo.save(payment);
    await this.eventPublisher.publishAll(payment.domainEvents);
    payment.clearDomainEvents();

    return saved;
  }
}
