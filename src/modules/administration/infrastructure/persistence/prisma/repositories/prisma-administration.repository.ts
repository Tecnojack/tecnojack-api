import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { SystemSetting } from '../../../../domain/entities/system-setting.entity.js';
import { FeatureFlag } from '../../../../domain/entities/feature-flag.entity.js';
import { Catalog } from '../../../../domain/entities/catalog.entity.js';
import { DashboardWidget } from '../../../../domain/entities/dashboard-widget.entity.js';
import type {
  AdministrationRepositoryPort,
} from '../../../../application/ports/administration.repository.port.js';
import { SettingCategory, CatalogType, WidgetType, WidgetSize } from '../../../../domain/enums/administration.enums.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';
import type {
  SystemSettingModel as PrismaSetting,
  FeatureFlagModel as PrismaFlag,
  CatalogModel as PrismaCatalog,
  DashboardWidgetModel as PrismaWidget,
} from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaAdministrationRepository implements AdministrationRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  // System Settings
  async saveSetting(setting: SystemSetting): Promise<SystemSetting> {
    const raw = await this.prisma.systemSettingModel.upsert({
      where: { id: setting.id },
      create: {
        id: setting.id,
        code: setting.code,
        key: setting.key,
        value: setting.value,
        description: setting.description,
        category: setting.category,
        createdAt: setting.audit.createdAt,
        createdBy: setting.audit.createdBy,
        updatedAt: setting.audit.updatedAt,
        updatedBy: setting.audit.updatedBy,
        deletedAt: setting.audit.deletedAt,
        deletedBy: setting.audit.deletedBy,
      },
      update: {
        value: setting.value,
        description: setting.description,
        updatedAt: setting.audit.updatedAt,
        updatedBy: setting.audit.updatedBy,
        deletedAt: setting.audit.deletedAt,
        deletedBy: setting.audit.deletedBy,
      },
    });
    return this.toSettingDomain(raw);
  }

  async findSettingById(id: string): Promise<SystemSetting | null> {
    const raw = await this.prisma.systemSettingModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toSettingDomain(raw);
  }

  async findSettingByKey(key: string): Promise<SystemSetting | null> {
    const raw = await this.prisma.systemSettingModel.findUnique({ where: { key } });
    if (!raw) return null;
    return this.toSettingDomain(raw);
  }

  async findSettingsByCategory(category: SettingCategory): Promise<SystemSetting[]> {
    const records = await this.prisma.systemSettingModel.findMany({ where: { category, deletedAt: null } });
    return records.map((r) => this.toSettingDomain(r));
  }

  async findAllSettings(): Promise<SystemSetting[]> {
    const records = await this.prisma.systemSettingModel.findMany({ where: { deletedAt: null } });
    return records.map((r) => this.toSettingDomain(r));
  }

  async nextSettingCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('SET');
  }

  // Feature Flags
  async saveFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag> {
    const raw = await this.prisma.featureFlagModel.upsert({
      where: { id: flag.id },
      create: {
        id: flag.id,
        code: flag.code,
        key: flag.key,
        isEnabled: flag.isEnabled,
        description: flag.description,
        createdAt: flag.audit.createdAt,
        createdBy: flag.audit.createdBy,
        updatedAt: flag.audit.updatedAt,
        updatedBy: flag.audit.updatedBy,
        deletedAt: flag.audit.deletedAt,
        deletedBy: flag.audit.deletedBy,
      },
      update: {
        isEnabled: flag.isEnabled,
        description: flag.description,
        updatedAt: flag.audit.updatedAt,
        updatedBy: flag.audit.updatedBy,
        deletedAt: flag.audit.deletedAt,
        deletedBy: flag.audit.deletedBy,
      },
    });
    return this.toFlagDomain(raw);
  }

  async findFeatureFlagById(id: string): Promise<FeatureFlag | null> {
    const raw = await this.prisma.featureFlagModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toFlagDomain(raw);
  }

  async findFeatureFlagByKey(key: string): Promise<FeatureFlag | null> {
    const raw = await this.prisma.featureFlagModel.findUnique({ where: { key } });
    if (!raw) return null;
    return this.toFlagDomain(raw);
  }

  async findAllFeatureFlags(): Promise<FeatureFlag[]> {
    const records = await this.prisma.featureFlagModel.findMany({ where: { deletedAt: null } });
    return records.map((r) => this.toFlagDomain(r));
  }

  async nextFeatureFlagCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('FFG');
  }

  // Catalogs
  async saveCatalog(catalog: Catalog): Promise<Catalog> {
    const raw = await this.prisma.catalogModel.upsert({
      where: { id: catalog.id },
      create: {
        id: catalog.id,
        code: catalog.code,
        name: catalog.name,
        type: catalog.type,
        value: catalog.value,
        label: catalog.label,
        description: catalog.description,
        createdAt: catalog.audit.createdAt,
        createdBy: catalog.audit.createdBy,
        updatedAt: catalog.audit.updatedAt,
        updatedBy: catalog.audit.updatedBy,
        deletedAt: catalog.audit.deletedAt,
        deletedBy: catalog.audit.deletedBy,
      },
      update: {
        value: catalog.value,
        label: catalog.label,
        description: catalog.description,
        updatedAt: catalog.audit.updatedAt,
        updatedBy: catalog.audit.updatedBy,
        deletedAt: catalog.audit.deletedAt,
        deletedBy: catalog.audit.deletedBy,
      },
    });
    return this.toCatalogDomain(raw);
  }

  async findCatalogById(id: string): Promise<Catalog | null> {
    const raw = await this.prisma.catalogModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toCatalogDomain(raw);
  }

  async findCatalogByTypeAndValue(type: CatalogType, value: string): Promise<Catalog | null> {
    const raw = await this.prisma.catalogModel.findUnique({
      where: {
        type_value: {
          type,
          value,
        },
      },
    });
    if (!raw) return null;
    return this.toCatalogDomain(raw);
  }

  async findCatalogsByType(type: CatalogType): Promise<Catalog[]> {
    const records = await this.prisma.catalogModel.findMany({ where: { type, deletedAt: null } });
    return records.map((r) => this.toCatalogDomain(r));
  }

  async findAllCatalogs(): Promise<Catalog[]> {
    const records = await this.prisma.catalogModel.findMany({ where: { deletedAt: null } });
    return records.map((r) => this.toCatalogDomain(r));
  }

  async nextCatalogCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('CTL');
  }

  // Dashboard Widgets
  async saveWidget(widget: DashboardWidget): Promise<DashboardWidget> {
    const raw = await this.prisma.dashboardWidgetModel.upsert({
      where: { id: widget.id },
      create: {
        id: widget.id,
        code: widget.code,
        title: widget.title,
        type: widget.type,
        dataSourceUrl: widget.dataSourceUrl,
        position: widget.position,
        size: widget.size,
        permissions: [...widget.permissions],
        createdAt: widget.audit.createdAt,
        createdBy: widget.audit.createdBy,
        updatedAt: widget.audit.updatedAt,
        updatedBy: widget.audit.updatedBy,
        deletedAt: widget.audit.deletedAt,
        deletedBy: widget.audit.deletedBy,
      },
      update: {
        title: widget.title,
        type: widget.type,
        dataSourceUrl: widget.dataSourceUrl,
        position: widget.position,
        size: widget.size,
        permissions: [...widget.permissions],
        updatedAt: widget.audit.updatedAt,
        updatedBy: widget.audit.updatedBy,
        deletedAt: widget.audit.deletedAt,
        deletedBy: widget.audit.deletedBy,
      },
    });
    return this.toWidgetDomain(raw);
  }

  async findWidgetById(id: string): Promise<DashboardWidget | null> {
    const raw = await this.prisma.dashboardWidgetModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toWidgetDomain(raw);
  }

  async findAllWidgets(): Promise<DashboardWidget[]> {
    const records = await this.prisma.dashboardWidgetModel.findMany({ where: { deletedAt: null } });
    return records.map((r) => this.toWidgetDomain(r));
  }

  async nextWidgetCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('WDG');
  }

  // Domain Mappers
  private toSettingDomain(raw: PrismaSetting): SystemSetting {
    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });
    return new SystemSetting({
      id: raw.id,
      code: raw.code,
      key: raw.key,
      value: raw.value,
      description: raw.description,
      category: raw.category as SettingCategory,
      audit,
    });
  }

  private toFlagDomain(raw: PrismaFlag): FeatureFlag {
    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });
    return new FeatureFlag({
      id: raw.id,
      code: raw.code,
      key: raw.key,
      isEnabled: raw.isEnabled,
      description: raw.description,
      audit,
    });
  }

  private toCatalogDomain(raw: PrismaCatalog): Catalog {
    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });
    return new Catalog({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      type: raw.type as CatalogType,
      value: raw.value,
      label: raw.label,
      description: raw.description,
      audit,
    });
  }

  private toWidgetDomain(raw: PrismaWidget): DashboardWidget {
    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });
    return new DashboardWidget({
      id: raw.id,
      code: raw.code,
      title: raw.title,
      type: raw.type as WidgetType,
      dataSourceUrl: raw.dataSourceUrl,
      position: raw.position,
      size: raw.size as WidgetSize,
      permissions: raw.permissions,
      audit,
    });
  }
}
