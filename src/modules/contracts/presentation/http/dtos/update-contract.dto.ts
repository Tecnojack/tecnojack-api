import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ContractTemplateType } from '../../../domain/enums/contracts.enums.js';

export class UpdateContractDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() deliverableId?: string;
  @ApiPropertyOptional({ enum: ContractTemplateType }) @IsOptional() @IsEnum(ContractTemplateType) templateType?: ContractTemplateType;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Date) expiresAt?: Date;
}
