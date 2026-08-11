import type { ContractClause } from '../value-objects/contract-clause.value-object.js';

export interface ContractVersionProps {
  id?: string;
  contractId: string;
  versionNumber: number;
  title: string;
  contentSummary?: string | null;
  clauses?: ContractClause[];
  changeReason?: string | null;
  createdAt?: Date;
  createdBy?: string | null;
}

export class ContractVersion {
  readonly id: string;
  readonly contractId: string;
  readonly versionNumber: number;
  readonly title: string;
  readonly contentSummary: string | null;
  readonly clauses: readonly ContractClause[];
  readonly changeReason: string | null;
  readonly createdAt: Date;
  readonly createdBy: string | null;

  constructor(props: ContractVersionProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('ContractVersion title cannot be empty.');
    }
    if (props.versionNumber < 1) {
      throw new Error('ContractVersion versionNumber must be >= 1.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.contractId = props.contractId;
    this.versionNumber = props.versionNumber;
    this.title = props.title.trim();
    this.contentSummary = props.contentSummary?.trim() ?? null;
    this.clauses = props.clauses ? [...props.clauses] : [];
    this.changeReason = props.changeReason?.trim() ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.createdBy = props.createdBy ?? null;
  }
}
