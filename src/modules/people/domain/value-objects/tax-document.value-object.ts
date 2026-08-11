export interface TaxDocumentProps {
  issuingCountry: string; // ISO 3166-1 alpha-2 e.g. "CO", "US"
  taxId: string;
  verificationDigit?: string | null;
}

export class TaxDocument {
  private readonly _issuingCountry: string;
  private readonly _taxId: string;
  private readonly _verificationDigit: string | null;

  constructor(props: TaxDocumentProps) {
    if (props.issuingCountry?.trim().length !== 2) {
      throw new Error('TaxDocument issuingCountry must be a valid 2-letter ISO country code.');
    }
    if (!props.taxId || props.taxId.trim().length === 0) {
      throw new Error('TaxId cannot be empty.');
    }

    this._issuingCountry = props.issuingCountry.trim().toUpperCase();
    this._taxId = props.taxId.trim().replace(/[.\s-]/g, '');
    this._verificationDigit = props.verificationDigit?.trim() ?? null;
  }

  get issuingCountry(): string {
    return this._issuingCountry;
  }

  get taxId(): string {
    return this._taxId;
  }

  get verificationDigit(): string | null {
    return this._verificationDigit;
  }

  get formattedTaxId(): string {
    if (this._verificationDigit) {
      return `${this._taxId}-${this._verificationDigit}`;
    }
    return this._taxId;
  }

  equals(other: TaxDocument): boolean {
    return (
      this._issuingCountry === other._issuingCountry &&
      this._taxId === other._taxId &&
      this._verificationDigit === other._verificationDigit
    );
  }
}
