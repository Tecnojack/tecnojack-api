import type { User } from '../../domain/entities/user.entity.js';
import type { Role } from '../../domain/entities/role.entity.js';
import type { Permission } from '../../domain/entities/permission.entity.js';
import type { Policy } from '../../domain/entities/policy.entity.js';
import type { Session } from '../../domain/entities/session.entity.js';
import type { APIKey } from '../../domain/entities/api-key.entity.js';
import type { PaginatedResult } from '../../../../platform/domain/types/pagination.types.js';

export const IDENTITY_REPOSITORY = Symbol('IDENTITY_REPOSITORY');

export interface ListUsersFilter {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}

export interface IdentityRepositoryPort {
  // User
  saveUser(user: User): Promise<User>;
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByCode(code: string): Promise<User | null>;
  findAllUsers(filter: ListUsersFilter): Promise<PaginatedResult<User>>;
  nextUserCode(): Promise<string>;

  // Role
  saveRole(role: Role): Promise<Role>;
  findRoleById(id: string): Promise<Role | null>;
  findRoleByName(name: string): Promise<Role | null>;
  findRoleByCode(code: string): Promise<Role | null>;
  findAllRoles(): Promise<Role[]>;
  nextRoleCode(): Promise<string>;

  // Permission
  savePermission(permission: Permission): Promise<Permission>;
  findPermissionById(id: string): Promise<Permission | null>;
  findPermissionByResourceAndAction(resource: string, action: string): Promise<Permission | null>;
  findAllPermissions(): Promise<Permission[]>;
  nextPermissionCode(): Promise<string>;

  // Policy
  savePolicy(policy: Policy): Promise<Policy>;
  findPolicyById(id: string): Promise<Policy | null>;
  findPolicyByCode(code: string): Promise<Policy | null>;
  findAllPolicies(): Promise<Policy[]>;
  nextPolicyCode(): Promise<string>;

  // Session
  saveSession(session: Session): Promise<Session>;
  findSessionById(id: string): Promise<Session | null>;
  findSessionByRefreshTokenHash(hash: string): Promise<Session | null>;
  findSessionsByUserId(userId: string): Promise<Session[]>;
  nextSessionCode(): Promise<string>;

  // APIKey
  saveAPIKey(apiKey: APIKey): Promise<APIKey>;
  findAPIKeyById(id: string): Promise<APIKey | null>;
  findAPIKeyByHash(hash: string): Promise<APIKey | null>;
  findAPIKeysByUserId(userId: string): Promise<APIKey[]>;
  nextAPIKeyCode(): Promise<string>;
}
