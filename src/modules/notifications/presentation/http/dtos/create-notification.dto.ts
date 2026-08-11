import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsDateString, IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationChannel, NotificationPriority } from '../../../domain/enums/notifications.enums.js';

export class RecipientDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  personId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recipientAddress?: string;
}

export class CreateNotificationDto {
  @ApiPropertyOptional({ example: 'TEMP-000001' })
  @IsOptional()
  @IsString()
  templateCode?: string;

  @ApiProperty({ enum: NotificationChannel })
  @IsEnum(NotificationChannel)
  channel!: NotificationChannel;

  @ApiPropertyOptional({ enum: NotificationPriority })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiPropertyOptional({ example: { name: 'Jackson' } })
  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @ApiProperty({ type: [RecipientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients!: RecipientDto[];
}
