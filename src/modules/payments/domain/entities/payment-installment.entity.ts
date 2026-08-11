import { InstallmentStatus } from '../enums/payments.enums.js';

export interface PaymentInstallmentProps {
  id?: string;
  paymentId: string;
  installmentNumber: number;
  title: string;
  amount: number;
  paidAmount?: number;
  status?: InstallmentStatus;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PaymentInstallment {
  readonly id: string;
  readonly paymentId: string;
  readonly installmentNumber: number;
  readonly title: string;
  readonly amount: number;
  private _paidAmount: number;
  private _status: InstallmentStatus;
  readonly dueDate: Date;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PaymentInstallmentProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('PaymentInstallment title cannot be empty.');
    }
    if (props.amount <= 0) {
      throw new Error('PaymentInstallment amount must be > 0.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.paymentId = props.paymentId;
    this.installmentNumber = props.installmentNumber;
    this.title = props.title.trim();
    this.amount = props.amount;
    this._paidAmount = props.paidAmount ?? 0;
    this._status = props.status ?? InstallmentStatus.PENDING;
    this.dueDate = props.dueDate;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get paidAmount(): number { return this._paidAmount; }
  get status(): InstallmentStatus { return this._status; }
  get updatedAt(): Date { return this._updatedAt; }

  applyPayment(amount: number): void {
    if (amount <= 0) return;
    this._paidAmount += amount;

    if (this._paidAmount >= this.amount) {
      this._status = InstallmentStatus.PAID;
    } else {
      this._status = InstallmentStatus.PARTIALLY_PAID;
    }
    this._updatedAt = new Date();
  }

  markOverdue(): void {
    if (this._status === InstallmentStatus.PENDING || this._status === InstallmentStatus.PARTIALLY_PAID) {
      this._status = InstallmentStatus.OVERDUE;
      this._updatedAt = new Date();
    }
  }
}
