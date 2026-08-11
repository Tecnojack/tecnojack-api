import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { GalleryStatus, GalleryVisibility } from '../../../domain/enums/gallery.enums.js';

export class QueryGalleriesDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @IsUUID() eventId?: string;
  @ApiPropertyOptional({ enum: GalleryStatus }) @IsOptional() @IsEnum(GalleryStatus) status?: GalleryStatus;
  @ApiPropertyOptional({ enum: GalleryVisibility }) @IsOptional() @IsEnum(GalleryVisibility) visibility?: GalleryVisibility;
  @ApiPropertyOptional({ description: 'Search query by code, name, or description' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ description: 'Include soft-deleted galleries' }) @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() includeDeleted?: boolean = false;
}
