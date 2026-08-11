import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import { PolicyEffect } from '../enums/identity.enums.js';

export interface PolicyCondition {
  field: string; // e.g. "userId", "tenantId"
  operator: 'EQUALS' | 'CONTAINS';
  value: string; // e.g. "resource.ownerId"
}

export interface PolicyRule {
  effect: PolicyEffect;
  resourcePattern: string; // e.g. "galleries:*"
  actionPattern: string; // e.g. "write"
  conditions: PolicyCondition[];
}

export interface PolicyProps {
  id?: string;
  code: string;
  name: string;
  rules?: PolicyRule[];
  tenantId?: string | null;
  audit?: AuditInfo;
}

export class Policy extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _name: string;
  private _rules: PolicyRule[];
  private readonly _tenantId: string | null;
  private _audit: AuditInfo;

  constructor(props: PolicyProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Policy code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Policy name cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._name = props.name.trim();
    this._rules = props.rules ? [...props.rules] : [];
    this._tenantId = props.tenantId ?? null;
    this._audit = props.audit ?? AuditInfo.create();
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get rules(): readonly PolicyRule[] { return this._rules; }
  get tenantId(): string | null { return this._tenantId; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(name: string, rules: PolicyRule[], actorId?: string): void {
    this.ensureNotDeleted();
    this._name = name.trim();
    this._rules = [...rules];
    this._audit = this._audit.touch(actorId);
  }

  evaluate(context: { userClaims: Record<string, string>; resourceAttributes: Record<string, string> }): boolean {
    // ABAC dynamic evaluation matching rule patterns and conditions
    let hasAllow = false;

    for (const rule of this._rules) {
      // Evaluate rule conditions
      let conditionsMatch = true;
      for (const cond of rule.conditions) {
        const userValue = context.userClaims[cond.field];
        let targetValue = cond.value;

        if (cond.value.startsWith('resource.')) {
          const attributeKey = cond.value.substring('resource.'.length);
          targetValue = context.resourceAttributes[attributeKey] ?? '';
        }

        if (cond.operator === 'EQUALS' && userValue !== targetValue) {
          conditionsMatch = false;
          break;
        }
        if (cond.operator === 'CONTAINS' && !userValue?.includes(targetValue)) {
          conditionsMatch = false;
          break;
        }
      }

      if (conditionsMatch) {
        if (rule.effect === PolicyEffect.DENY) {
          return false; // Deny takes precedence
        }
        if (rule.effect === PolicyEffect.ALLOW) {
          hasAllow = true;
        }
      }
    }

    return hasAllow;
  }

  softDelete(actorId?: string): void {
    this._audit = this._audit.softDelete(actorId);
  }

  restore(actorId?: string): void {
    this._audit = this._audit.restore(actorId);
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new Error('Policy is deleted.');
    }
  }
}
