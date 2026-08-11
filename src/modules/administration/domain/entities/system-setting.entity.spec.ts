import { SystemSetting } from './system-setting.entity.js';
import { FeatureFlag } from './feature-flag.entity.js';
import { Catalog } from './catalog.entity.js';
import { DashboardWidget } from './dashboard-widget.entity.js';
import { SettingCategory, CatalogType, WidgetType, WidgetSize } from '../enums/administration.enums.js';

describe('Administration Domain Entities', () => {
  it('should instantiate and update SystemSetting correctly', () => {
    const setting = new SystemSetting({
      code: 'SET-000001',
      key: 'logo_url',
      value: 'https://tecnojack.com/logo.png',
      category: SettingCategory.BRANDING,
    });

    expect(setting.key).toBe('logo_url');
    setting.updateValue('https://tecnojack.com/new-logo.png');
    expect(setting.value).toBe('https://tecnojack.com/new-logo.png');
  });

  it('should instantiate and toggle FeatureFlag', () => {
    const flag = new FeatureFlag({
      code: 'FFG-000001',
      key: 'enable_sso',
      isEnabled: false,
    });

    expect(flag.isEnabled).toBe(false);
    flag.toggle(true);
    expect(flag.isEnabled).toBe(true);
  });

  it('should instantiate Catalog and update details', () => {
    const catalog = new Catalog({
      code: 'CTL-000001',
      name: 'Mexico',
      type: CatalogType.COUNTRY,
      value: 'MX',
      label: 'México',
    });

    expect(catalog.value).toBe('MX');
    catalog.updateDetails('MX_NEW', 'México Nuevo');
    expect(catalog.value).toBe('MX_NEW');
    expect(catalog.label).toBe('México Nuevo');
  });

  it('should instantiate DashboardWidget and update details', () => {
    const widget = new DashboardWidget({
      code: 'WDG-000001',
      title: 'Active Sales',
      type: WidgetType.STAT_CARD,
      dataSourceUrl: '/crm/stats',
      size: WidgetSize.SMALL,
    });

    expect(widget.title).toBe('Active Sales');
    widget.updateDetails('Sales Chart', WidgetType.CHART_LINE, '/crm/chart', 1, WidgetSize.MEDIUM, ['crm:read']);
    expect(widget.title).toBe('Sales Chart');
    expect(widget.size).toBe(WidgetSize.MEDIUM);
  });
});
