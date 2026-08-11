import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrganizationStatus } from '../../../domain/enums/people.enums.js';
import { ContactInformationDto } from './create-person.dto.js';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'Official legal name (razón social)', example: 'Tecnojack Producciones S.A.S.' })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({ description: 'Trade or commercial name (nombre comercial)', example: 'TECNOJACK' })
  @IsOptional()
  @IsString()
  tradeName?: string;

  @ApiPropertyOptional({ description: 'ISO 2-letter country code of tax jurisdiction', example: 'CO' })
  @IsOptional()
  @IsString()
  taxIdIssuingCountry?: string;

  @ApiPropertyOptional({ description: 'Tax Identification Number (NIT / RUT / EIN)', example: '901234567' })
  @IsOptional()
  @IsString()
  taxIdNumber?: string;

  @ApiPropertyOptional({ description: 'Verification digit if applicable (Dígito de verificación)', example: '8' })
  @IsOptional()
  @IsString()
  taxIdVerificationDigit?: string;

  @ApiPropertyOptional({ enum: OrganizationStatus, description: 'Business status' })
  @IsOptional()
  @IsEnum(OrganizationStatus)
  status?: OrganizationStatus;

  @ApiPropertyOptional({ type: [ContactInformationDto], description: 'Updated contact points' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInformationDto)
  contacts?: ContactInformationDto[];
}
