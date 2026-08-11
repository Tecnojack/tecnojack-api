import { BaseDomainEvent } from '../../../../platform/domain/events/base-domain-event.js';

export interface UserCreatedPayload {
  userId: string;
  code: string;
  email: string;
}

export class UserCreatedEvent extends BaseDomainEvent<UserCreatedPayload> {
  constructor(payload: UserCreatedPayload) {
    super('identity.user_created', payload.userId, payload);
  }
}

export interface SessionStartedPayload {
  sessionId: string;
  userId: string;
  ipAddress: string;
}

export class SessionStartedEvent extends BaseDomainEvent<SessionStartedPayload> {
  constructor(payload: SessionStartedPayload) {
    super('identity.session_started', payload.sessionId, payload);
  }
}

export interface SessionRevokedPayload {
  sessionId: string;
  userId: string;
}

export class SessionRevokedEvent extends BaseDomainEvent<SessionRevokedPayload> {
  constructor(payload: SessionRevokedPayload) {
    super('identity.session_revoked', payload.sessionId, payload);
  }
}

export interface APIKeyIssuedPayload {
  keyId: string;
  userId: string;
}

export class APIKeyIssuedEvent extends BaseDomainEvent<APIKeyIssuedPayload> {
  constructor(payload: APIKeyIssuedPayload) {
    super('identity.api_key_issued', payload.keyId, payload);
  }
}
