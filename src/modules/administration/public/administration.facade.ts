import { Injectable } from '@nestjs/common';
import { ManageFeatureFlagsUseCase } from '../application/manage-feature-flags/manage-feature-flags.use-case.js';
import { ManageSettingsUseCase } from '../application/manage-settings/manage-settings.use-case.js';

@Injectable()
export class AdministrationFacade {
  constructor(
    private readonly flagsUseCase: ManageFeatureFlagsUseCase,
    private readonly settingsUseCase: ManageSettingsUseCase,
  ) {}

  async isFeatureEnabled(key: string): Promise<boolean> {
    return this.flagsUseCase.isFlagEnabled(key);
  }

  async getSettingValue(key: string): Promise<string | null> {
    try {
      const setting = await this.settingsUseCase.getSetting(key);
      return setting.value;
    } catch {
      return null;
    }
  }
}
