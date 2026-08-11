import type { AuthProviderType } from '../enums/identity.enums.js';

export interface AuthProviderProps {
  providerType: AuthProviderType;
  externalId: string;
  metadata?: Record<string, string>;
}

export class AuthProvider {
  readonly providerType: AuthProviderType;
  readonly externalId: string;
  readonly metadata: Record<string, string>;

  constructor(props: AuthProviderProps) {
    if (!props.externalId || props.externalId.trim().length === 0) {
      throw new Error('External ID cannot be empty.');
    }
    this.providerType = props.providerType;
    this.externalId = props.externalId.trim();
    this.metadata = props.metadata ? { ...props.metadata } : {};
  }
}
