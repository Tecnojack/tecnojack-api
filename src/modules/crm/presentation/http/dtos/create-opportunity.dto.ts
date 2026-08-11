import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsNumber, Min, IsInt,
} from 'class-validator';
import { CRMPipelineStage } from '../../../domain/enums/crm.enums.js';

export class CreateOpportunityDto {
  @ApiProperty({ description: 'Opportunity title', example: 'Boda García - Cobertura Premium' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Person UUID (from People domain)' })
  @IsOptional()
  @IsUUID()
  personId?: string;

  @ApiPropertyOptional({ description: 'Organization UUID (from People domain)' })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Estimated deal value', example: 5000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedValue?: number;

  @ApiPropertyOptional({ default: 'COP' })
  @IsOptional()
  @IsString()
  currency?: string = 'COP';

  @ApiPropertyOptional({ description: 'Probability % (0-100)', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  probabilityPercentage?: number;

  @ApiPropertyOptional({ enum: CRMPipelineStage, default: CRMPipelineStage.NEW_LEAD })
  @IsOptional()
  @IsEnum(CRMPipelineStage)
  initialStage?: CRMPipelineStage;
}
