import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { NotificationChannel, NotificationStatus } from '../../../domain/enums/notifications.enums.js';

export class QueryNotificationsDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @ApiPropertyOptional({ enum: NotificationChannel }) @IsOptional() @IsEnum(NotificationChannel) channel?: NotificationChannel;
  @ApiPropertyOptional({ enum: NotificationStatus }) @IsOptional() @IsEnum(NotificationStatus) status?: NotificationStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() includeDeleted?: boolean = false;
}
