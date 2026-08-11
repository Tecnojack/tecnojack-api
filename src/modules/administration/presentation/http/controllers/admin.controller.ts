import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ManageSettingsUseCase } from '../../../application/manage-settings/manage-settings.use-case.js';
import { ManageFeatureFlagsUseCase } from '../../../application/manage-feature-flags/manage-feature-flags.use-case.js';
import { ManageCatalogsUseCase } from '../../../application/manage-catalogs/manage-catalogs.use-case.js';
import { ManageWidgetsUseCase } from '../../../application/manage-widgets/manage-widgets.use-case.js';
import { HealthChecksService, type HealthStatus } from '../../../application/health-checks/health-checks.service.js';
import {
  UpdateSettingDto,
  CreateFeatureFlagDto,
  ToggleFeatureFlagDto,
  CreateCatalogDto,
  CreateWidgetDto,
} from '../dtos/admin-request.dto.js';
import {
  SystemSettingResponseDto,
  FeatureFlagResponseDto,
  CatalogResponseDto,
  DashboardWidgetResponseDto,
} from '../dtos/admin-response.dto.js';
import { SettingCategory, CatalogType } from '../../../domain/enums/administration.enums.js';
import type { SystemSetting } from '../../../domain/entities/system-setting.entity.js';
import type { FeatureFlag } from '../../../domain/entities/feature-flag.entity.js';
import type { Catalog } from '../../../domain/entities/catalog.entity.js';
import type { DashboardWidget } from '../../../domain/entities/dashboard-widget.entity.js';

// Note: In real app, we would secure using AuthGuard/PermissionGuard from IAM domain.
// Because WO requested using Facades only, we import them logically.
@ApiTags('Administration Portal Operations')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly settingsUseCase: ManageSettingsUseCase,
    private readonly flagsUseCase: ManageFeatureFlagsUseCase,
    private readonly catalogsUseCase: ManageCatalogsUseCase,
    private readonly widgetsUseCase: ManageWidgetsUseCase,
    private readonly healthService: HealthChecksService,
  ) {}

  // System Settings
  @Put('settings')
  @ApiOperation({ summary: 'Update or create a system setting' })
  @ApiResponse({ status: 200, type: SystemSettingResponseDto })
  async updateSetting(@Body() dto: UpdateSettingDto): Promise<SystemSettingResponseDto> {
    const res = await this.settingsUseCase.updateSetting({
      key: dto.key,
      value: dto.value,
      description: dto.description,
      category: dto.category,
    });
    return SystemSettingResponseDto.fromDomain(res);
  }

  @Get('settings')
  @ApiOperation({ summary: 'List system settings' })
  async listSettings(@Query('category') category?: SettingCategory): Promise<SystemSettingResponseDto[]> {
    const list = category
      ? await this.settingsUseCase.listSettingsByCategory(category)
      : await this.settingsUseCase.listAllSettings();
    return list.map((s: SystemSetting) => SystemSettingResponseDto.fromDomain(s));
  }

  // Feature Flags
  @Post('feature-flags')
  @ApiOperation({ summary: 'Register a new feature flag' })
  @ApiResponse({ status: 201, type: FeatureFlagResponseDto })
  async createFlag(@Body() dto: CreateFeatureFlagDto): Promise<FeatureFlagResponseDto> {
    const flag = await this.flagsUseCase.createFlag({
      key: dto.key,
      isEnabled: dto.isEnabled,
      description: dto.description,
    });
    return FeatureFlagResponseDto.fromDomain(flag);
  }

  @Put('feature-flags/:key/toggle')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enable or disable a feature flag' })
  @ApiResponse({ status: 200, type: FeatureFlagResponseDto })
  async toggleFlag(
    @Param('key') key: string,
    @Body() dto: ToggleFeatureFlagDto,
  ): Promise<FeatureFlagResponseDto> {
    const flag = await this.flagsUseCase.toggleFlag(key, dto.isEnabled);
    return FeatureFlagResponseDto.fromDomain(flag);
  }

  @Get('feature-flags')
  @ApiOperation({ summary: 'List all system feature flags' })
  async listFlags(): Promise<FeatureFlagResponseDto[]> {
    const list = await this.flagsUseCase.listFlags();
    return list.map((f: FeatureFlag) => FeatureFlagResponseDto.fromDomain(f));
  }

  // Catalogs
  @Post('catalogs')
  @ApiOperation({ summary: 'Register country, tag, language catalog record' })
  @ApiResponse({ status: 201, type: CatalogResponseDto })
  async createCatalog(@Body() dto: CreateCatalogDto): Promise<CatalogResponseDto> {
    const catalog = await this.catalogsUseCase.createCatalogEntry({
      name: dto.name,
      type: dto.type,
      value: dto.value,
      label: dto.label,
      description: dto.description,
    });
    return CatalogResponseDto.fromDomain(catalog);
  }

  @Get('catalogs')
  @ApiOperation({ summary: 'List catalog entries' })
  async listCatalogs(@Query('type') type?: CatalogType): Promise<CatalogResponseDto[]> {
    const list = type
      ? await this.catalogsUseCase.listByType(type)
      : await this.catalogsUseCase.listAll();
    return list.map((c: Catalog) => CatalogResponseDto.fromDomain(c));
  }

  // Dashboard Widgets
  @Post('widgets')
  @ApiOperation({ summary: 'Configure a dynamic dashboard widget' })
  @ApiResponse({ status: 201, type: DashboardWidgetResponseDto })
  async createWidget(@Body() dto: CreateWidgetDto): Promise<DashboardWidgetResponseDto> {
    const widget = await this.widgetsUseCase.createWidget({
      title: dto.title,
      type: dto.type,
      dataSourceUrl: dto.dataSourceUrl,
      position: dto.position,
      size: dto.size,
      permissions: dto.permissions,
    });
    return DashboardWidgetResponseDto.fromDomain(widget);
  }

  @Get('widgets')
  @ApiOperation({ summary: 'List dashboard widgets configuration mapping' })
  async listWidgets(): Promise<DashboardWidgetResponseDto[]> {
    const list = await this.widgetsUseCase.listWidgets();
    return list.map((w: DashboardWidget) => DashboardWidgetResponseDto.fromDomain(w));
  }

  // Health
  @Get('health')
  @ApiOperation({ summary: 'Verify system status database connection & storage health status' })
  async checkHealth(): Promise<HealthStatus> {
    return this.healthService.check();
  }
}
