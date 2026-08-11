import type { QuotationStatus } from '../enums/crm.enums.js';

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuotationProps {
  id?: string;
  opportunityId: string;
  quotationNumber: string;
  title: string;
  subtotalAmount: number;
  taxAmount?: number;
  totalAmount: number;
  status?: QuotationStatus;
  validUntil?: Date | null;
  items?: QuotationItem[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
}

export class Quotation {
  readonly id: string;
  readonly opportunityId: string;
  readonly quotationNumber: string;
  private _title: string;
  private _subtotalAmount: number;
  private _taxAmount: number;
  private _totalAmount: number;
  private _status: QuotationStatus;
  private _validUntil: Date | null;
  private _items: QuotationItem[];
  readonly createdAt: Date;
  private _updatedAt: Date;
  readonly createdBy: string | null;

  constructor(props: QuotationProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.opportunityId = props.opportunityId;
    this.quotationNumber = props.quotationNumber;
    this._title = props.title.trim();
    this._subtotalAmount = props.subtotalAmount;
    this._taxAmount = props.taxAmount ?? 0;
    this._totalAmount = props.totalAmount;
    this._status = props.status ?? ('DRAFT' as QuotationStatus);
    this._validUntil = props.validUntil ?? null;
    this._items = props.items ? [...props.items] : [];
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this.createdBy = props.createdBy ?? null;
  }

  get title(): string { return this._title; }
  get subtotalAmount(): number { return this._subtotalAmount; }
  get taxAmount(): number { return this._taxAmount; }
  get totalAmount(): number { return this._totalAmount; }
  get status(): QuotationStatus { return this._status; }
  get validUntil(): Date | null { return this._validUntil; }
  get items(): readonly QuotationItem[] { return this._items; }
  get updatedAt(): Date { return this._updatedAt; }

  approve(): QuotationStatus {
    const prev = this._status;
    this._status = 'APPROVED' as QuotationStatus;
    this._updatedAt = new Date();
    return prev;
  }

  reject(): QuotationStatus {
    const prev = this._status;
    this._status = 'REJECTED' as QuotationStatus;
    this._updatedAt = new Date();
    return prev;
  }

  send(): QuotationStatus {
    const prev = this._status;
    this._status = 'SENT' as QuotationStatus;
    this._updatedAt = new Date();
    return prev;
  }
}
