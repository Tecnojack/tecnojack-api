import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { SettingCategory, CatalogType, WidgetType, WidgetSize } from '../../../domain/enums/administration.enums.js';

export class UpdateSettingDto {
  @ApiProperty({ example: 'site_logo' })
  @IsString()
  @IsNotEmpty()
  key!: string;

  @ApiProperty({ example: 'https://tecnojack.com/logo.png' })
  @IsString()
  @IsNotEmpty()
  value!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: SettingCategory })
  @IsEnum(SettingCategory)
  category!: SettingCategory;
}

export class CreateFeatureFlagDto {
  @ApiProperty({ example: 'enable_sso' })
  @IsString()
  @IsNotEmpty()
  key!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class ToggleFeatureFlagDto {
  @ApiProperty()
  @IsBoolean()
  isEnabled!: boolean;
}

export class CreateCatalogDto {
  @ApiProperty({ example: 'Mexico' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: CatalogType })
  @IsEnum(CatalogType)
  type!: CatalogType;

  @ApiProperty({ example: 'MX' })
  @IsString()
  @IsNotEmpty()
  value!: string;

  @ApiProperty({ example: 'México' })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateWidgetDto {
  @ApiProperty({ example: 'Opportunities Over Time' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ enum: WidgetType })
  @IsEnum(WidgetType)
  type!: WidgetType;

  @ApiProperty({ example: '/crm/opportunities/stats' })
  @IsString()
  @IsNotEmpty()
  dataSourceUrl!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({ enum: WidgetSize })
  @IsEnum(WidgetSize)
  size!: WidgetSize;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  permissions?: string[];
}
