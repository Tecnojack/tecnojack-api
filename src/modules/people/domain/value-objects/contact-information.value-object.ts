import { ContactType } from '../enums/people.enums.js';

export interface ContactInformationProps {
  id?: string;
  type: ContactType;
  value: string;
  label?: string | null;
  isPrimary?: boolean;
}

export class ContactInformation {
  private readonly _id: string | null;
  private readonly _type: ContactType;
  private readonly _value: string;
  private readonly _label: string | null;
  private readonly _isPrimary: boolean;

  constructor(props: ContactInformationProps) {
    if (!props.value || props.value.trim().length === 0) {
      throw new Error('ContactInformation value cannot be empty.');
    }

    this._id = props.id ?? null;
    this._type = props.type;
    this._label = props.label?.trim() ?? null;
    this._isPrimary = props.isPrimary ?? false;

    if (this._type === ContactType.EMAIL) {
      this._value = props.value.trim().toLowerCase();
    } else {
      this._value = props.value.trim();
    }
  }

  get id(): string | null {
    return this._id;
  }

  get type(): ContactType {
    return this._type;
  }

  get value(): string {
    return this._value;
  }

  get label(): string | null {
    return this._label;
  }

  get isPrimary(): boolean {
    return this._isPrimary;
  }

  equals(other: ContactInformation): boolean {
    return this._type === other._type && this._value === other._value;
  }
}
