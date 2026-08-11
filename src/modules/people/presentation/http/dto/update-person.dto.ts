import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType, PersonStatus } from '../../../domain/enums/people.enums.js';
import { ContactInformationDto } from './create-person.dto.js';

export class UpdatePersonDto {
  @ApiPropertyOptional({ description: 'Given / first name(s)', example: 'Gabriel' })
  @IsOptional()
  @IsString()
  givenNames?: string;

  @ApiPropertyOptional({ description: 'Family / last name(s)', example: 'García Márquez' })
  @IsOptional()
  @IsString()
  familyNames?: string;

  @ApiPropertyOptional({ description: 'Display name override', example: 'Gabriel García Márquez' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Name prefix or title', example: 'Don' })
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiPropertyOptional({ description: 'Name suffix', example: 'Jr.' })
  @IsOptional()
  @IsString()
  suffix?: string;

  @ApiPropertyOptional({ description: 'ISO 3166-1 alpha-2 country code of document issuer', example: 'CO' })
  @IsOptional()
  @IsString()
  documentIssuingCountry?: string;

  @ApiPropertyOptional({ enum: DocumentType, description: 'Document type' })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({ description: 'Document number', example: '12345678' })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiPropertyOptional({ description: 'Formatted document number for display', example: '12.345.678' })
  @IsOptional()
  @IsString()
  documentFormatted?: string;

  @ApiPropertyOptional({ enum: PersonStatus, description: 'Business status' })
  @IsOptional()
  @IsEnum(PersonStatus)
  status?: PersonStatus;

  @ApiPropertyOptional({ type: [ContactInformationDto], description: 'Updated contact information points' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInformationDto)
  contacts?: ContactInformationDto[];
}
