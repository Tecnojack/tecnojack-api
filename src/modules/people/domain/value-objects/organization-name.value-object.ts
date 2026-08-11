export interface OrganizationNameProps {
  legalName: string;
  tradeName?: string | null;
}

export class OrganizationName {
  private readonly _legalName: string;
  private readonly _tradeName: string | null;

  constructor(props: OrganizationNameProps) {
    if (!props.legalName || props.legalName.trim().length === 0) {
      throw new Error('Organization legalName cannot be empty.');
    }

    this._legalName = props.legalName.trim();
    this._tradeName = props.tradeName?.trim() ?? null;
  }

  get legalName(): string {
    return this._legalName;
  }

  get tradeName(): string | null {
    return this._tradeName;
  }

  get displayName(): string {
    return this._tradeName ?? this._legalName;
  }
}
