export interface AddressProps {
  countryCode: string; // ISO 3166-1 alpha-2 e.g. "CO", "US"
  addressLine1: string;
  addressLine2?: string | null;
  locality: string; // City / Town / District
  region?: string | null; // State / Province / Department
  postalCode?: string | null;
  formattedAddress?: string | null;
}

export class Address {
  private readonly _countryCode: string;
  private readonly _addressLine1: string;
  private readonly _addressLine2: string | null;
  private readonly _locality: string;
  private readonly _region: string | null;
  private readonly _postalCode: string | null;
  private readonly _formattedAddress: string | null;

  constructor(props: AddressProps) {
    if (props.countryCode?.trim().length !== 2) {
      throw new Error('Address countryCode must be a valid 2-letter ISO country code.');
    }
    if (!props.addressLine1 || props.addressLine1.trim().length === 0) {
      throw new Error('Address addressLine1 cannot be empty.');
    }
    if (!props.locality || props.locality.trim().length === 0) {
      throw new Error('Address locality cannot be empty.');
    }

    this._countryCode = props.countryCode.trim().toUpperCase();
    this._addressLine1 = props.addressLine1.trim();
    this._addressLine2 = props.addressLine2?.trim() ?? null;
    this._locality = props.locality.trim();
    this._region = props.region?.trim() ?? null;
    this._postalCode = props.postalCode?.trim() ?? null;

    if (props.formattedAddress && props.formattedAddress.trim().length > 0) {
      this._formattedAddress = props.formattedAddress.trim();
    } else {
      const parts = [
        this._addressLine1,
        this._addressLine2,
        this._locality,
        this._region,
        this._postalCode,
        this._countryCode,
      ].filter((p): p is string => Boolean(p && p.length > 0));
      this._formattedAddress = parts.join(', ');
    }
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get addressLine1(): string {
    return this._addressLine1;
  }

  get addressLine2(): string | null {
    return this._addressLine2;
  }

  get locality(): string {
    return this._locality;
  }

  get region(): string | null {
    return this._region;
  }

  get postalCode(): string | null {
    return this._postalCode;
  }

  get formattedAddress(): string | null {
    return this._formattedAddress;
  }
}
