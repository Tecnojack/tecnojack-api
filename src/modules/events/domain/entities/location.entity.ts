export interface LocationProps {
  id?: string;
  name: string;
  type?: string;
  addressLine?: string | null;
  city?: string | null;
  region?: string | null;
  countryCode?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  accessInstructions?: string | null;
  parkingInstructions?: string | null;
  technicalNotes?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Location {
  readonly id: string;
  private _name: string;
  private _type: string;
  private _addressLine: string | null;
  private _city: string | null;
  private _region: string | null;
  private _countryCode: string | null;
  private _postalCode: string | null;
  private _latitude: number | null;
  private _longitude: number | null;
  private _timezone: string | null;
  private _contactName: string | null;
  private _contactPhone: string | null;
  private _accessInstructions: string | null;
  private _parkingInstructions: string | null;
  private _technicalNotes: string | null;
  private _isActive: boolean;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: LocationProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Location name cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this._name = props.name.trim();
    this._type = (props.type ?? 'VENUE').trim().toUpperCase();
    this._addressLine = props.addressLine?.trim() ?? null;
    this._city = props.city?.trim() ?? null;
    this._region = props.region?.trim() ?? null;
    this._countryCode = props.countryCode?.trim().toUpperCase() ?? null;
    this._postalCode = props.postalCode?.trim() ?? null;
    this._latitude = props.latitude ?? null;
    this._longitude = props.longitude ?? null;
    this._timezone = props.timezone?.trim() ?? null;
    this._contactName = props.contactName?.trim() ?? null;
    this._contactPhone = props.contactPhone?.trim() ?? null;
    this._accessInstructions = props.accessInstructions?.trim() ?? null;
    this._parkingInstructions = props.parkingInstructions?.trim() ?? null;
    this._technicalNotes = props.technicalNotes?.trim() ?? null;
    this._isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get name(): string { return this._name; }
  get type(): string { return this._type; }
  get addressLine(): string | null { return this._addressLine; }
  get city(): string | null { return this._city; }
  get region(): string | null { return this._region; }
  get countryCode(): string | null { return this._countryCode; }
  get postalCode(): string | null { return this._postalCode; }
  get latitude(): number | null { return this._latitude; }
  get longitude(): number | null { return this._longitude; }
  get timezone(): string | null { return this._timezone; }
  get contactName(): string | null { return this._contactName; }
  get contactPhone(): string | null { return this._contactPhone; }
  get accessInstructions(): string | null { return this._accessInstructions; }
  get parkingInstructions(): string | null { return this._parkingInstructions; }
  get technicalNotes(): string | null { return this._technicalNotes; }
  get isActive(): boolean { return this._isActive; }
  get updatedAt(): Date { return this._updatedAt; }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }
}
