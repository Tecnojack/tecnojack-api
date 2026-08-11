import type { DocumentType } from '../enums/people.enums.js';

export interface DocumentProps {
  issuingCountry: string; // ISO 3166-1 alpha-2 e.g. "CO", "US"
  type: DocumentType;
  number: string;
  formattedNumber?: string | null;
}

export class Document {
  private readonly _issuingCountry: string;
  private readonly _type: DocumentType;
  private readonly _number: string;
  private readonly _formattedNumber: string | null;

  constructor(props: DocumentProps) {
    if (props.issuingCountry?.trim().length !== 2) {
      throw new Error('issuingCountry must be a valid 2-letter ISO 3166-1 alpha-2 code.');
    }
    if (!props.number || props.number.trim().length === 0) {
      throw new Error('Document number cannot be empty.');
    }

    this._issuingCountry = props.issuingCountry.trim().toUpperCase();
    this._type = props.type;
    // Normalize number by removing dots, spaces, dashes for clean index comparison
    this._number = props.number.trim().replace(/[.\s-]/g, '');
    this._formattedNumber = props.formattedNumber?.trim() ?? props.number.trim();
  }

  get issuingCountry(): string {
    return this._issuingCountry;
  }

  get type(): DocumentType {
    return this._type;
  }

  get number(): string {
    return this._number;
  }

  get formattedNumber(): string | null {
    return this._formattedNumber;
  }

  equals(other: Document): boolean {
    return (
      this._issuingCountry === other._issuingCountry &&
      this._type === other._type &&
      this._number === other._number
    );
  }
}
