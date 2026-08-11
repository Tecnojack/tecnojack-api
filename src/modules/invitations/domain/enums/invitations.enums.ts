export enum InvitationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
}

export enum InvitationVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE_PASSWORD = 'PRIVATE_PASSWORD',
  GUEST_ONLY = 'GUEST_ONLY',
}

export enum RSVPStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
}
