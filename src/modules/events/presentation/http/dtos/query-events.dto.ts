import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  EventLifecycleStatus,
  EventProductionPhase,
  EventDateStatus,
  EventPriority,
} from '../../../domain/enums/events.enums.js';

export class QueryEventsDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @IsUUID() eventTypeId?: string;
  @ApiPropertyOptional({ enum: EventLifecycleStatus }) @IsOptional() @IsEnum(EventLifecycleStatus) lifecycleStatus?: EventLifecycleStatus;
  @ApiPropertyOptional({ enum: EventProductionPhase }) @IsOptional() @IsEnum(EventProductionPhase) productionPhase?: EventProductionPhase;
  @ApiPropertyOptional({ enum: EventDateStatus }) @IsOptional() @IsEnum(EventDateStatus) dateStatus?: EventDateStatus;
  @ApiPropertyOptional({ enum: EventPriority }) @IsOptional() @IsEnum(EventPriority) priority?: EventPriority;
  @ApiPropertyOptional() @IsOptional() @IsUUID() ownerUserId?: string;
  @ApiPropertyOptional({ description: 'Search query by code, name, or brief' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ description: 'Include soft-deleted events' }) @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() includeDeleted?: boolean = false;
}
