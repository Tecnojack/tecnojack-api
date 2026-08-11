import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsInt, Min } from 'class-validator';

export class AddDeliverableItemDto {
  @ApiProperty({ description: 'Item title', example: 'Memoria USB 64GB Grabada en Madera' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Associated MediaAsset UUID' })
  @IsOptional()
  @IsUUID()
  mediaAssetId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
