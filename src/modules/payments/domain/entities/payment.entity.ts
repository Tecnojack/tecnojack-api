import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import {
  PaymentStatus,
  PaymentPlan,
  TransactionType,
} from '../enums/payments.enums.js';
import type { PaymentInstallment } from './payment-installment.entity.js';
import type { PaymentTransaction } from './payment-transaction.entity.js';
import {
  PaymentAlreadyDeletedException,
  InvalidTransactionAmountException,
} from '../errors/payments.errors.js';
import {
  PaymentCreatedEvent,
  PaymentInstallmentAddedEvent,
  PaymentTransactionRegisteredEvent,
  PaymentCompletedEvent,
  PaymentOverdueEvent,
  PaymentArchivedEvent,
  PaymentRestoredEvent,
} from '../events/payments.events.js';

export interface PaymentProps {
  id?: string;
  code: string;
  title: string;
  description?: string | null;
  eventId: string;
  contractId?: string | null;
  deliverableId?: string | null;
  payerPersonId?: string | null;
  payerOrganizationId?: string | null;
  status?: PaymentStatus;
  paymentPlan?: PaymentPlan;
  totalAmount: number;
  paidAmount?: number;
  pendingAmount?: number;
  currency?: string;
  dueDate?: Date | null;
  completedAt?: Date | null;
  installments?: PaymentInstallment[];
  transactions?: PaymentTransaction[];
  audit?: AuditInfo;
}

