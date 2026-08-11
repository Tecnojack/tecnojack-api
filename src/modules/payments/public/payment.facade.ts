import { Injectable } from '@nestjs/common';
import { CreatePaymentUseCase, type CreatePaymentCommand } from '../application/create-payment/create-payment.use-case.js';
import { GetPaymentUseCase } from '../application/get-payment/get-payment.use-case.js';
import { RegisterTransactionUseCase, type RegisterTransactionCommand } from '../application/register-transaction/register-transaction.use-case.js';
import { ManagePaymentInstallmentsUseCase, type AddPaymentInstallmentCommand } from '../application/manage-payment-installments/manage-payment-installments.use-case.js';
import { ManagePaymentStateUseCase } from '../application/manage-payment-state/manage-payment-state.use-case.js';
import { ListPaymentsUseCase } from '../application/list-payments/list-payments.use-case.js';
import type { ListPaymentsFilter } from '../application/ports/payment.repository.port.js';
import type { Payment } from '../domain/entities/payment.entity.js';
import type { PaginatedResult } from '../../../platform/domain/types/pagination.types.js';

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly registerTransactionUseCase: RegisterTransactionUseCase,
    private readonly managePaymentInstallmentsUseCase: ManagePaymentInstallmentsUseCase,
    private readonly managePaymentStateUseCase: ManagePaymentStateUseCase,
    private readonly listPaymentsUseCase: ListPaymentsUseCase,
  ) {}

  createPayment(command: CreatePaymentCommand): Promise<Payment> {
    return this.createPaymentUseCase.execute(command);
  }

  getPayment(identifier: string): Promise<Payment> {
    return this.getPaymentUseCase.execute(identifier);
  }

  listPayments(filter: ListPaymentsFilter): Promise<PaginatedResult<Payment>> {
    return this.listPaymentsUseCase.execute(filter);
  }

  registerTransaction(command: RegisterTransactionCommand): Promise<Payment> {
    return this.registerTransactionUseCase.execute(command);
  }

  addInstallment(command: AddPaymentInstallmentCommand): Promise<Payment> {
    return this.managePaymentInstallmentsUseCase.addInstallment(command);
  }

  markAsOverdue(id: string, actorId?: string): Promise<Payment> {
    return this.managePaymentStateUseCase.markAsOverdue(id, actorId);
  }
}
