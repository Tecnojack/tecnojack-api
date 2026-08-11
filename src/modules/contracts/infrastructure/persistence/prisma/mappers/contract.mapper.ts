import type {
  ContractModel as PrismaContract,
  ContractVersionModel as PrismaContractVersion,
  ContractPartyModel as PrismaContractParty,
  ContractSignatureModel as PrismaContractSignature,
  Prisma,
} from '../../../../../../generated/prisma/client.js';
import type {
  ContractStatus as PrismaContractStatus,
  ContractTemplateType as PrismaContractTemplateType,
  ContractPartyRole as PrismaContractPartyRole,
  SignatureStatus as PrismaSignatureStatus,
} from '../../../../../../generated/prisma/enums.js';
import { Contract } from '../../../../domain/entities/contract.entity.js';
import { ContractVersion } from '../../../../domain/entities/contract-version.entity.js';
import { ContractParty } from '../../../../domain/entities/contract-party.entity.js';
import { ContractSignature } from '../../../../domain/entities/contract-signature.entity.js';
import { ContractClause, type ContractClauseProps } from '../../../../domain/value-objects/contract-clause.value-object.js';
import type {
  ContractStatus,
  ContractTemplateType,
  ContractPartyRole,
  SignatureStatus,
} from '../../../../domain/enums/contracts.enums.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';

export type PrismaContractWithRelations = PrismaContract & {
  versions?: PrismaContractVersion[];
  parties?: PrismaContractParty[];
  signatures?: PrismaContractSignature[];
};

export interface PersistenceContractData {
  id: string;
  code: string;
  title: string;
  description: string | null;
  eventId: string;
  deliverableId: string | null;
  status: PrismaContractStatus;
  templateType: PrismaContractTemplateType;
  currentVersionNumber: number;
  notes: string | null;
  signedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}

export class ContractMapper {
  static toDomain(raw: PrismaContractWithRelations): Contract {
    const versions = (raw.versions ?? []).map((v) => {
      const clausesRaw = (v.clausesJson as unknown as ContractClauseProps[]) ?? [];
      const clauses = clausesRaw.map((c) => new ContractClause(c));
      return new ContractVersion({
        id: v.id,
        contractId: v.contractId,
        versionNumber: v.versionNumber,
        title: v.title,
        contentSummary: v.contentSummary,
        clauses,
        changeReason: v.changeReason,
        createdAt: v.createdAt,
        createdBy: v.createdBy,
      });
    });

    const parties = (raw.parties ?? []).map(
      (p) =>
        new ContractParty({
          id: p.id,
          contractId: p.contractId,
          personId: p.personId,
          organizationId: p.organizationId,
          role: p.role as unknown as ContractPartyRole,
          isPrimary: p.isPrimary,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }),
    );

    const signatures = (raw.signatures ?? []).map(
      (s) =>
        new ContractSignature({
          id: s.id,
          contractId: s.contractId,
          partyId: s.partyId,
          status: s.status as unknown as SignatureStatus,
          signerName: s.signerName,
          signerEmail: s.signerEmail,
          signatureProvider: s.signatureProvider,
          externalEnvelopeId: s.externalEnvelopeId,
          signedAt: s.signedAt,
          ipAddress: s.ipAddress,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        }),
    );

    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });

    return new Contract({
      id: raw.id,
      code: raw.code,
      title: raw.title,
      description: raw.description,
      eventId: raw.eventId,
      deliverableId: raw.deliverableId,
      status: raw.status as unknown as ContractStatus,
      templateType: raw.templateType as unknown as ContractTemplateType,
      currentVersionNumber: raw.currentVersionNumber,
      notes: raw.notes,
      signedAt: raw.signedAt,
      expiresAt: raw.expiresAt,
      versions,
      parties,
      signatures,
      audit,
    });
  }

  static toPersistence(entity: Contract): PersistenceContractData {
    return {
      id: entity.id,
      code: entity.code,
      title: entity.title,
      description: entity.description,
      eventId: entity.eventId,
      deliverableId: entity.deliverableId,
      status: entity.status as unknown as PrismaContractStatus,
      templateType: entity.templateType as unknown as PrismaContractTemplateType,
      currentVersionNumber: entity.currentVersionNumber,
      notes: entity.notes,
      signedAt: entity.signedAt,
      expiresAt: entity.expiresAt,
      createdAt: entity.audit.createdAt,
      createdBy: entity.audit.createdBy,
      updatedAt: entity.audit.updatedAt,
      updatedBy: entity.audit.updatedBy,
      deletedAt: entity.audit.deletedAt,
      deletedBy: entity.audit.deletedBy,
    };
  }

  static toPersistenceVersions(versions: readonly ContractVersion[]): {
    id: string;
    contractId: string;
    versionNumber: number;
    title: string;
    contentSummary: string | null;
    clausesJson: Prisma.InputJsonValue;
    changeReason: string | null;
    createdAt: Date;
    createdBy: string | null;
  }[] {
    return versions.map((v) => ({
      id: v.id,
      contractId: v.contractId,
      versionNumber: v.versionNumber,
      title: v.title,
      contentSummary: v.contentSummary,
      clausesJson: v.clauses.map((c) => ({
        number: c.number,
        title: c.title,
        body: c.body,
        isMandatory: c.isMandatory,
      })) as unknown as Prisma.InputJsonValue,
      changeReason: v.changeReason,
      createdAt: v.createdAt,
      createdBy: v.createdBy,
    }));
  }

  static toPersistenceParties(parties: readonly ContractParty[]): {
    id: string;
    contractId: string;
    personId: string | null;
    organizationId: string | null;
    role: PrismaContractPartyRole;
    isPrimary: boolean;
  }[] {
    return parties.map((p) => ({
      id: p.id,
      contractId: p.contractId,
      personId: p.personId,
      organizationId: p.organizationId,
      role: p.role as unknown as PrismaContractPartyRole,
      isPrimary: p.isPrimary,
    }));
  }

  static toPersistenceSignatures(signatures: readonly ContractSignature[]): {
    id: string;
    contractId: string;
    partyId: string;
    status: PrismaSignatureStatus;
    signerName: string | null;
    signerEmail: string | null;
    signatureProvider: string | null;
    externalEnvelopeId: string | null;
    signedAt: Date | null;
    ipAddress: string | null;
  }[] {
    return signatures.map((s) => ({
      id: s.id,
      contractId: s.contractId,
      partyId: s.partyId,
      status: s.status as unknown as PrismaSignatureStatus,
      signerName: s.signerName,
      signerEmail: s.signerEmail,
      signatureProvider: s.signatureProvider,
      externalEnvelopeId: s.externalEnvelopeId,
      signedAt: s.signedAt,
      ipAddress: s.ipAddress,
    }));
  }
}
