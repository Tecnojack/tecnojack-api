import { RSVPStatus } from '../enums/invitations.enums.js';

export interface InvitationGuestProps {
  id?: string;
  personId?: string | null;
  displayName: string;
  email?: string | null;
  phone?: string | null;
  maxCompanions?: number;
  rsvpStatus?: RSVPStatus;
  confirmedCompanions?: number;
  dietaryRestrictions?: string | null;
  guestNotes?: string | null;
  companions?: string[];
  confirmedAt?: Date | null;
}

export class InvitationGuest {
  readonly id: string;
  readonly personId: string | null;
  private _displayName: string;
  private _email: string | null;
  private _phone: string | null;
  private _maxCompanions: number;
  private _rsvpStatus: RSVPStatus;
  private _confirmedCompanions: number;
  private _dietaryRestrictions: string | null;
  private _guestNotes: string | null;
  private _companions: string[];
  private _confirmedAt: Date | null;

  constructor(props: InvitationGuestProps) {
    if (!props.displayName || props.displayName.trim().length === 0) {
      throw new Error('Guest display name cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.personId = props.personId ?? null;
    this._displayName = props.displayName.trim();
    this._email = props.email?.trim() ?? null;
    this._phone = props.phone?.trim() ?? null;
    this._maxCompanions = props.maxCompanions ?? 0;
    this._rsvpStatus = props.rsvpStatus ?? RSVPStatus.PENDING;
    this._confirmedCompanions = props.confirmedCompanions ?? 0;
    this._dietaryRestrictions = props.dietaryRestrictions?.trim() ?? null;
    this._guestNotes = props.guestNotes?.trim() ?? null;
    this._companions = props.companions ? [...props.companions] : [];
    this._confirmedAt = props.confirmedAt ?? null;
  }

  get displayName(): string { return this._displayName; }
  get email(): string | null { return this._email; }
  get phone(): string | null { return this._phone; }
  get maxCompanions(): number { return this._maxCompanions; }
  get rsvpStatus(): RSVPStatus { return this._rsvpStatus; }
  get confirmedCompanions(): number { return this._confirmedCompanions; }
  get dietaryRestrictions(): string | null { return this._dietaryRestrictions; }
  get guestNotes(): string | null { return this._guestNotes; }
  get companions(): readonly string[] { return this._companions; }
  get confirmedAt(): Date | null { return this._confirmedAt; }

  confirm(companions: string[], dietaryRestrictions?: string | null, guestNotes?: string | null): void {
    if (companions.length > this._maxCompanions) {
      throw new Error(`Confirmed companions (${companions.length}) exceeds maximum limit (${this._maxCompanions}).`);
    }

    this._rsvpStatus = RSVPStatus.CONFIRMED;
    this._companions = [...companions];
    this._confirmedCompanions = companions.length;
    this._dietaryRestrictions = dietaryRestrictions?.trim() ?? null;
    this._guestNotes = guestNotes?.trim() ?? null;
    this._confirmedAt = new Date();
  }

  decline(guestNotes?: string | null): void {
    this._rsvpStatus = RSVPStatus.DECLINED;
    this._companions = [];
    this._confirmedCompanions = 0;
    this._guestNotes = guestNotes?.trim() ?? null;
    this._confirmedAt = new Date();
  }
}
