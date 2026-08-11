import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateGalleryAlbumDto {
  @ApiProperty({ description: 'Album name', example: 'Ceremonia Religiosa' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Cover MediaAsset UUID' })
  @IsOptional()
  @IsUUID()
  coverMediaAssetId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
