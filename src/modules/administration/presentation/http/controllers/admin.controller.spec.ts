jest.mock('../../../../../platform/database/prisma/prisma.service.js', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({})),
  };
});

import { AdminController } from './admin.controller.js';
import type { ManageSettingsUseCase } from '../../../application/manage-settings/manage-settings.use-case.js';
import type { ManageFeatureFlagsUseCase } from '../../../application/manage-feature-flags/manage-feature-flags.use-case.js';
import type { ManageCatalogsUseCase } from '../../../application/manage-catalogs/manage-catalogs.use-case.js';
import type { ManageWidgetsUseCase } from '../../../application/manage-widgets/manage-widgets.use-case.js';
import type { HealthChecksService } from '../../../application/health-checks/health-checks.service.js';
import { SystemSetting } from '../../../domain/entities/system-setting.entity.js';
import { SettingCategory } from '../../../domain/enums/administration.enums.js';

describe('AdminController', () => {
  let controller: AdminController;
  let sampleSetting: SystemSetting;

  beforeEach(() => {
    sampleSetting = new SystemSetting({
      code: 'SET-000001',
      key: 'site_logo',
      value: 'logo.png',
      category: SettingCategory.BRANDING,
    });

    const settingsUseCase = {
      updateSetting: jest.fn().mockResolvedValue(sampleSetting),
      listAllSettings: jest.fn().mockResolvedValue([sampleSetting]),
    } as unknown as ManageSettingsUseCase;

    const flagsUseCase = {} as unknown as ManageFeatureFlagsUseCase;
    const catalogsUseCase = {} as unknown as ManageCatalogsUseCase;
    const widgetsUseCase = {} as unknown as ManageWidgetsUseCase;
    const healthService = {} as unknown as HealthChecksService;

    controller = new AdminController(
      settingsUseCase,
      flagsUseCase,
      catalogsUseCase,
      widgetsUseCase,
      healthService,
    );
  });

  it('should update and return a setting via controller endpoint', async () => {
    const res = await controller.updateSetting({
      key: 'site_logo',
      value: 'logo.png',
      category: SettingCategory.BRANDING,
    });

    expect(res.key).toBe('site_logo');
    expect(res.value).toBe('logo.png');
  });
});
