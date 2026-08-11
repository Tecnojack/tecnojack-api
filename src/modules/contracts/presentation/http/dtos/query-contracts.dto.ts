import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ContractStatus, ContractTemplateType } from '../../../domain/enums/contracts.enums.js';

export class QueryContractsDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @IsUUID() eventId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() deliverableId?: string;
  @ApiPropertyOptional({ enum: ContractStatus }) @IsOptional() @IsEnum(ContractStatus) status?: ContractStatus;
  @ApiPropertyOptional({ enum: ContractTemplateType }) @IsOptional() @IsEnum(ContractTemplateType) templateType?: ContractTemplateType;
  @ApiPropertyOptional({ description: 'Search query by code, title, or description' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ description: 'Include soft-deleted contracts' }) @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() includeDeleted?: boolean = false;
}
