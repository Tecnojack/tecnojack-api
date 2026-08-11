import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { UserNotFoundException } from '../../domain/errors/identity.errors.js';
import { PasswordHash } from '../../domain/value-objects/password-hash.value-object.js';
import type { User } from '../../domain/entities/user.entity.js';

@Injectable()
export class ManageUserLifecycleUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
  ) {}

  async verifyEmail(id: string, actorId?: string): Promise<User> {
    const user = await this.repo.findUserById(id);
    if (!user) throw new UserNotFoundException(id);

    user.verifyEmail(actorId);
    return this.repo.saveUser(user);
  }

  async resetPassword(id: string, passwordPlain: string, actorId?: string): Promise<User> {
    const user = await this.repo.findUserById(id);
    if (!user) throw new UserNotFoundException(id);

    const newHash = PasswordHash.create(passwordPlain);
    user.resetPassword(newHash, actorId);
    return this.repo.saveUser(user);
  }
}
