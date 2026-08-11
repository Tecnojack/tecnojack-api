import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonStatus, DocumentType, ContactType } from '../../../domain/enums/people.enums.js';
import { Person } from '../../../domain/entities/person.entity.js';
import { ContactInformation } from '../../../domain/value-objects/contact-information.value-object.js';

export class PersonNameResponseDto {
  @ApiProperty({ example: 'Gabriel' })
  givenNames!: string;

  @ApiPropertyOptional({ example: 'García Márquez' })
  familyNames?: string | null;

  @ApiProperty({ example: 'Gabriel García Márquez' })
  displayName!: string;

  @ApiPropertyOptional({ example: 'Don' })
  prefix?: string | null;

  @ApiPropertyOptional({ example: 'Jr.' })
  suffix?: string | null;
}

export class DocumentResponseDto {
  @ApiProperty({ example: 'CO' })
  issuingCountry!: string;

  @ApiProperty({ enum: DocumentType })
  type!: DocumentType;

  @ApiProperty({ example: '12345678' })
  number!: string;

  @ApiPropertyOptional({ example: '12.345.678' })
  formattedNumber?: string | null;
}

export class ContactInformationResponseDto {
  @ApiPropertyOptional({ example: 'b5f3a092-...' })
  id?: string | null;

  @ApiProperty({ enum: ContactType })
  type!: ContactType;

  @ApiProperty({ example: 'gabo@macondo.com' })
  value!: string;

  @ApiPropertyOptional({ example: 'Personal' })
  label?: string | null;

  @ApiProperty({ example: true })
  isPrimary!: boolean;
}

export class AuditInfoResponseDto {
  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional()
  createdBy?: string | null;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional()
  updatedBy?: string | null;

  @ApiPropertyOptional()
  deletedAt?: Date | null;

  @ApiPropertyOptional()
  deletedBy?: string | null;
}

export class PersonResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  id!: string;

  @ApiProperty({ example: 'PER-000001' })
  code!: string;

  @ApiProperty({ type: PersonNameResponseDto })
  name!: PersonNameResponseDto;

  @ApiPropertyOptional({ type: DocumentResponseDto })
  document?: DocumentResponseDto | null;

  @ApiProperty({ enum: PersonStatus })
  status!: PersonStatus;

  @ApiProperty({ type: [ContactInformationResponseDto] })
  contacts!: ContactInformationResponseDto[];

  @ApiProperty({ type: AuditInfoResponseDto })
  audit!: AuditInfoResponseDto;

  static fromDomain(entity: Person): PersonResponseDto {
    return {
      id: entity.id,
      code: entity.code,
      name: {
        givenNames: entity.name.givenNames,
        familyNames: entity.name.familyNames,
        displayName: entity.name.displayName,
        prefix: entity.name.prefix,
        suffix: entity.name.suffix,
      },
      document: entity.document
        ? {
            issuingCountry: entity.document.issuingCountry,
            type: entity.document.type,
            number: entity.document.number,
            formattedNumber: entity.document.formattedNumber,
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
