import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class RegisterMediaAssetDto {
  @ApiProperty({ description: 'Original filename', example: 'wedding-photo.jpg' })
  @IsString()
  @IsNotEmpty()
  originalName!: string;

  @ApiPropertyOptional({ description: 'MIME type if known', example: 'image/jpeg' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ description: 'Existing storage path if already uploaded', example: '2026/08/11/wedding-photo.jpg' })
  @IsOptional()
  @IsString()
  storagePath?: string;

  @ApiPropertyOptional({ description: 'Target subfolder for file storage', example: 'events/123' })
  @IsOptional()
  @IsString()
  subfolder?: string;

  @ApiPropertyOptional({ description: 'File SHA-256 or MD5 checksum hash' })
  @IsOptional()
  @IsString()
  checksumHash?: string;

  @ApiPropertyOptional({ description: 'File width in pixels' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  width?: number;

  @ApiPropertyOptional({ description: 'File height in pixels' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  height?: number;

  @ApiPropertyOptional({ description: 'Duration in seconds for video/audio' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  durationSec?: number;
}
