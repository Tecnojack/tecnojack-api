import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';
import type { PaymentStatus, PaymentPlan, PaymentMethod, TransactionType } from '../enums/payments.enums.js';

export interface PaymentCreatedPayload {
  paymentId: string;
  code: string;
  title: string;
  eventId: string;
  contractId?: string | null;
  totalAmount: number;
  currency: string;
  paymentPlan: PaymentPlan;
  status: PaymentStatus;
  createdBy?: string | null;
}

export class PaymentCreatedEvent extends BaseDomainEvent<PaymentCreatedPayload> {
  constructor(payload: PaymentCreatedPayload) {
    super('payments.created', payload.paymentId, payload);
  }
}

export interface PaymentInstallmentAddedPayload {
  paymentId: string;
  installmentId: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
}

export class PaymentInstallmentAddedEvent extends BaseDomainEvent<PaymentInstallmentAddedPayload> {
  constructor(payload: PaymentInstallmentAddedPayload) {
    super('payments.installment_added', payload.paymentId, payload);
  }
}

export interface PaymentTransactionRegisteredPayload {
  paymentId: string;
  transactionId: string;
  installmentId?: string | null;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  referenceNumber?: string | null;
  actorId?: string | null;
}

export class PaymentTransactionRegisteredEvent extends BaseDomainEvent<PaymentTransactionRegisteredPayload> {
  constructor(payload: PaymentTransactionRegisteredPayload) {
    super('payments.transaction_registered', payload.paymentId, payload);
  }
}

export interface PaymentCompletedPayload {
  paymentId: string;
  code: string;
  completedAt: Date;
  actorId?: string | null;
}

export class PaymentCompletedEvent extends BaseDomainEvent<PaymentCompletedPayload> {
  constructor(payload: PaymentCompletedPayload) {
    super('payments.completed', payload.paymentId, payload);
  }
}

export interface PaymentOverduePayload {
  paymentId: string;
  code: string;
  dueDate?: Date | null;
}

export class PaymentOverdueEvent extends BaseDomainEvent<PaymentOverduePayload> {
  constructor(payload: PaymentOverduePayload) {
    super('payments.overdue', payload.paymentId, payload);
  }
}

export interface PaymentArchivedPayload {
  paymentId: string;
  code: string;
  archivedAt: Date;
  archivedBy?: string | null;
}

export class PaymentArchivedEvent extends BaseDomainEvent<PaymentArchivedPayload> {
  constructor(payload: PaymentArchivedPayload) {
    super('payments.archived', payload.paymentId, payload);
  }
}

export interface PaymentRestoredPayload {
  paymentId: string;
  code: string;
  restoredAt: Date;
  restoredBy?: string | null;
}

export class PaymentRestoredEvent extends BaseDomainEvent<PaymentRestoredPayload> {
  constructor(payload: PaymentRestoredPayload) {
    super('payments.restored', payload.paymentId, payload);
  }
}
