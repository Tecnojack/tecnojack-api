import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContractStatus,
  ContractTemplateType,
  ContractPartyRole,
  SignatureStatus,
} from '../../../domain/enums/contracts.enums.js';
import type { Contract } from '../../../domain/entities/contract.entity.js';

export class ContractClauseResponseDto {
  @ApiProperty() number!: string;
  @ApiProperty() title!: string;
  @ApiProperty() body!: string;
  @ApiProperty() isMandatory!: boolean;
}

export class ContractVersionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() contractId!: string;
  @ApiProperty() versionNumber!: number;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() contentSummary?: string | null;
  @ApiProperty({ type: [ContractClauseResponseDto] }) clauses!: ContractClauseResponseDto[];
  @ApiPropertyOptional() changeReason?: string | null;
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() createdBy?: string | null;
}

export class ContractPartyResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() contractId!: string;
  @ApiPropertyOptional() personId?: string | null;
  @ApiPropertyOptional() organizationId?: string | null;
  @ApiProperty({ enum: ContractPartyRole }) role!: ContractPartyRole;
  @ApiProperty() isPrimary!: boolean;
}

export class ContractSignatureResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() contractId!: string;
  @ApiProperty() partyId!: string;
  @ApiProperty({ enum: SignatureStatus }) status!: SignatureStatus;
  @ApiPropertyOptional() signerName?: string | null;
  @ApiPropertyOptional() signerEmail?: string | null;
  @ApiPropertyOptional() signatureProvider?: string | null;
  @ApiPropertyOptional() externalEnvelopeId?: string | null;
  @ApiPropertyOptional() signedAt?: Date | null;
  @ApiPropertyOptional() ipAddress?: string | null;
}

export class ContractResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() eventId!: string;
  @ApiPropertyOptional() deliverableId?: string | null;
  @ApiProperty({ enum: ContractStatus }) status!: ContractStatus;
  @ApiProperty({ enum: ContractTemplateType }) templateType!: ContractTemplateType;
  @ApiProperty() currentVersionNumber!: number;
  @ApiPropertyOptional() notes?: string | null;
  @ApiPropertyOptional() signedAt?: Date | null;
  @ApiPropertyOptional() expiresAt?: Date | null;
  @ApiProperty({ type: [ContractVersionResponseDto] }) versions!: ContractVersionResponseDto[];
  @ApiProperty({ type: [ContractPartyResponseDto] }) parties!: ContractPartyResponseDto[];
  @ApiProperty({ type: [ContractSignatureResponseDto] }) signatures!: ContractSignatureResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() createdBy?: string | null;
  @ApiProperty() updatedAt!: Date;
  @ApiPropertyOptional() updatedBy?: string | null;
  @ApiPropertyOptional() deletedAt?: Date | null;

  static fromDomain(contract: Contract): ContractResponseDto {
    const dto = new ContractResponseDto();
    dto.id = contract.id;
    dto.code = contract.code;
    dto.title = contract.title;
    dto.description = contract.description;
    dto.eventId = contract.eventId;
    dto.deliverableId = contract.deliverableId;
    dto.status = contract.status;
    dto.templateType = contract.templateType;
    dto.currentVersionNumber = contract.currentVersionNumber;
    dto.notes = contract.notes;
    dto.signedAt = contract.signedAt;
    dto.expiresAt = contract.expiresAt;
    dto.versions = contract.versions.map((v) => ({
      id: v.id,
      contractId: v.contractId,
      versionNumber: v.versionNumber,
      title: v.title,
      contentSummary: v.contentSummary,
      clauses: v.clauses.map((c) => ({
        number: c.number,
        title: c.title,
        body: c.body,
        isMandatory: c.isMandatory,
      })),
      changeReason: v.changeReason,
      createdAt: v.createdAt,
      createdBy: v.createdBy,
    }));
    dto.parties = contract.parties.map((p) => ({
      id: p.id,
      contractId: p.contractId,
      personId: p.personId,
      organizationId: p.organizationId,
      role: p.role,
      isPrimary: p.isPrimary,
    }));
    dto.signatures = contract.signatures.map((s) => ({
      id: s.id,
      contractId: s.contractId,
      partyId: s.partyId,
      status: s.status,
      signerName: s.signerName,
      signerEmail: s.signerEmail,
      signatureProvider: s.signatureProvider,
      externalEnvelopeId: s.externalEnvelopeId,
      signedAt: s.signedAt,
      ipAddress: s.ipAddress,
    }));
    dto.createdAt = contract.audit.createdAt;
    dto.createdBy = contract.audit.createdBy;
    dto.updatedAt = contract.audit.updatedAt;
    dto.updatedBy = contract.audit.updatedBy;
    dto.deletedAt = contract.audit.deletedAt;
    return dto;
  }
}
