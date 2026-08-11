import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaymentStatus, PaymentPlan } from '../../../domain/enums/payments.enums.js';

export class QueryPaymentsDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @IsUUID() eventId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() contractId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() deliverableId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() payerPersonId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() payerOrganizationId?: string;
  @ApiPropertyOptional({ enum: PaymentStatus }) @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus;
  @ApiPropertyOptional({ enum: PaymentPlan }) @IsOptional() @IsEnum(PaymentPlan) paymentPlan?: PaymentPlan;
  @ApiPropertyOptional({ description: 'Search query by code, title, or description' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ description: 'Include soft-deleted payments' }) @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() includeDeleted?: boolean = false;
}
