import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CRMPipelineStage } from '../../../domain/enums/crm.enums.js';

export class TransitionStageDto {
  @ApiProperty({ enum: CRMPipelineStage })
  @IsEnum(CRMPipelineStage)
  newStage!: CRMPipelineStage;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ConvertOpportunityDto {
  @ApiProperty({ description: 'Event UUID (from Events domain)' })
  @IsNotEmpty()
  @IsString()
  eventId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contractId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentId?: string;
}
