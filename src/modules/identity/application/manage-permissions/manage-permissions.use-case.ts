import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { Permission } from '../../domain/entities/permission.entity.js';
import { PermissionNotFoundException } from '../../domain/errors/identity.errors.js';

export interface CreatePermissionCommand {
  resource: string;
  action: string;
  description: string;
}

@Injectable()
export class ManagePermissionsUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
  ) {}

  async createPermission(command: CreatePermissionCommand): Promise<Permission> {
    const existing = await this.repo.findPermissionByResourceAndAction(command.resource, command.action);
    if (existing) {
      throw new Error(`Permission for resource "${command.resource}" and action "${command.action}" already exists.`);
    }

    const code = await this.repo.nextPermissionCode();
    const permission = new Permission({
      code,
      resource: command.resource,
      action: command.action,
      description: command.description,
    });

    return this.repo.savePermission(permission);
  }

  async getPermission(id: string): Promise<Permission> {
    const found = await this.repo.findPermissionById(id);
    if (!found) throw new PermissionNotFoundException(id);
    return found;
  }

  async listPermissions(): Promise<Permission[]> {
    return this.repo.findAllPermissions();
  }
}
