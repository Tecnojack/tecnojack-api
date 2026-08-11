export interface AuditInfoProps {
  createdAt?: Date;
  createdBy?: string | null;
  updatedAt?: Date;
  updatedBy?: string | null;
  deletedAt?: Date | null;
  deletedBy?: string | null;
}

export class AuditInfo {
  private readonly _createdAt: Date;
  private readonly _createdBy: string | null;
  private _updatedAt: Date;
  private _updatedBy: string | null;
  private _deletedAt: Date | null;
  private _deletedBy: string | null;

  constructor(props: AuditInfoProps = {}) {
    const now = new Date();
    this._createdAt = props.createdAt ?? now;
    this._createdBy = props.createdBy ?? null;
    this._updatedAt = props.updatedAt ?? this._createdAt;
    this._updatedBy = props.updatedBy ?? this._createdBy;
    this._deletedAt = props.deletedAt ?? null;
    this._deletedBy = props.deletedBy ?? null;
  }

  static create(actorId?: string): AuditInfo {
    const now = new Date();
    return new AuditInfo({
      createdAt: now,
      createdBy: actorId ?? null,
      updatedAt: now,
      updatedBy: actorId ?? null,
      deletedAt: null,
      deletedBy: null,
    });
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get createdBy(): string | null {
    return this._createdBy;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get updatedBy(): string | null {
    return this._updatedBy;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get deletedBy(): string | null {
    return this._deletedBy;
  }

  isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  touch(actorId?: string): AuditInfo {
    return new AuditInfo({
      createdAt: this._createdAt,
      createdBy: this._createdBy,
      updatedAt: new Date(),
      updatedBy: actorId ?? this._updatedBy,
      deletedAt: this._deletedAt,
      deletedBy: this._deletedBy,
    });
  }

  softDelete(actorId?: string): AuditInfo {
    const now = new Date();
    return new AuditInfo({
      createdAt: this._createdAt,
      createdBy: this._createdBy,
      updatedAt: now,
      updatedBy: actorId ?? this._updatedBy,
      deletedAt: now,
      deletedBy: actorId ?? null,
    });
  }

  restore(actorId?: string): AuditInfo {
    return new AuditInfo({
      createdAt: this._createdAt,
      createdBy: this._createdBy,
      updatedAt: new Date(),
      updatedBy: actorId ?? this._updatedBy,
      deletedAt: null,
      deletedBy: null,
    });
  }
}