export class Payment extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _title: string;
  private _description: string | null;
  private readonly _eventId: string;
  private _contractId: string | null;
  private _deliverableId: string | null;
  private _payerPersonId: string | null;
  private _payerOrganizationId: string | null;
  private _status: PaymentStatus;
  private _paymentPlan: PaymentPlan;
  private _totalAmount: number;
  private _paidAmount: number;
  private _pendingAmount: number;
  private _currency: string;
  private _dueDate: Date | null;
  private _completedAt: Date | null;
  private _installments: PaymentInstallment[];
  private _transactions: PaymentTransaction[];
  private _audit: AuditInfo;

  constructor(props: PaymentProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Payment code cannot be empty.');
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Payment title cannot be empty.');
    }
    if (!props.eventId || props.eventId.trim().length === 0) {
      throw new Error('Payment eventId cannot be empty.');
    }
    if (props.totalAmount < 0) {
      throw new Error('Payment totalAmount cannot be negative.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._title = props.title.trim();
    this._description = props.description?.trim() ?? null;
    this._eventId = props.eventId;
    this._contractId = props.contractId ?? null;
    this._deliverableId = props.deliverableId ?? null;
    this._payerPersonId = props.payerPersonId ?? null;
    this._payerOrganizationId = props.payerOrganizationId ?? null;
    this._status = props.status ?? PaymentStatus.DRAFT;
    this._paymentPlan = props.paymentPlan ?? PaymentPlan.FULL_PAYMENT;
    this._totalAmount = props.totalAmount;
    this._paidAmount = props.paidAmount ?? 0;
    this._pendingAmount = props.pendingAmount ?? Math.max(0, this._totalAmount - this._paidAmount);
    this._currency = props.currency?.toUpperCase().trim() ?? 'COP';
    this._dueDate = props.dueDate ?? null;
    this._completedAt = props.completedAt ?? null;
    this._installments = props.installments ? [...props.installments] : [];
    this._transactions = props.transactions ? [...props.transactions] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: PaymentProps, actorId?: string): Payment {
    const payment = new Payment({
      ...props,
      audit: AuditInfo.create(actorId),
    });

    payment.addDomainEvent(
      new PaymentCreatedEvent({
        paymentId: payment.id,
        code: payment.code,
        title: payment.title,
        eventId: payment.eventId,
        contractId: payment.contractId,
        totalAmount: payment.totalAmount,
        currency: payment.currency,
        paymentPlan: payment.paymentPlan,
        status: payment.status,
        createdBy: actorId ?? null,
      }),
    );

    return payment;
  }

  get code(): string { return this._code; }
  get title(): string { return this._title; }
  get description(): string | null { return this._description; }
  get eventId(): string { return this._eventId; }
  get contractId(): string | null { return this._contractId; }
  get deliverableId(): string | null { return this._deliverableId; }
  get payerPersonId(): string | null { return this._payerPersonId; }
  get payerOrganizationId(): string | null { return this._payerOrganizationId; }
  get status(): PaymentStatus { return this._status; }
  get paymentPlan(): PaymentPlan { return this._paymentPlan; }
  get totalAmount(): number { return this._totalAmount; }
  get paidAmount(): number { return this._paidAmount; }
  get pendingAmount(): number { return this._pendingAmount; }
  get currency(): string { return this._currency; }
  get dueDate(): Date | null { return this._dueDate; }
  get completedAt(): Date | null { return this._completedAt; }
  get installments(): readonly PaymentInstallment[] { return this._installments; }
  get transactions(): readonly PaymentTransaction[] { return this._transactions; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(
    props: Partial<Pick<PaymentProps, 'title' | 'description' | 'contractId' | 'deliverableId' | 'payerPersonId' | 'payerOrganizationId' | 'paymentPlan' | 'dueDate'>>,
    actorId?: string,
  ): void {
    this.ensureNotDeleted();
    if (props.title) this._title = props.title.trim();
    if (props.description !== undefined) this._description = props.description?.trim() ?? null;
    if (props.contractId !== undefined) this._contractId = props.contractId;
    if (props.deliverableId !== undefined) this._deliverableId = props.deliverableId;
    if (props.payerPersonId !== undefined) this._payerPersonId = props.payerPersonId;
    if (props.payerOrganizationId !== undefined) this._payerOrganizationId = props.payerOrganizationId;
    if (props.paymentPlan) this._paymentPlan = props.paymentPlan;
    if (props.dueDate !== undefined) this._dueDate = props.dueDate;

    this._audit = this._audit.touch(actorId);
  }

  addInstallment(installment: PaymentInstallment, actorId?: string): void {
    this.ensureNotDeleted();
    this._installments.push(installment);
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new PaymentInstallmentAddedEvent({
        paymentId: this.id,
        installmentId: installment.id,
        installmentNumber: installment.installmentNumber,
        amount: installment.amount,
        dueDate: installment.dueDate,
      }),
    );
  }

  registerTransaction(transaction: PaymentTransaction, actorId?: string): void {
    this.ensureNotDeleted();
    if (transaction.amount <= 0) {
      throw new InvalidTransactionAmountException(transaction.amount, 'Amount must be positive');
    }

    this._transactions.push(transaction);

    if (transaction.transactionType === TransactionType.PAYMENT || transaction.transactionType === TransactionType.PARTIAL_PAYMENT) {
      this._paidAmount += transaction.amount;
    } else if (transaction.transactionType === TransactionType.REFUND) {
      this._paidAmount = Math.max(0, this._paidAmount - transaction.amount);
    } else if (transaction.transactionType === TransactionType.ADJUSTMENT) {
      this._paidAmount += transaction.amount;
    }

    this._pendingAmount = Math.max(0, this._totalAmount - this._paidAmount);

    if (transaction.installmentId) {
      const inst = this._installments.find((i) => i.id === transaction.installmentId);
      if (inst) {
        inst.applyPayment(transaction.amount);
      }
    }

    if (this._paidAmount >= this._totalAmount && this._totalAmount > 0) {
      this._status = PaymentStatus.PAID;
      this._completedAt = new Date();
      this.addDomainEvent(
        new PaymentCompletedEvent({
          paymentId: this.id,
          code: this._code,
          completedAt: this._completedAt,
          actorId: actorId ?? null,
        }),
      );
    } else if (this._paidAmount > 0) {
      this._status = PaymentStatus.PARTIALLY_PAID;
    }

    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new PaymentTransactionRegisteredEvent({
        paymentId: this.id,
        transactionId: transaction.id,
        installmentId: transaction.installmentId,
        transactionType: transaction.transactionType,
        paymentMethod: transaction.paymentMethod,
        amount: transaction.amount,
        referenceNumber: transaction.referenceNumber,
        actorId: actorId ?? null,
      }),
    );
  }

  markAsOverdue(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === PaymentStatus.PENDING || this._status === PaymentStatus.PARTIALLY_PAID || this._status === PaymentStatus.DRAFT) {
      this._status = PaymentStatus.OVERDUE;
      this._audit = this._audit.touch(actorId);

      this.addDomainEvent(
        new PaymentOverdueEvent({
          paymentId: this.id,
          code: this._code,
          dueDate: this._dueDate,
        }),
      );
    }
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new PaymentAlreadyDeletedException(this.id);
    }

    this._audit = this._audit.softDelete(actorId);
    this._status = PaymentStatus.ARCHIVED;

    this.addDomainEvent(
      new PaymentArchivedEvent({
        paymentId: this.id,
        code: this._code,
        archivedAt: this._audit.deletedAt!,
        archivedBy: actorId ?? null,
      }),
    );
  }

  restore(actorId?: string): void {
    if (!this._audit.isDeleted()) return;

    this._audit = this._audit.restore(actorId);
    this._status = PaymentStatus.DRAFT;

    this.addDomainEvent(
      new PaymentRestoredEvent({
        paymentId: this.id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new PaymentAlreadyDeletedException(this.id);
    }
  }
}
