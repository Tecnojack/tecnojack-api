import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean, IsArray,
} from 'class-validator';

export class AddGuestDto {
  @ApiProperty({ example: 'Jackson Palacios' })
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxCompanions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  personId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  notifyGuest?: boolean = false;
}

export class ConfirmRSVPDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isComing!: boolean;

  @ApiPropertyOptional({ type: [String], example: ['Companion 1', 'Companion 2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companions?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestNotes?: string;
}
