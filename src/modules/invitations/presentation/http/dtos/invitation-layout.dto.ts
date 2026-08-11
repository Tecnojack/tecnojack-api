import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SectionDto {
  @ApiProperty({ example: 'MAP' }) @IsString() @IsNotEmpty() type!: string;
  @ApiProperty({ example: 'Ubicación' }) @IsString() @IsNotEmpty() title!: string;
  @ApiPropertyOptional({ example: { latitude: 4.6097, longitude: -74.0817 } }) @IsOptional() content?: Record<string, unknown>;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() orderIndex?: number;
  @ApiPropertyOptional({ example: true }) @IsOptional() @IsBoolean() isEnabled?: boolean;
}

export class SetSectionsDto {
  @ApiProperty({ type: [SectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections!: SectionDto[];
}

export class ScheduleDto {
  @ApiProperty({ example: 'Ceremonia' }) @IsString() @IsNotEmpty() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ example: '18:00' }) @IsString() @IsNotEmpty() timeLabel!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locationLabel?: string;
  @ApiPropertyOptional() @IsOptional() orderIndex?: number;
}

export class SetSchedulesDto {
  @ApiProperty({ type: [ScheduleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules!: ScheduleDto[];
}
