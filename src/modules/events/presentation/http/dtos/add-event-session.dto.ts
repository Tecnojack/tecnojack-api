import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { EventSessionType, EventSessionStatus } from '../../../domain/enums/events.enums.js';

export class AddEventSessionDto {
  @ApiProperty({ description: 'Session name', example: 'Ceremonia Religiosa' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ enum: EventSessionType })
  @IsOptional()
  @IsEnum(EventSessionType)
  type?: EventSessionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: EventSessionStatus })
  @IsOptional()
  @IsEnum(EventSessionStatus)
  status?: EventSessionStatus;

  @ApiPropertyOptional({ description: 'Start timestamp ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  startAt?: Date;

  @ApiPropertyOptional({ description: 'End timestamp ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  endAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Location UUID' })
  @IsOptional()
  @IsUUID()
  locationId?: string;
}
