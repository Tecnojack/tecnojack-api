import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';

export interface PermissionProps {
  id?: string;
  code: string;
  resource: string;
  action: string;
  description: string;
}

export class Permission extends AggregateRoot<string> {
  private readonly _code: string;
  private readonly _resource: string;
  private readonly _action: string;
  private readonly _description: string;

  constructor(props: PermissionProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Permission code cannot be empty.');
    }
    if (!props.resource || props.resource.trim().length === 0) {
      throw new Error('Permission resource cannot be empty.');
    }
    if (!props.action || props.action.trim().length === 0) {
      throw new Error('Permission action cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._resource = props.resource.trim().toLowerCase();
    this._action = props.action.trim().toLowerCase();
    this._description = props.description.trim();
  }

  get code(): string { return this._code; }
  get resource(): string { return this._resource; }
  get action(): string { return this._action; }
  get description(): string { return this._description; }
}
