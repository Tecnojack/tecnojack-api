import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { Role } from '../../domain/entities/role.entity.js';
import { RoleNotFoundException, UserNotFoundException } from '../../domain/errors/identity.errors.js';

export interface CreateRoleCommand {
  name: string;
  description?: string;
  tenantId?: string;
  actorId?: string;
}

export interface UpdateRoleCommand {
  id: string;
  name: string;
  description?: string;
  actorId?: string;
}

@Injectable()
export class ManageRolesUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
  ) {}

  async createRole(command: CreateRoleCommand): Promise<Role> {
    const existing = await this.repo.findRoleByName(command.name);
    if (existing) {
      throw new Error(`Role name "${command.name}" is already in use.`);
    }

    const code = await this.repo.nextRoleCode();
    const role = new Role({
      code,
      name: command.name,
      description: command.description,
      tenantId: command.tenantId,
    });

    return this.repo.saveRole(role);
  }

  async updateRole(command: UpdateRoleCommand): Promise<Role> {
    const role = await this.repo.findRoleById(command.id);
    if (!role) throw new RoleNotFoundException(command.id);

    role.updateDetails(command.name, command.description, command.actorId);
    return this.repo.saveRole(role);
  }

  async deleteRole(id: string, actorId?: string): Promise<Role> {
    const role = await this.repo.findRoleById(id);
    if (!role) throw new RoleNotFoundException(id);

    role.softDelete(actorId);
    return this.repo.saveRole(role);
  }

  async assignRoleToUser(userId: string, roleId: string, actorId?: string): Promise<void> {
    const user = await this.repo.findUserById(userId);
    if (!user) throw new UserNotFoundException(userId);

    const role = await this.repo.findRoleById(roleId);
    if (!role) throw new RoleNotFoundException(roleId);

    user.assignRole(role.id, actorId);
    await this.repo.saveUser(user);
  }

  async removeRoleFromUser(userId: string, roleId: string, actorId?: string): Promise<void> {
    const user = await this.repo.findUserById(userId);
    if (!user) throw new UserNotFoundException(userId);

    user.removeRole(roleId, actorId);
    await this.repo.saveUser(user);
  }
}
