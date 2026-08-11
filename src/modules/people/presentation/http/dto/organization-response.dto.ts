import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationStatus } from '../../../domain/enums/people.enums.js';
import { Organization } from '../../../domain/entities/organization.entity.js';
import { ContactInformation } from '../../../domain/value-objects/contact-information.value-object.js';
import { ContactInformationResponseDto, AuditInfoResponseDto } from './person-response.dto.js';

export class OrganizationNameResponseDto {
  @ApiProperty({ example: 'Tecnojack Producciones S.A.S.' })
  legalName!: string;

  @ApiPropertyOptional({ example: 'TECNOJACK' })
  tradeName?: string | null;

  @ApiProperty({ example: 'TECNOJACK' })
  displayName!: string;
}

export class TaxDocumentResponseDto {
  @ApiProperty({ example: 'CO' })
  issuingCountry!: string;

  @ApiProperty({ example: '901234567' })
  taxId!: string;

  @ApiPropertyOptional({ example: '8' })
  verificationDigit?: string | null;

  @ApiProperty({ example: '901234567-8' })
  formattedTaxId!: string;
}

export class OrganizationResponseDto {
  @ApiProperty({ example: 'c12ee99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  id!: string;

  @ApiProperty({ example: 'ORG-000001' })
  code!: string;

  @ApiProperty({ type: OrganizationNameResponseDto })
  name!: OrganizationNameResponseDto;

  @ApiPropertyOptional({ type: TaxDocumentResponseDto })
  taxDocument?: TaxDocumentResponseDto | null;

  @ApiProperty({ enum: OrganizationStatus })
  status!: OrganizationStatus;

  @ApiProperty({ type: [ContactInformationResponseDto] })
  contacts!: ContactInformationResponseDto[];

  @ApiProperty({ type: AuditInfoResponseDto })
  audit!: AuditInfoResponseDto;

  static fromDomain(entity: Organization): OrganizationResponseDto {
    return {
      id: entity.id,
      code: entity.code,
      name: {
        legalName: entity.name.legalName,
        tradeName: entity.name.tradeName,
        displayName: entity.name.displayName,
      },
      taxDocument: entity.taxDocument
        ? {
            issuingCountry: entity.taxDocument.issuingCountry,
            taxId: entity.taxDocument.taxId,
            verificationDigit: entity.taxDocument.verificationDigit,
            formattedTaxId: entity.taxDocument.formattedTaxId,
          }
        : null,
      status: entity.status,
      contacts: entity.contactPoints.map((c: ContactInformation) => ({
        id: c.id,
        type: c.type,
        value: c.value,
        label: c.label,
        isPrimary: c.isPrimary,
      })),
      audit: {
        createdAt: entity.audit.createdAt,
        createdBy: entity.audit.createdBy,
        updatedAt: entity.audit.updatedAt,
        updatedBy: entity.audit.updatedBy,
        deletedAt: entity.audit.deletedAt,
        deletedBy: entity.audit.deletedBy,
      },
    };
  }
}
