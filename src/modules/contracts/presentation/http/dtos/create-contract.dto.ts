import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ContractTemplateType } from '../../../domain/enums/contracts.enums.js';

export class CreateContractDto {
  @ApiProperty({ description: 'Contract title', example: 'Contrato de Prestación de Servicios Fotográficos' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event UUID' })
  @IsUUID()
  eventId!: string;

  @ApiPropertyOptional({ description: 'Deliverable UUID' })
  @IsOptional()
  @IsUUID()
  deliverableId?: string;

  @ApiPropertyOptional({ enum: ContractTemplateType, default: ContractTemplateType.SERVICE_AGREEMENT })
  @IsOptional()
  @IsEnum(ContractTemplateType)
  templateType?: ContractTemplateType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Expiration date ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date;
}
