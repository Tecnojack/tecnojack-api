import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../../../domain/enums/identity.enums.js';
import type { User } from '../../../domain/entities/user.entity.js';
import type { Role } from '../../../domain/entities/role.entity.js';
import type { Permission } from '../../../domain/entities/permission.entity.js';
import type { Policy } from '../../../domain/entities/policy.entity.js';
import type { Session } from '../../../domain/entities/session.entity.js';
import type { APIKey } from '../../../domain/entities/api-key.entity.js';
import type { Claim } from '../../../domain/value-objects/claim.value-object.js';

export class ClaimResponseDto {
  @ApiProperty() name!: string;
  @ApiProperty() value!: string;
}

export class UserResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() email!: string;
  @ApiProperty({ enum: UserStatus }) status!: UserStatus;
  @ApiProperty() isEmailVerified!: boolean;
  @ApiProperty({ type: [String] }) roleIds!: string[];
  @ApiProperty({ type: [ClaimResponseDto] }) claims!: ClaimResponseDto[];
  @ApiPropertyOptional() tenantId?: string | null;
  @ApiProperty() createdAt!: Date;

  static fromDomain(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.code = user.code;
    dto.email = user.email;
    dto.status = user.status;
    dto.isEmailVerified = user.isEmailVerified;
    dto.roleIds = [...user.roleIds];
    dto.claims = user.claims.map((c: Claim) => ({ name: c.name, value: c.value }));
    dto.tenantId = user.tenantId;
    dto.createdAt = user.audit.createdAt;
    return dto;
  }
}

export class TokenResponseDto {
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
  @ApiProperty() expiresInSeconds!: number;
}

export class RoleResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty({ type: [String] }) permissionIds!: string[];

  static fromDomain(role: Role): RoleResponseDto {
    const dto = new RoleResponseDto();
    dto.id = role.id;
    dto.code = role.code;
    dto.name = role.name;
    dto.description = role.description;
    dto.permissionIds = [...role.permissionIds];
    return dto;
  }
}

export class PermissionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() resource!: string;
  @ApiProperty() action!: string;
  @ApiProperty() description!: string;

  static fromDomain(perm: Permission): PermissionResponseDto {
    const dto = new PermissionResponseDto();
    dto.id = perm.id;
    dto.code = perm.code;
    dto.resource = perm.resource;
    dto.action = perm.action;
    dto.description = perm.description;
    return dto;
  }
}

export class PolicyResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiProperty() rules!: unknown[];

  static fromDomain(pol: Policy): PolicyResponseDto {
    const dto = new PolicyResponseDto();
    dto.id = pol.id;
    dto.code = pol.code;
    dto.name = pol.name;
    dto.rules = [...pol.rules];
    return dto;
  }
}

export class SessionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() userId!: string;
  @ApiProperty() ipAddress!: string;
  @ApiProperty() userAgent!: string;
  @ApiProperty() deviceType!: string;
  @ApiProperty() expiresAt!: Date;
  @ApiProperty() isRevoked!: boolean;

  static fromDomain(sess: Session): SessionResponseDto {
    const dto = new SessionResponseDto();
    dto.id = sess.id;
    dto.code = sess.code;
    dto.userId = sess.userId;
    dto.ipAddress = sess.ipAddress;
    dto.userAgent = sess.userAgent;
    dto.deviceType = sess.deviceType;
    dto.expiresAt = sess.expiresAt;
    dto.isRevoked = sess.isRevoked;
    return dto;
  }
}

export class APIKeyResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() userId!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ type: [String] }) scopes!: string[];
  @ApiProperty() expiresAt!: Date;
  @ApiProperty() isActive!: boolean;

  static fromDomain(key: APIKey): APIKeyResponseDto {
    const dto = new APIKeyResponseDto();
    dto.id = key.id;
    dto.code = key.code;
    dto.userId = key.userId;
    dto.name = key.name;
    dto.scopes = [...key.scopes];
    dto.expiresAt = key.expiresAt;
    dto.isActive = key.isActive;
    return dto;
  }
}
