import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import type { Role } from '../../domain/entities/role.entity.js';

@Injectable()
export class RoleResolver {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
  ) {}

  async resolveRoles(roleIds: string[]): Promise<Role[]> {
    const roles: Role[] = [];
    for (const id of roleIds) {
      const role = await this.repo.findRoleById(id);
      if (role) roles.push(role);
    }
    return roles;
  }
}
