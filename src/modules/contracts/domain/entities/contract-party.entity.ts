import type { ContractPartyRole } from '../enums/contracts.enums.js';

export interface ContractPartyProps {
  id?: string;
  contractId: string;
  personId?: string | null;
  organizationId?: string | null;
  role: ContractPartyRole;
  isPrimary?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContractParty {
  readonly id: string;
  readonly contractId: string;
  readonly personId: string | null;
  readonly organizationId: string | null;
  readonly role: ContractPartyRole;
  readonly isPrimary: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ContractPartyProps) {
    if (!props.personId && !props.organizationId) {
      throw new Error('ContractParty must have either a personId or organizationId.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.contractId = props.contractId;
    this.personId = props.personId ?? null;
    this.organizationId = props.organizationId ?? null;
    this.role = props.role;
    this.isPrimary = props.isPrimary ?? false;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
