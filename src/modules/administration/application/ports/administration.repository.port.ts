import type { SystemSetting } from '../../domain/entities/system-setting.entity.js';
import type { FeatureFlag } from '../../domain/entities/feature-flag.entity.js';
import type { Catalog } from '../../domain/entities/catalog.entity.js';
import type { DashboardWidget } from '../../domain/entities/dashboard-widget.entity.js';
import type { SettingCategory, CatalogType } from '../../domain/enums/administration.enums.js';

export const ADMINISTRATION_REPOSITORY = Symbol('ADMINISTRATION_REPOSITORY');

export interface AdministrationRepositoryPort {
  // System Settings
  saveSetting(setting: SystemSetting): Promise<SystemSetting>;
  findSettingById(id: string): Promise<SystemSetting | null>;
  findSettingByKey(key: string): Promise<SystemSetting | null>;
  findSettingsByCategory(category: SettingCategory): Promise<SystemSetting[]>;
  findAllSettings(): Promise<SystemSetting[]>;
  nextSettingCode(): Promise<string>;

  // Feature Flags
  saveFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag>;
  findFeatureFlagById(id: string): Promise<FeatureFlag | null>;
  findFeatureFlagByKey(key: string): Promise<FeatureFlag | null>;
  findAllFeatureFlags(): Promise<FeatureFlag[]>;
  nextFeatureFlagCode(): Promise<string>;

  // Catalogs
  saveCatalog(catalog: Catalog): Promise<Catalog>;
  findCatalogById(id: string): Promise<Catalog | null>;
  findCatalogByTypeAndValue(type: CatalogType, value: string): Promise<Catalog | null>;
  findCatalogsByType(type: CatalogType): Promise<Catalog[]>;
  findAllCatalogs(): Promise<Catalog[]>;
  nextCatalogCode(): Promise<string>;

  // Dashboard Widgets
  saveWidget(widget: DashboardWidget): Promise<DashboardWidget>;
  findWidgetById(id: string): Promise<DashboardWidget | null>;
  findAllWidgets(): Promise<DashboardWidget[]>;
  nextWidgetCode(): Promise<string>;
}
