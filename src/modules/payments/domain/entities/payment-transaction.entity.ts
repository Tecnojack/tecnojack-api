import type { TransactionType, PaymentMethod } from '../enums/payments.enums.js';

export interface PaymentTransactionProps {
  id?: string;
  paymentId: string;
  installmentId?: string | null;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  referenceNumber?: string | null;
  notes?: string | null;
  transactionDate?: Date;
  actorId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PaymentTransaction {
  readonly id: string;
  readonly paymentId: string;
  readonly installmentId: string | null;
  readonly transactionType: TransactionType;
  readonly paymentMethod: PaymentMethod;
  readonly amount: number;
  readonly referenceNumber: string | null;
  readonly notes: string | null;
  readonly transactionDate: Date;
  readonly actorId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: PaymentTransactionProps) {
    if (props.amount <= 0) {
      throw new Error('PaymentTransaction amount must be > 0.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.paymentId = props.paymentId;
    this.installmentId = props.installmentId ?? null;
    this.transactionType = props.transactionType;
    this.paymentMethod = props.paymentMethod;
    this.amount = props.amount;
    this.referenceNumber = props.referenceNumber?.trim() ?? null;
    this.notes = props.notes?.trim() ?? null;
    this.transactionDate = props.transactionDate ?? new Date();
    this.actorId = props.actorId ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
