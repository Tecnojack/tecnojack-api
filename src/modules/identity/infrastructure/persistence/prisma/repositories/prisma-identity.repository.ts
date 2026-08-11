import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { User } from '../../../../domain/entities/user.entity.js';
import { Role } from '../../../../domain/entities/role.entity.js';
import { Permission } from '../../../../domain/entities/permission.entity.js';
import { Policy, type PolicyRule } from '../../../../domain/entities/policy.entity.js';
import { Session } from '../../../../domain/entities/session.entity.js';
import { APIKey } from '../../../../domain/entities/api-key.entity.js';
import type {
  IdentityRepositoryPort,
  ListUsersFilter,
} from '../../../../application/ports/identity.repository.port.js';
import type { PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import { UserStatus, AuthProviderType } from '../../../../domain/enums/identity.enums.js';
import { PasswordHash } from '../../../../domain/value-objects/password-hash.value-object.js';
import { Claim } from '../../../../domain/value-objects/claim.value-object.js';
import { AuthProvider } from '../../../../domain/value-objects/auth-provider.value-object.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';
import type {
  UserModel as PrismaUser,
  RoleModel as PrismaRole,
  PermissionModel as PrismaPermission,
  PolicyModel as PrismaPolicy,
  SessionModel as PrismaSession,
  APIKeyModel as PrismaAPIKey,
} from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaIdentityRepository implements IdentityRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  // User
  async saveUser(user: User): Promise<User> {
    const raw = await this.prisma.userModel.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        code: user.code,
        email: user.email,
        passwordHash: user.passwordHash.value,
        status: user.status as string as never,
        isEmailVerified: user.isEmailVerified,
        roleIds: [...user.roleIds],
        claimsJson: JSON.stringify(user.claims.map((c: Claim) => ({ name: c.name, value: c.value }))),
        providersJson: JSON.stringify(user.providers.map((p: AuthProvider) => ({ providerType: p.providerType, externalId: p.externalId, metadata: p.metadata }))),
        tenantId: user.tenantId,
        createdAt: user.audit.createdAt,
        createdBy: user.audit.createdBy,
        updatedAt: user.audit.updatedAt,
        updatedBy: user.audit.updatedBy,
        deletedAt: user.audit.deletedAt,
        deletedBy: user.audit.deletedBy,
      },
      update: {
        passwordHash: user.passwordHash.value,
        status: user.status as string as never,
        isEmailVerified: user.isEmailVerified,
        roleIds: [...user.roleIds],
        claimsJson: JSON.stringify(user.claims.map((c: Claim) => ({ name: c.name, value: c.value }))),
        providersJson: JSON.stringify(user.providers.map((p: AuthProvider) => ({ providerType: p.providerType, externalId: p.externalId, metadata: p.metadata }))),
        updatedAt: user.audit.updatedAt,
        updatedBy: user.audit.updatedBy,
        deletedAt: user.audit.deletedAt,
        deletedBy: user.audit.deletedBy,
      },
    });
    return this.toUserDomain(raw);
  }

  async findUserById(id: string): Promise<User | null> {
    const raw = await this.prisma.userModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toUserDomain(raw);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.userModel.findUnique({ where: { email: email.toLowerCase() } });
    if (!raw) return null;
    return this.toUserDomain(raw);
  }

  async findUserByCode(code: string): Promise<User | null> {
    const raw = await this.prisma.userModel.findUnique({ where: { code: code.toUpperCase() } });
    if (!raw) return null;
    return this.toUserDomain(raw);
  }

  async findAllUsers(filter: ListUsersFilter): Promise<PaginatedResult<User>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR = query
      ? [
          { email: { contains: query, mode: 'insensitive' as const } },
          { code: { contains: query, mode: 'insensitive' as const } },
        ]
      : undefined;

    const where = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(OR ? { OR } : {}),
    };

    const total = await this.prisma.userModel.count({ where });
    const records = await this.prisma.userModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: records.map((r) => this.toUserDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextUserCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('USR');
  }

  // Role
  async saveRole(role: Role): Promise<Role> {
    const raw = await this.prisma.roleModel.upsert({
      where: { id: role.id },
      create: {
        id: role.id,
        code: role.code,
        name: role.name,
        description: role.description,
        permissionIds: [...role.permissionIds],
        tenantId: role.tenantId,
        createdAt: role.audit.createdAt,
        createdBy: role.audit.createdBy,
        updatedAt: role.audit.updatedAt,
        updatedBy: role.audit.updatedBy,
        deletedAt: role.audit.deletedAt,
        deletedBy: role.audit.deletedBy,
      },
      update: {
        name: role.name,
        description: role.description,
        permissionIds: [...role.permissionIds],
        updatedAt: role.audit.updatedAt,
        updatedBy: role.audit.updatedBy,
        deletedAt: role.audit.deletedAt,
        deletedBy: role.audit.deletedBy,
      },
    });
    return this.toRoleDomain(raw);
  }

  async findRoleById(id: string): Promise<Role | null> {
    const raw = await this.prisma.roleModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toRoleDomain(raw);
  }

  async findRoleByName(name: string): Promise<Role | null> {
    const raw = await this.prisma.roleModel.findUnique({ where: { name } });
    if (!raw) return null;
    return this.toRoleDomain(raw);
  }

  async findRoleByCode(code: string): Promise<Role | null> {
    const raw = await this.prisma.roleModel.findUnique({ where: { code: code.toUpperCase() } });
    if (!raw) return null;
    return this.toRoleDomain(raw);
  }

  async findAllRoles(): Promise<Role[]> {
    const records = await this.prisma.roleModel.findMany({ where: { deletedAt: null } });
    return records.map((r) => this.toRoleDomain(r));
  }

  async nextRoleCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('ROL');
  }

  // Permission
  async savePermission(permission: Permission): Promise<Permission> {
    const raw = await this.prisma.permissionModel.upsert({
      where: { id: permission.id },
      create: {
        id: permission.id,
        code: permission.code,
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
      },
      update: {
        description: permission.description,
      },
    });
    return this.toPermissionDomain(raw);
  }

  async findPermissionById(id: string): Promise<Permission | null> {
    const raw = await this.prisma.permissionModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toPermissionDomain(raw);
  }

  async findPermissionByResourceAndAction(resource: string, action: string): Promise<Permission | null> {
    const raw = await this.prisma.permissionModel.findUnique({
      where: {
        resource_action: {
          resource: resource.toLowerCase(),
          action: action.toLowerCase(),
        },
      },
    });
    if (!raw) return null;
    return this.toPermissionDomain(raw);
  }

  async findAllPermissions(): Promise<Permission[]> {
    const records = await this.prisma.permissionModel.findMany();
    return records.map((r) => this.toPermissionDomain(r));
  }

  async nextPermissionCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('PRM');
  }

  // Policy
  async savePolicy(policy: Policy): Promise<Policy> {
    const raw = await this.prisma.policyModel.upsert({
      where: { id: policy.id },
      create: {
        id: policy.id,
        code: policy.code,
        name: policy.name,
        rulesJson: JSON.stringify(policy.rules),
        tenantId: policy.tenantId,
        createdAt: policy.audit.createdAt,
        createdBy: policy.audit.createdBy,
        updatedAt: policy.audit.updatedAt,
        updatedBy: policy.audit.updatedBy,
        deletedAt: policy.audit.deletedAt,
        deletedBy: policy.audit.deletedBy,
      },
      update: {
        name: policy.name,
        rulesJson: JSON.stringify(policy.rules),
        updatedAt: policy.audit.updatedAt,
        updatedBy: policy.audit.updatedBy,
        deletedAt: policy.audit.deletedAt,
        deletedBy: policy.audit.deletedBy,
      },
    });
    return this.toPolicyDomain(raw);
  }

  async findPolicyById(id: string): Promise<Policy | null> {
    const raw = await this.prisma.policyModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toPolicyDomain(raw);
  }

  async findPolicyByCode(code: string): Promise<Policy | null> {
    const raw = await this.prisma.policyModel.findUnique({ where: { code: code.toUpperCase() } });
    if (!raw) return null;
    return this.toPolicyDomain(raw);
  }

  async findAllPolicies(): Promise<Policy[]> {
    const records = await this.prisma.policyModel.findMany({ where: { deletedAt: null } });
    return records.map((r) => this.toPolicyDomain(r));
  }

  async nextPolicyCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('POL');
  }

  // Session
  async saveSession(session: Session): Promise<Session> {
    const raw = await this.prisma.sessionModel.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        code: session.code,
        userId: session.userId,
        refreshTokenHash: session.refreshTokenHash,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        deviceType: session.deviceType,
        expiresAt: session.expiresAt,
        isRevoked: session.isRevoked,
        tenantId: session.tenantId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      update: {
        refreshTokenHash: session.refreshTokenHash,
        expiresAt: session.expiresAt,
        isRevoked: session.isRevoked,
        updatedAt: session.updatedAt,
      },
    });
    return this.toSessionDomain(raw);
  }

  async findSessionById(id: string): Promise<Session | null> {
    const raw = await this.prisma.sessionModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toSessionDomain(raw);
  }

  async findSessionByRefreshTokenHash(hash: string): Promise<Session | null> {
    const raw = await this.prisma.sessionModel.findUnique({ where: { refreshTokenHash: hash } });
    if (!raw) return null;
    return this.toSessionDomain(raw);
  }

  async findSessionsByUserId(userId: string): Promise<Session[]> {
    const records = await this.prisma.sessionModel.findMany({ where: { userId } });
    return records.map((r) => this.toSessionDomain(r));
  }

  async nextSessionCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('SES');
  }

  async saveAPIKey(apiKey: APIKey): Promise<APIKey> {
    const raw = await this.prisma.aPIKeyModel.upsert({
      where: { id: apiKey.id },
      create: {
        id: apiKey.id,
        code: apiKey.code,
        userId: apiKey.userId,
        keyHash: apiKey.keyHash,
        name: apiKey.name,
        scopes: [...apiKey.scopes],
        expiresAt: apiKey.expiresAt,
        isActive: apiKey.isActive,
        tenantId: apiKey.tenantId,
        createdAt: apiKey.audit.createdAt,
        createdBy: apiKey.audit.createdBy,
        updatedAt: apiKey.audit.updatedAt,
        updatedBy: apiKey.audit.updatedBy,
        deletedAt: apiKey.audit.deletedAt,
        deletedBy: apiKey.audit.deletedBy,
      },
      update: {
        keyHash: apiKey.keyHash,
        isActive: apiKey.isActive,
        updatedAt: apiKey.audit.updatedAt,
        updatedBy: apiKey.audit.updatedBy,
        deletedAt: apiKey.audit.deletedAt,
        deletedBy: apiKey.audit.deletedBy,
      },
    });
    return this.toAPIKeyDomain(raw);
  }

  async findAPIKeyById(id: string): Promise<APIKey | null> {
    const raw = await this.prisma.aPIKeyModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toAPIKeyDomain(raw);
  }

  async findAPIKeyByHash(hash: string): Promise<APIKey | null> {
    const raw = await this.prisma.aPIKeyModel.findUnique({ where: { keyHash: hash } });
    if (!raw) return null;
    return this.toAPIKeyDomain(raw);
  }

  async findAPIKeysByUserId(userId: string): Promise<APIKey[]> {
    const records = await this.prisma.aPIKeyModel.findMany({ where: { userId, deletedAt: null } });
    return records.map((r: PrismaAPIKey) => this.toAPIKeyDomain(r));
  }

  async nextAPIKeyCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('APK');
  }

  // Domain Mappers
  private toUserDomain(raw: PrismaUser): User {
    const claims = raw.claimsJson
      ? (JSON.parse(raw.claimsJson) as { name: string; value: string }[]).map(
          (c) => new Claim({ name: c.name, value: c.value }),
        )
      : [];
    const providers = raw.providersJson
      ? (JSON.parse(raw.providersJson) as {
          providerType: AuthProviderType;
          externalId: string;
          metadata: Record<string, string>;
        }[]).map(
          (p) =>
            new AuthProvider({
              providerType: p.providerType,
              externalId: p.externalId,
              metadata: p.metadata,
            }),
        )
      : [];
    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });

    return new User({
      id: raw.id,
      code: raw.code,
      email: raw.email,
      passwordHash: PasswordHash.fromHash(raw.passwordHash),
      status: raw.status as UserStatus,
      isEmailVerified: raw.isEmailVerified,
      roleIds: raw.roleIds,
      claims,
      providers,
      tenantId: raw.tenantId,
      audit,
    });
  }

  private toRoleDomain(raw: PrismaRole): Role {
    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });
    return new Role({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      permissionIds: raw.permissionIds,
      tenantId: raw.tenantId,
      audit,
    });
  }

  private toPermissionDomain(raw: PrismaPermission): Permission {
    return new Permission({
      id: raw.id,
      code: raw.code,
      resource: raw.resource,
      action: raw.action,
      description: raw.description,
    });
  }

  private toPolicyDomain(raw: PrismaPolicy): Policy {
    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });
    return new Policy({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      rules: JSON.parse(raw.rulesJson) as PolicyRule[],
      tenantId: raw.tenantId,
      audit,
    });
  }

  private toSessionDomain(raw: PrismaSession): Session {
    return new Session({
      id: raw.id,
      code: raw.code,
      userId: raw.userId,
      refreshTokenHash: raw.refreshTokenHash,
      ipAddress: raw.ipAddress,
      userAgent: raw.userAgent,
      deviceType: raw.deviceType,
      expiresAt: raw.expiresAt,
      isRevoked: raw.isRevoked,
      tenantId: raw.tenantId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private toAPIKeyDomain(raw: PrismaAPIKey): APIKey {
    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });
    return new APIKey({
      id: raw.id,
      code: raw.code,
      userId: raw.userId,
      keyHash: raw.keyHash,
      name: raw.name,
      scopes: raw.scopes,
      expiresAt: raw.expiresAt,
      isActive: raw.isActive,
      tenantId: raw.tenantId,
      audit,
    });
  }
}
