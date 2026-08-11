import type { Payment } from '../../domain/entities/payment.entity.js';
import type { PaymentStatus, PaymentPlan } from '../../domain/enums/payments.enums.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface ListPaymentsFilter {
  page?: number;
  limit?: number;
  eventId?: string;
  contractId?: string;
  deliverableId?: string;
  payerPersonId?: string;
  payerOrganizationId?: string;
  status?: PaymentStatus;
  paymentPlan?: PaymentPlan;
  search?: string;
  includeDeleted?: boolean;
}

export interface PaymentRepositoryPort {
  save(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByCode(code: string): Promise<Payment | null>;
  findAll(filter: ListPaymentsFilter): Promise<PaginatedResult<Payment>>;
  nextCode(): Promise<string>;
}
