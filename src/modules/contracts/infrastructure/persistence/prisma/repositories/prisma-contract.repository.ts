import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Contract } from '../../../../domain/entities/contract.entity.js';
import {
  type ContractRepositoryPort,
  type ListContractsFilter,
} from '../../../../application/ports/contract.repository.port.js';
import type { PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import { ContractMapper, type PrismaContractWithRelations } from '../mappers/contract.mapper.js';
import type { ContractStatus, ContractTemplateType } from '../../../../domain/enums/contracts.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaContractRepository implements ContractRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(contract: Contract): Promise<Contract> {
    const data = ContractMapper.toPersistence(contract);
    const versionsData = ContractMapper.toPersistenceVersions(contract.versions);
    const partiesData = ContractMapper.toPersistenceParties(contract.parties);
    const signaturesData = ContractMapper.toPersistenceSignatures(contract.signatures);

    const saved = await this.prisma.$transaction(async (tx) => {
      await tx.contractSignatureModel.deleteMany({ where: { contractId: contract.id } });
      await tx.contractPartyModel.deleteMany({ where: { contractId: contract.id } });
      await tx.contractVersionModel.deleteMany({ where: { contractId: contract.id } });

      const upserted = await tx.contractModel.upsert({
        where: { id: contract.id },
        create: {
          ...data,
          versions: {
            create: versionsData.map((v) => ({
              id: v.id,
              versionNumber: v.versionNumber,
              title: v.title,
              contentSummary: v.contentSummary,
              clausesJson: v.clausesJson,
              changeReason: v.changeReason,
              createdAt: v.createdAt,
              createdBy: v.createdBy,
            })),
          },
          parties: {
            create: partiesData.map((p) => ({
              id: p.id,
              personId: p.personId,
              organizationId: p.organizationId,
              role: p.role,
              isPrimary: p.isPrimary,
            })),
          },
          signatures: {
            create: signaturesData.map((s) => ({
              id: s.id,
              partyId: s.partyId,
              status: s.status,
              signerName: s.signerName,
              signerEmail: s.signerEmail,
              signatureProvider: s.signatureProvider,
              externalEnvelopeId: s.externalEnvelopeId,
              signedAt: s.signedAt,
              ipAddress: s.ipAddress,
            })),
          },
        },
        update: {
          ...data,
          versions: {
            create: versionsData.map((v) => ({
              id: v.id,
              versionNumber: v.versionNumber,
              title: v.title,
              contentSummary: v.contentSummary,
              clausesJson: v.clausesJson,
              changeReason: v.changeReason,
              createdAt: v.createdAt,
              createdBy: v.createdBy,
            })),
          },
          parties: {
            create: partiesData.map((p) => ({
              id: p.id,
              personId: p.personId,
              organizationId: p.organizationId,
              role: p.role,
              isPrimary: p.isPrimary,
            })),
          },
          signatures: {
            create: signaturesData.map((s) => ({
              id: s.id,
              partyId: s.partyId,
              status: s.status,
              signerName: s.signerName,
              signerEmail: s.signerEmail,
              signatureProvider: s.signatureProvider,
              externalEnvelopeId: s.externalEnvelopeId,
              signedAt: s.signedAt,
              ipAddress: s.ipAddress,
            })),
          },
        },
        include: {
          versions: true,
          parties: true,
          signatures: true,
        },
      });

      return upserted;
    });

    return ContractMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Contract | null> {
    const found = await this.prisma.contractModel.findUnique({
      where: { id },
      include: {
        versions: true,
        parties: true,
        signatures: true,
      },
    });

    if (!found) return null;
    return ContractMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<Contract | null> {
    const found = await this.prisma.contractModel.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        versions: true,
        parties: true,
        signatures: true,
      },
    });

    if (!found) return null;
    return ContractMapper.toDomain(found);
  }

  async findAll(filter: ListContractsFilter): Promise<PaginatedResult<Contract>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.ContractModelWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { notes: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.ContractModelWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.eventId ? { eventId: filter.eventId } : {}),
      ...(filter.deliverableId ? { deliverableId: filter.deliverableId } : {}),
      ...(filter.status ? { status: filter.status as unknown as ContractStatus } : {}),
      ...(filter.templateType ? { templateType: filter.templateType as unknown as ContractTemplateType } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.contractModel.count({ where });
    const rawRecords = await this.prisma.contractModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        versions: true,
        parties: true,
        signatures: true,
      },
    });

    const records = rawRecords as unknown as PrismaContractWithRelations[];

    return {
      data: records.map((r) => ContractMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('CTR');
  }
}
