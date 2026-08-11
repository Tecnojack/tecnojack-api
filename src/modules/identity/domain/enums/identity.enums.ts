export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  LOCKED = 'LOCKED',
  UNVERIFIED = 'UNVERIFIED',
}

export enum AuthProviderType {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  MICROSOFT = 'MICROSOFT',
  GITHUB = 'GITHUB',
  APPLE = 'APPLE',
  LDAP = 'LDAP',
  SAML = 'SAML',
}

export enum PolicyEffect {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}
