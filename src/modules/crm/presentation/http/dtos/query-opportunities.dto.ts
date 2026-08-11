import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CRMPipelineStage } from '../../../domain/enums/crm.enums.js';

export class QueryOpportunitiesDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @ApiPropertyOptional({ enum: CRMPipelineStage }) @IsOptional() @IsEnum(CRMPipelineStage) stage?: CRMPipelineStage;
  @ApiPropertyOptional() @IsOptional() @IsString() personId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() organizationId?: string;
  @ApiPropertyOptional({ description: 'Search by code, title, or description' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() includeDeleted?: boolean = false;
}
