import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { DeliverableType, DeliverableStatus, DeliveryMethod } from '../../../domain/enums/deliverables.enums.js';

export class QueryDeliverablesDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @IsUUID() eventId?: string;
  @ApiPropertyOptional({ enum: DeliverableType }) @IsOptional() @IsEnum(DeliverableType) type?: DeliverableType;
  @ApiPropertyOptional({ enum: DeliverableStatus }) @IsOptional() @IsEnum(DeliverableStatus) status?: DeliverableStatus;
  @ApiPropertyOptional({ enum: DeliveryMethod }) @IsOptional() @IsEnum(DeliveryMethod) deliveryMethod?: DeliveryMethod;
  @ApiPropertyOptional() @IsOptional() @IsUUID() recipientPersonId?: string;
  @ApiPropertyOptional({ description: 'Search query by code, name, or description' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ description: 'Include soft-deleted deliverables' }) @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() includeDeleted?: boolean = false;
}
