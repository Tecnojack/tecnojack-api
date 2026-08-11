import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SettingCategory, CatalogType, WidgetType, WidgetSize } from '../../../domain/enums/administration.enums.js';
import type { SystemSetting } from '../../../domain/entities/system-setting.entity.js';
import type { FeatureFlag } from '../../../domain/entities/feature-flag.entity.js';
import type { Catalog } from '../../../domain/entities/catalog.entity.js';
import type { DashboardWidget } from '../../../domain/entities/dashboard-widget.entity.js';

export class SystemSettingResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() key!: string;
  @ApiProperty() value!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty({ enum: SettingCategory }) category!: SettingCategory;

  static fromDomain(setting: SystemSetting): SystemSettingResponseDto {
    const dto = new SystemSettingResponseDto();
    dto.id = setting.id;
    dto.code = setting.code;
    dto.key = setting.key;
    dto.value = setting.value;
    dto.description = setting.description;
    dto.category = setting.category;
    return dto;
  }
}

export class FeatureFlagResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() key!: string;
  @ApiProperty() isEnabled!: boolean;
  @ApiPropertyOptional() description?: string | null;

  static fromDomain(flag: FeatureFlag): FeatureFlagResponseDto {
    const dto = new FeatureFlagResponseDto();
    dto.id = flag.id;
    dto.code = flag.code;
    dto.key = flag.key;
    dto.isEnabled = flag.isEnabled;
    dto.description = flag.description;
    return dto;
  }
}

export class CatalogResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ enum: CatalogType }) type!: CatalogType;
  @ApiProperty() value!: string;
  @ApiProperty() label!: string;
  @ApiPropertyOptional() description?: string | null;

  static fromDomain(catalog: Catalog): CatalogResponseDto {
    const dto = new CatalogResponseDto();
    dto.id = catalog.id;
    dto.code = catalog.code;
    dto.name = catalog.name;
    dto.type = catalog.type;
    dto.value = catalog.value;
    dto.label = catalog.label;
    dto.description = catalog.description;
    return dto;
  }
}

export class DashboardWidgetResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() title!: string;
  @ApiProperty({ enum: WidgetType }) type!: WidgetType;
  @ApiProperty() dataSourceUrl!: string;
  @ApiProperty() position!: number;
  @ApiProperty({ enum: WidgetSize }) size!: WidgetSize;
  @ApiProperty({ type: [String] }) permissions!: string[];

  static fromDomain(widget: DashboardWidget): DashboardWidgetResponseDto {
    const dto = new DashboardWidgetResponseDto();
    dto.id = widget.id;
    dto.code = widget.code;
    dto.title = widget.title;
    dto.type = widget.type;
    dto.dataSourceUrl = widget.dataSourceUrl;
    dto.position = widget.position;
    dto.size = widget.size;
    dto.permissions = [...widget.permissions];
    return dto;
  }
}
