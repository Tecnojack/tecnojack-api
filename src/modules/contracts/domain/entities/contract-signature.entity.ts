import { SignatureStatus } from '../enums/contracts.enums.js';

export interface ContractSignatureProps {
  id?: string;
  contractId: string;
  partyId: string;
  status?: SignatureStatus;
  signerName?: string | null;
  signerEmail?: string | null;
  signatureProvider?: string | null;
  externalEnvelopeId?: string | null;
  signedAt?: Date | null;
  ipAddress?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContractSignature {
  readonly id: string;
  readonly contractId: string;
  readonly partyId: string;
  private _status: SignatureStatus;
  private _signerName: string | null;
  private _signerEmail: string | null;
  private _signatureProvider: string | null;
  private _externalEnvelopeId: string | null;
  private _signedAt: Date | null;
  private _ipAddress: string | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ContractSignatureProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.contractId = props.contractId;
    this.partyId = props.partyId;
    this._status = props.status ?? SignatureStatus.PENDING;
    this._signerName = props.signerName?.trim() ?? null;
    this._signerEmail = props.signerEmail?.trim() ?? null;
    this._signatureProvider = props.signatureProvider?.trim() ?? null;
    this._externalEnvelopeId = props.externalEnvelopeId?.trim() ?? null;
    this._signedAt = props.signedAt ?? null;
    this._ipAddress = props.ipAddress?.trim() ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get status(): SignatureStatus { return this._status; }
  get signerName(): string | null { return this._signerName; }
  get signerEmail(): string | null { return this._signerEmail; }
  get signatureProvider(): string | null { return this._signatureProvider; }
  get externalEnvelopeId(): string | null { return this._externalEnvelopeId; }
  get signedAt(): Date | null { return this._signedAt; }
  get ipAddress(): string | null { return this._ipAddress; }
  get updatedAt(): Date { return this._updatedAt; }

  recordSignature(signerName: string, signerEmail?: string, ipAddress?: string): void {
    this._status = SignatureStatus.SIGNED;
    this._signerName = signerName.trim();
    if (signerEmail) this._signerEmail = signerEmail.trim();
    if (ipAddress) this._ipAddress = ipAddress.trim();
    this._signedAt = new Date();
    this._updatedAt = new Date();
  }
}
