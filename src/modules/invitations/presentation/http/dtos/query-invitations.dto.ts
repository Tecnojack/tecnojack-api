import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { InvitationStatus } from '../../../domain/enums/invitations.enums.js';

export class QueryInvitationsDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() @IsString() eventId?: string;
  @ApiPropertyOptional({ enum: InvitationStatus }) @IsOptional() @IsEnum(InvitationStatus) status?: InvitationStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean() includeDeleted?: boolean = false;
}
