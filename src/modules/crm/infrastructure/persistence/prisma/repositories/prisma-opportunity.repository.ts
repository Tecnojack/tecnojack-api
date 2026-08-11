import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Opportunity } from '../../../../domain/entities/opportunity.entity.js';
import { Quotation } from '../../../../domain/entities/quotation.entity.js';
import { CustomerJourney } from '../../../../domain/entities/customer-journey.entity.js';
import { CRMActivity } from '../../../../domain/entities/crm-activity.entity.js';
import { CRMTask } from '../../../../domain/entities/crm-task.entity.js';
import type {
  OpportunityRepositoryPort,
  ListOpportunitiesFilter,
} from '../../../../application/ports/opportunity.repository.port.js';
import type { PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import type {
  CRMPipelineStage,
  QuotationStatus,
  CRMActivityType,
} from '../../../../domain/enums/crm.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import type {
  OpportunityModel as PrismaOpportunity,
  QuotationModel as PrismaQuotation,
  CustomerJourneyModel as PrismaCustomerJourney,
  CRMActivityModel as PrismaCRMActivity,
  CRMTaskModel as PrismaCRMTask,
} from '../../../../../../generated/prisma/client.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

type PrismaOpportunityWithRelations = PrismaOpportunity & {
  quotations: PrismaQuotation[];
  activities: PrismaCRMActivity[];
  tasks: PrismaCRMTask[];
  journeyHistory: PrismaCustomerJourney[];
};

@Injectable()
export class PrismaOpportunityRepository implements OpportunityRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(opportunity: Opportunity): Promise<Opportunity> {
    await this.prisma.$transaction(async (tx) => {
      await tx.cRMActivityModel.deleteMany({ where: { opportunityId: opportunity.id } });
      await tx.cRMTaskModel.deleteMany({ where: { opportunityId: opportunity.id } });
      await tx.quotationModel.deleteMany({ where: { opportunityId: opportunity.id } });

      await tx.opportunityModel.upsert({
        where: { id: opportunity.id },
        create: {
          id: opportunity.id,
          code: opportunity.code,
          title: opportunity.title,
          description: opportunity.description,
          personId: opportunity.personId,
          organizationId: opportunity.organizationId,
          eventId: opportunity.eventId,
          contractId: opportunity.contractId,
          paymentId: opportunity.paymentId,
          stage: opportunity.stage as string as never,
          estimatedValue: opportunity.estimatedValue,
          currency: opportunity.currency,
          probabilityPercentage: opportunity.probabilityPercentage,
          createdAt: opportunity.audit.createdAt,
          createdBy: opportunity.audit.createdBy,
          updatedAt: opportunity.audit.updatedAt,
          updatedBy: opportunity.audit.updatedBy,
          deletedAt: opportunity.audit.deletedAt,
          deletedBy: opportunity.audit.deletedBy,
        },
        update: {
          title: opportunity.title,
          description: opportunity.description,
          eventId: opportunity.eventId,
          contractId: opportunity.contractId,
          paymentId: opportunity.paymentId,
          stage: opportunity.stage as string as never,
          estimatedValue: opportunity.estimatedValue,
          currency: opportunity.currency,
          probabilityPercentage: opportunity.probabilityPercentage,
          updatedAt: opportunity.audit.updatedAt,
          updatedBy: opportunity.audit.updatedBy,
          deletedAt: opportunity.audit.deletedAt,
          deletedBy: opportunity.audit.deletedBy,
        },
      });

      for (const q of opportunity.quotations) {
        await tx.quotationModel.create({
          data: {
            id: q.id,
            opportunityId: opportunity.id,
            quotationNumber: q.quotationNumber,
            title: q.title,
            subtotalAmount: q.subtotalAmount,
            taxAmount: q.taxAmount,
            totalAmount: q.totalAmount,
            status: q.status as string as never,
            validUntil: q.validUntil,
            itemsJson: q.items.length > 0 ? JSON.stringify(q.items) : undefined,
            createdAt: q.createdAt,
            createdBy: q.createdBy,
            updatedAt: q.updatedAt,
          },
        });
      }

      for (const a of opportunity.activities) {
        await tx.cRMActivityModel.create({
          data: {
            id: a.id,
            opportunityId: opportunity.id,
            activityType: a.activityType as string as never,
            title: a.title,
            notes: a.notes,
            occurredAt: a.occurredAt,
            actorId: a.actorId,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
          },
        });
      }

      for (const t of opportunity.tasks) {
        await tx.cRMTaskModel.create({
          data: {
            id: t.id,
            opportunityId: opportunity.id,
            title: t.title,
            description: t.description,
            dueDate: t.dueDate,
            isCompleted: t.isCompleted,
            completedAt: t.completedAt,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
          },
        });
      }

      for (const j of opportunity.journeyHistory) {
        await tx.customerJourneyModel.upsert({
          where: { id: j.id },
          create: {
            id: j.id,
            opportunityId: opportunity.id,
            fromStage: j.fromStage as string as never,
            toStage: j.toStage as string as never,
            notes: j.notes,
            changedAt: j.changedAt,
            actorId: j.actorId,
          },
          update: {},
        });
      }
    });

