import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { RoleResolver } from './role-resolver.js';
import { PermissionResolver } from './permission-resolver.js';
import { PolicyEvaluator } from './policy-evaluator.js';
import type { User } from '../../domain/entities/user.entity.js';

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
    private readonly roleResolver: RoleResolver,
    private readonly permissionResolver: PermissionResolver,
    private readonly policyEvaluator: PolicyEvaluator,
  ) {}

  async isAuthorized(
    user: User,
    resource: string,
    action: string,
    resourceAttributes: Record<string, string> = {},
  ): Promise<boolean> {
    // 1. Resolve roles
    const roles = await this.roleResolver.resolveRoles([...user.roleIds]);
    
    // 2. Resolve permission ids
    const permIds = this.permissionResolver.resolvePermissions(roles);

    // 3. Match required permission resource & action
    let hasBasePermission = false;
    for (const pId of permIds) {
      const perm = await this.repo.findPermissionById(pId);
      if (perm) {
        const matchesResource = perm.resource === resource || perm.resource === '*';
        const matchesAction = perm.action === action || perm.action === '*';
        if (matchesResource && matchesAction) {
          hasBasePermission = true;
          break;
        }
      }
    }

    if (!hasBasePermission) {
      return false; // Missing base role permission (RBAC fail)
    }

    // 4. Evaluate dynamic policies (ABAC)
    return this.policyEvaluator.evaluatePolicies(user, resourceAttributes);
  }
}
