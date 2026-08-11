import { ManageSettingsUseCase } from './manage-settings.use-case.js';
import type { AdministrationRepositoryPort } from '../ports/administration.repository.port.js';
import type { SystemSetting } from '../../domain/entities/system-setting.entity.js';
import { SettingCategory } from '../../domain/enums/administration.enums.js';

describe('ManageSettingsUseCase', () => {
  let useCase: ManageSettingsUseCase;
  let mockRepo: jest.Mocked<AdministrationRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      saveSetting: jest.fn().mockImplementation((s: SystemSetting) => Promise.resolve(s)),
      findSettingById: jest.fn(),
      findSettingByKey: jest.fn().mockResolvedValue(null),
      findSettingsByCategory: jest.fn(),
      findAllSettings: jest.fn(),
      nextSettingCode: jest.fn().mockResolvedValue('SET-000001'),
    } as unknown as jest.Mocked<AdministrationRepositoryPort>;

    useCase = new ManageSettingsUseCase(mockRepo);
  });

  it('should update or create system setting successfully', async () => {
    const res = await useCase.updateSetting({
      key: 'site_logo',
      value: 'https://tecnojack.com/logo.png',
      category: SettingCategory.BRANDING,
    });

    expect(res.key).toBe('site_logo');
    expect(res.value).toBe('https://tecnojack.com/logo.png');
    expect(mockRepo.saveSetting.mock.calls.length).toBe(1);
  });
});
