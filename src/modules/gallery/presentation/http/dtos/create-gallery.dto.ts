import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GalleryVisibility } from '../../../domain/enums/gallery.enums.js';

export class GallerySettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allowDownload?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allowFavorites?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allowComments?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() password?: string;
}

export class CreateGalleryDto {
  @ApiProperty({ description: 'Gallery name', example: 'Fotos Oficiales de Boda' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event UUID' })
  @IsUUID()
  eventId!: string;

  @ApiPropertyOptional({ enum: GalleryVisibility })
  @IsOptional()
  @IsEnum(GalleryVisibility)
  visibility?: GalleryVisibility;

  @ApiPropertyOptional({ description: 'Cover MediaAsset UUID' })
  @IsOptional()
  @IsUUID()
  coverMediaAssetId?: string;

  @ApiPropertyOptional({ type: GallerySettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GallerySettingsDto)
  settings?: GallerySettingsDto;
}
