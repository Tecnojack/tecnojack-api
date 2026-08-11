import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsInt } from 'class-validator';

export class AddGalleryAssetDto {
  @ApiProperty({ description: 'MediaAsset UUID' })
  @IsUUID()
  mediaAssetId!: string;

  @ApiPropertyOptional({ description: 'Album UUID' })
  @IsOptional()
  @IsUUID()
  albumId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