    return (await this.findById(opportunity.id))!;
  }

  async findById(id: string): Promise<Opportunity | null> {
    const raw = await this.prisma.opportunityModel.findUnique({
      where: { id },
      include: { quotations: true, activities: true, tasks: true, journeyHistory: true },
    });
    if (!raw) return null;
    return this.toDomain(raw as PrismaOpportunityWithRelations);
  }

  async findByCode(code: string): Promise<Opportunity | null> {
    const raw = await this.prisma.opportunityModel.findUnique({
      where: { code: code.toUpperCase() },
      include: { quotations: true, activities: true, tasks: true, journeyHistory: true },
    });
    if (!raw) return null;
    return this.toDomain(raw as PrismaOpportunityWithRelations);
  }

  async findAll(filter: ListOpportunitiesFilter): Promise<PaginatedResult<Opportunity>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.OpportunityModelWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.OpportunityModelWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.stage ? { stage: filter.stage as string as never } : {}),
      ...(filter.personId ? { personId: filter.personId } : {}),
      ...(filter.organizationId ? { organizationId: filter.organizationId } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.opportunityModel.count({ where });
    const records = await this.prisma.opportunityModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { quotations: true, activities: true, tasks: true, journeyHistory: true },
    });

    return {
      data: (records as PrismaOpportunityWithRelations[]).map((r) => this.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('OPP');
  }

  private toDomain(raw: PrismaOpportunityWithRelations): Opportunity {
    const quotations = raw.quotations.map(
      (q: PrismaQuotation) =>
        new Quotation({
          id: q.id,
          opportunityId: q.opportunityId,
          quotationNumber: q.quotationNumber,
          title: q.title,
          subtotalAmount: Number(q.subtotalAmount),
          taxAmount: Number(q.taxAmount),
          totalAmount: Number(q.totalAmount),
          status: q.status as unknown as QuotationStatus,
          validUntil: q.validUntil,
          items: q.itemsJson ? (JSON.parse(JSON.stringify(q.itemsJson)) as { description: string; quantity: number; unitPrice: number; total: number }[]) : [],
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
          createdBy: q.createdBy,
        }),
    );

    const activities = raw.activities.map(
      (a: PrismaCRMActivity) =>
        new CRMActivity({
          id: a.id,
          opportunityId: a.opportunityId,
          activityType: a.activityType as unknown as CRMActivityType,
          title: a.title,
          notes: a.notes,
          occurredAt: a.occurredAt,
          actorId: a.actorId,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        }),
    );

    const tasks = raw.tasks.map(
      (t: PrismaCRMTask) =>
        new CRMTask({
          id: t.id,
          opportunityId: t.opportunityId,
          title: t.title,
          description: t.description,
          dueDate: t.dueDate,
          isCompleted: t.isCompleted,
          completedAt: t.completedAt,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }),
    );

    const journeyHistory = raw.journeyHistory.map(
      (j: PrismaCustomerJourney) =>
        new CustomerJourney({
          id: j.id,
          opportunityId: j.opportunityId,
          fromStage: j.fromStage as unknown as CRMPipelineStage,
          toStage: j.toStage as unknown as CRMPipelineStage,
          notes: j.notes,
          changedAt: j.changedAt,
          actorId: j.actorId,
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

    return new Opportunity({
      id: raw.id,
      code: raw.code,
      title: raw.title,
      description: raw.description,
      personId: raw.personId,
      organizationId: raw.organizationId,
      eventId: raw.eventId,
      contractId: raw.contractId,
      paymentId: raw.paymentId,
      stage: raw.stage as unknown as CRMPipelineStage,
      estimatedValue: Number(raw.estimatedValue),
      currency: raw.currency,
      probabilityPercentage: raw.probabilityPercentage,
      quotations,
      activities,
      tasks,
      journeyHistory,
      audit,
    });
  }
}
