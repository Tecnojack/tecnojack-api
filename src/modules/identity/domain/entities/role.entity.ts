import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';

export interface RoleProps {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  permissionIds?: string[];
  tenantId?: string | null;
  audit?: AuditInfo;
}

export class Role extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _name: string;
  private _description: string | null;
  private _permissionIds: string[];
  private readonly _tenantId: string | null;
  private _audit: AuditInfo;

  constructor(props: RoleProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Role code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Role name cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._name = props.name.trim();
    this._description = props.description?.trim() ?? null;
    this._permissionIds = props.permissionIds ? [...props.permissionIds] : [];
    this._tenantId = props.tenantId ?? null;
    this._audit = props.audit ?? AuditInfo.create();
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get permissionIds(): readonly string[] { return this._permissionIds; }
  get tenantId(): string | null { return this._tenantId; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(name: string, description?: string | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._name = name.trim();
    this._description = description?.trim() ?? null;
    this._audit = this._audit.touch(actorId);
  }

  grantPermission(permissionId: string, actorId?: string): void {
    this.ensureNotDeleted();
    if (!this._permissionIds.includes(permissionId)) {
      this._permissionIds.push(permissionId);
      this._audit = this._audit.touch(actorId);
    }
  }

  revokePermission(permissionId: string, actorId?: string): void {
    this.ensureNotDeleted();
    const idx = this._permissionIds.indexOf(permissionId);
    if (idx !== -1) {
      this._permissionIds.splice(idx, 1);
      this._audit = this._audit.touch(actorId);
    }
  }

  softDelete(actorId?: string): void {
    this._audit = this._audit.softDelete(actorId);
  }

  restore(actorId?: string): void {
    this._audit = this._audit.restore(actorId);
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new Error('Role is deleted.');
    }
  }
}
