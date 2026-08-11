import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Organization } from '../../../../domain/entities/organization.entity.js';
import {
  type OrganizationRepositoryPort,
  type ListOrganizationsFilter,
} from '../../../../application/ports/organization.repository.port.js';
import { type PaginatedResult } from '../../../../application/ports/person.repository.port.js';
import { OrganizationMapper, type PrismaOrgWithContacts } from '../mappers/organization.mapper.js';
import { OrganizationStatus } from '../../../../domain/enums/people.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';

@Injectable()
export class PrismaOrganizationRepository implements OrganizationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(organization: Organization): Promise<Organization> {
    const data = OrganizationMapper.toPersistence(organization);
    const contactsData = OrganizationMapper.toPersistenceContacts(organization.id, organization.contactPoints);

    const saved = await this.prisma.$transaction(async (tx) => {
      await tx.organizationContactInfo.deleteMany({
        where: { organizationId: organization.id },
      });

      const upserted = await tx.organization.upsert({
        where: { id: organization.id },
        create: {
          ...data,
          contactInformation: {
            create: contactsData.map((c) => ({
              id: c.id,
              type: c.type,
              value: c.value,
              label: c.label,
              isPrimary: c.isPrimary,
            })),
          },
        },
        update: {
          ...data,
          contactInformation: {
            create: contactsData.map((c) => ({
              id: c.id,
              type: c.type,
              value: c.value,
              label: c.label,
              isPrimary: c.isPrimary,
            })),
          },
        },
        include: {
          contactInformation: true,
        },
      });

      return upserted;
    });

    return OrganizationMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Organization | null> {
    const found = await this.prisma.organization.findUnique({
      where: { id },
      include: { contactInformation: true },
    });

    if (!found) return null;
    return OrganizationMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<Organization | null> {
    const found = await this.prisma.organization.findUnique({
      where: { code },
      include: { contactInformation: true },
    });

    if (!found) return null;
    return OrganizationMapper.toDomain(found);
  }

  async findByTaxId(issuingCountry: string, taxId: string): Promise<Organization | null> {
    const normalizedTaxId = taxId.trim().replace(/[.\s-]/g, '');
    const found = await this.prisma.organization.findFirst({
      where: {
        taxIdIssuingCountry: issuingCountry.toUpperCase(),
        taxIdNumber: normalizedTaxId,
        deletedAt: null,
      },
      include: { contactInformation: true },
    });

    if (!found) return null;
    return OrganizationMapper.toDomain(found);
  }

  async findAll(filter: ListOrganizationsFilter): Promise<PaginatedResult<Organization>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.OrganizationWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { legalName: { contains: query, mode: 'insensitive' } },
          { tradeName: { contains: query, mode: 'insensitive' } },
          { taxIdNumber: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.OrganizationWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.status ? { status: filter.status as unknown as OrganizationStatus } : {}),
      ...(filter.country ? { taxIdIssuingCountry: filter.country.toUpperCase() } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.organization.count({ where });
    const rawRecords = await this.prisma.organization.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { contactInformation: true },
    });

    const records = rawRecords as unknown as PrismaOrgWithContacts[];

    return {
      data: records.map((r) => OrganizationMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    const count = await this.prisma.organization.count();
    const nextSeq = count + 1;
    return `ORG-${nextSeq.toString().padStart(6, '0')}`;
  }
}
