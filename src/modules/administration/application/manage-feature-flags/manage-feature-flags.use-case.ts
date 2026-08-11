import { Injectable, Inject } from '@nestjs/common';
import {
  ADMINISTRATION_REPOSITORY,
  type AdministrationRepositoryPort,
} from '../ports/administration.repository.port.js';
import { FeatureFlag } from '../../domain/entities/feature-flag.entity.js';
import { FeatureFlagNotFoundException } from '../../domain/errors/administration.errors.js';

export interface CreateFeatureFlagCommand {
  key: string;
  isEnabled?: boolean;
  description?: string;
}

@Injectable()
export class ManageFeatureFlagsUseCase {
  constructor(
    @Inject(ADMINISTRATION_REPOSITORY)
    private readonly repo: AdministrationRepositoryPort,
  ) {}

  async createFlag(command: CreateFeatureFlagCommand): Promise<FeatureFlag> {
    const existing = await this.repo.findFeatureFlagByKey(command.key);
    if (existing) {
      throw new Error(`Feature flag with key "${command.key}" already exists.`);
    }

    const code = await this.repo.nextFeatureFlagCode();
    const flag = new FeatureFlag({
      code,
      key: command.key,
      isEnabled: command.isEnabled,
      description: command.description,
    });

    return this.repo.saveFeatureFlag(flag);
  }

  async toggleFlag(key: string, enabled: boolean, actorId?: string): Promise<FeatureFlag> {
    const flag = await this.repo.findFeatureFlagByKey(key);
    if (!flag) throw new FeatureFlagNotFoundException(key);

    flag.toggle(enabled, actorId);
    return this.repo.saveFeatureFlag(flag);
  }

  async isFlagEnabled(key: string): Promise<boolean> {
    const flag = await this.repo.findFeatureFlagByKey(key);
    if (!flag) return false;
    return flag.isEnabled;
  }

  async listFlags(): Promise<FeatureFlag[]> {
    return this.repo.findAllFeatureFlags();
  }
}
