import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventPriority } from '../../../domain/enums/events.enums.js';
import { CreateEventBriefDto } from './create-event.dto.js';

export class UpdateEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiPropertyOptional({ enum: EventPriority }) @IsOptional() @IsEnum(EventPriority) priority?: EventPriority;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Date) estimatedStartAt?: Date;
  @ApiPropertyOptional() @IsOptional() @Type(() => Date) estimatedEndAt?: Date;
  @ApiPropertyOptional({ type: CreateEventBriefDto }) @IsOptional() @ValidateNested() @Type(() => CreateEventBriefDto) brief?: CreateEventBriefDto;
}
