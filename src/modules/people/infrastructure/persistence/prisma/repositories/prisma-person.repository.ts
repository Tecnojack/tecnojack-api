import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Person } from '../../../../domain/entities/person.entity.js';
import {
  type PersonRepositoryPort,
  type ListPersonsFilter,
  type PaginatedResult,
} from '../../../../application/ports/person.repository.port.js';
import { PersonMapper, type PrismaPersonWithContacts } from '../mappers/person.mapper.js';
import { DocumentType, PersonStatus } from '../../../../domain/enums/people.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaPersonRepository implements PersonRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(person: Person): Promise<Person> {
    const data = PersonMapper.toPersistence(person);
    const contactsData = PersonMapper.toPersistenceContacts(person.id, person.contactPoints);

    const saved = await this.prisma.$transaction(async (tx) => {
      await tx.personContactInfo.deleteMany({
        where: { personId: person.id },
      });

      const upserted = await tx.person.upsert({
        where: { id: person.id },
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

    return PersonMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Person | null> {
    const found = await this.prisma.person.findUnique({
      where: { id },
      include: { contactInformation: true },
    });

    if (!found) return null;
    return PersonMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<Person | null> {
    const found = await this.prisma.person.findUnique({
      where: { code },
      include: { contactInformation: true },
    });

    if (!found) return null;
    return PersonMapper.toDomain(found);
  }

  async findByDocument(issuingCountry: string, type: string, number: string): Promise<Person | null> {
    const normalizedNumber = number.trim().replace(/[.\s-]/g, '');
    const found = await this.prisma.person.findFirst({
      where: {
        documentIssuingCountry: issuingCountry.toUpperCase(),
        documentType: type as unknown as DocumentType,
        documentNumber: normalizedNumber,
        deletedAt: null,
      },
      include: { contactInformation: true },
    });

    if (!found) return null;
    return PersonMapper.toDomain(found);
  }

  async findAll(filter: ListPersonsFilter): Promise<PaginatedResult<Person>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.PersonWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
          { givenNames: { contains: query, mode: 'insensitive' } },
          { familyNames: { contains: query, mode: 'insensitive' } },
          { documentNumber: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.PersonWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.status ? { status: filter.status as unknown as PersonStatus } : {}),
      ...(filter.country ? { documentIssuingCountry: filter.country.toUpperCase() } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.person.count({ where });
    const rawRecords = await this.prisma.person.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { contactInformation: true },
    });

    const records = rawRecords as unknown as PrismaPersonWithContacts[];

    return {
      data: records.map((r) => PersonMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('PER');
  }
}
