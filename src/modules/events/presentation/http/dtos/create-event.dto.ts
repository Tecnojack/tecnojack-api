import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventPriority } from '../../../domain/enums/events.enums.js';

export class CreateEventBriefDto {
  @ApiPropertyOptional() @IsOptional() @IsString() summary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() objectives?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() audience?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() creativeDirection?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visualReferences?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() specialMoments?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() restrictions?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technicalRequirements?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accessibilityRequirements?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() privacyRequirements?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() additionalNotes?: string;
}

export class CreateEventDto {
  @ApiProperty({ description: 'Event name', example: 'Boda Gabriel y Mercedes' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'Custom slug' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'EventType UUID' })
  @IsUUID()
  eventTypeId!: string;

  @ApiPropertyOptional({ enum: EventPriority })
  @IsOptional()
  @IsEnum(EventPriority)
  priority?: EventPriority;

  @ApiPropertyOptional({ description: 'Owner Person or Organization UUID' })
  @IsOptional()
  @IsUUID()
  ownerUserId?: string;

  @ApiPropertyOptional({ description: 'IANA TimeZone', example: 'America/Bogota' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Estimated start date ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  estimatedStartAt?: Date;

  @ApiPropertyOptional({ description: 'Estimated end date ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  estimatedEndAt?: Date;

  @ApiPropertyOptional({ type: CreateEventBriefDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEventBriefDto)
  brief?: CreateEventBriefDto;
}
