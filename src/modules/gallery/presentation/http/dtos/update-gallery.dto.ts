import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GalleryVisibility } from '../../../domain/enums/gallery.enums.js';
import { GallerySettingsDto } from './create-gallery.dto.js';

export class UpdateGalleryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: GalleryVisibility }) @IsOptional() @IsEnum(GalleryVisibility) visibility?: GalleryVisibility;
  @ApiPropertyOptional() @IsOptional() @IsUUID() coverMediaAssetId?: string;
  @ApiPropertyOptional({ type: GallerySettingsDto }) @IsOptional() @ValidateNested() @Type(() => GallerySettingsDto) settings?: GallerySettingsDto;
}
