import { Injectable } from '@nestjs/common';
import type { Role } from '../../domain/entities/role.entity.js';

@Injectable()
export class PermissionResolver {
  resolvePermissions(roles: Role[]): string[] {
    const permissionsSet = new Set<string>();
    for (const role of roles) {
      for (const permId of role.permissionIds) {
        permissionsSet.add(permId);
      }
    }
    return Array.from(permissionsSet);
  }
}
