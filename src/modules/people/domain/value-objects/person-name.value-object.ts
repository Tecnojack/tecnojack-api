export interface PersonNameProps {
  givenNames: string;
  familyNames?: string | null;
  displayName?: string | null;
  prefix?: string | null;
  suffix?: string | null;
}

export class PersonName {
  private readonly _givenNames: string;
  private readonly _familyNames: string | null;
  private readonly _displayName: string;
  private readonly _prefix: string | null;
  private readonly _suffix: string | null;

  constructor(props: PersonNameProps) {
    if (!props.givenNames || props.givenNames.trim().length === 0) {
      throw new Error('Person givenNames cannot be empty.');
    }

    this._givenNames = props.givenNames.trim();
    this._familyNames = props.familyNames?.trim() ?? null;
    this._prefix = props.prefix?.trim() ?? null;
    this._suffix = props.suffix?.trim() ?? null;

    if (props.displayName && props.displayName.trim().length > 0) {
      this._displayName = props.displayName.trim();
    } else {
      const parts = [
        this._prefix,
        this._givenNames,
        this._familyNames,
        this._suffix,
      ].filter((p): p is string => Boolean(p && p.length > 0));
      this._displayName = parts.join(' ');
    }
  }

  get givenNames(): string {
    return this._givenNames;
  }

  get familyNames(): string | null {
    return this._familyNames;
  }

  get displayName(): string {
    return this._displayName;
  }

  get prefix(): string | null {
    return this._prefix;
  }

  get suffix(): string | null {
    return this._suffix;
  }
}
