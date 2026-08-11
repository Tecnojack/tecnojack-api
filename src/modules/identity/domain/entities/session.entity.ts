import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';

export interface SessionProps {
  id?: string;
  code: string;
  userId: string;
  refreshTokenHash: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  expiresAt: Date;
  isRevoked?: boolean;
  tenantId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Session extends AggregateRoot<string> {
  private readonly _code: string;
  private readonly _userId: string;
  private _refreshTokenHash: string;
  private readonly _ipAddress: string;
  private readonly _userAgent: string;
  private readonly _deviceType: string;
  private _expiresAt: Date;
  private _isRevoked: boolean;
  private readonly _tenantId: string | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: SessionProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Session code cannot be empty.');
    }
    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error('Session userId cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._userId = props.userId;
    this._refreshTokenHash = props.refreshTokenHash;
    this._ipAddress = props.ipAddress;
    this._userAgent = props.userAgent;
    this._deviceType = props.deviceType;
    this._expiresAt = props.expiresAt;
    this._isRevoked = props.isRevoked ?? false;
    this._tenantId = props.tenantId ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get code(): string { return this._code; }
  get userId(): string { return this._userId; }
  get refreshTokenHash(): string { return this._refreshTokenHash; }
  get ipAddress(): string { return this._ipAddress; }
  get userAgent(): string { return this._userAgent; }
  get deviceType(): string { return this._deviceType; }
  get expiresAt(): Date { return this._expiresAt; }
  get isRevoked(): boolean { return this._isRevoked; }
  get tenantId(): string | null { return this._tenantId; }
  get updatedAt(): Date { return this._updatedAt; }

  revoke(): void {
    this._isRevoked = true;
    this._updatedAt = new Date();
  }

  rotate(newHash: string, newExpiration: Date): void {
    if (this._isRevoked) {
      throw new Error('Cannot rotate a revoked session.');
    }
    if (this.isExpired()) {
      throw new Error('Cannot rotate an expired session.');
    }
    this._refreshTokenHash = newHash;
    this._expiresAt = newExpiration;
    this._updatedAt = new Date();
  }

  isExpired(): boolean {
    return this._expiresAt.getTime() < Date.now();
  }
}
