import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { MediaStatus } from '../../../domain/enums/media.enums.js';

export class UpdateMediaAssetDto {
  @ApiPropertyOptional({ enum: MediaStatus, description: 'Media asset processing status' })
  @IsOptional()
  @IsEnum(MediaStatus)
  status?: MediaStatus;

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

  @ApiPropertyOptional({ description: 'Duration in seconds' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  durationSec?: number;

  @ApiPropertyOptional({ description: 'File checksum hash' })
  @IsOptional()
  @IsString()
  checksumHash?: string;
}
