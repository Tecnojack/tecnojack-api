import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsObject,
} from 'class-validator';
import { InvitationVisibility } from '../../../domain/enums/invitations.enums.js';

export class CreateInvitationDto {
  @ApiProperty({ example: 'event-uuid-from-events-domain' })
  @IsString()
  @IsNotEmpty()
  eventId!: string;

  @ApiProperty({ example: 'boda-jorge-y-maria' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ example: 'Boda Jorge & Maria' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: 'es' })
  @IsOptional()
  @IsString()
  language?: string = 'es';

  @ApiPropertyOptional({ enum: InvitationVisibility, default: InvitationVisibility.PUBLIC })
  @IsOptional()
  @IsEnum(InvitationVisibility)
  visibility?: InvitationVisibility;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: { primaryColor: '#ff00ff' } })
  @IsOptional()
  @IsObject()
  theme?: Record<string, unknown>;
}
