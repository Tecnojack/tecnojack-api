import { Injectable, Inject } from '@nestjs/common';
import {
  ADMINISTRATION_REPOSITORY,
  type AdministrationRepositoryPort,
} from '../ports/administration.repository.port.js';
import { SystemSetting } from '../../domain/entities/system-setting.entity.js';
import { SettingCategory } from '../../domain/enums/administration.enums.js';
import { SettingNotFoundException } from '../../domain/errors/administration.errors.js';

export interface UpdateSettingCommand {
  key: string;
  value: string;
  description?: string;
  category: SettingCategory;
  actorId?: string;
}

@Injectable()
export class ManageSettingsUseCase {
  constructor(
    @Inject(ADMINISTRATION_REPOSITORY)
    private readonly repo: AdministrationRepositoryPort,
  ) {}

  async getSetting(key: string): Promise<SystemSetting> {
    const setting = await this.repo.findSettingByKey(key);
    if (!setting) throw new SettingNotFoundException(key);
    return setting;
  }

  async updateSetting(command: UpdateSettingCommand): Promise<SystemSetting> {
    let setting = await this.repo.findSettingByKey(command.key);
    if (!setting) {
      const code = await this.repo.nextSettingCode();
      setting = new SystemSetting({
        code,
        key: command.key,
        value: command.value,
        description: command.description,
        category: command.category,
      });
    } else {
      setting.updateValue(command.value, command.description, command.actorId);
    }

    return this.repo.saveSetting(setting);
  }

  async listSettingsByCategory(category: SettingCategory): Promise<SystemSetting[]> {
    return this.repo.findSettingsByCategory(category);
  }

  async listAllSettings(): Promise<SystemSetting[]> {
    return this.repo.findAllSettings();
  }
}
