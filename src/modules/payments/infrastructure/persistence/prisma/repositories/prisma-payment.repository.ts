import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Payment } from '../../../../domain/entities/payment.entity.js';
import {
  type PaymentRepositoryPort,
  type ListPaymentsFilter,
} from '../../../../application/ports/payment.repository.port.js';
import type { PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import { PaymentMapper, type PrismaPaymentWithRelations } from '../mappers/payment.mapper.js';
import type { PaymentStatus, PaymentPlan } from '../../../../domain/enums/payments.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(payment: Payment): Promise<Payment> {
    const data = PaymentMapper.toPersistence(payment);
    const installmentsData = PaymentMapper.toPersistenceInstallments(payment.installments);
    const transactionsData = PaymentMapper.toPersistenceTransactions(payment.transactions);

    const saved = await this.prisma.$transaction(async (tx) => {
      await tx.paymentTransactionModel.deleteMany({ where: { paymentId: payment.id } });
      await tx.paymentInstallmentModel.deleteMany({ where: { paymentId: payment.id } });

      const upserted = await tx.paymentModel.upsert({
        where: { id: payment.id },
        create: {
          ...data,
          installments: {
            create: installmentsData.map((i) => ({
              id: i.id,
              installmentNumber: i.installmentNumber,
              title: i.title,
              amount: i.amount,
              paidAmount: i.paidAmount,
              status: i.status,
              dueDate: i.dueDate,
            })),
          },
          transactions: {
            create: transactionsData.map((t) => ({
              id: t.id,
              installmentId: t.installmentId,
              transactionType: t.transactionType,
              paymentMethod: t.paymentMethod,
              amount: t.amount,
              referenceNumber: t.referenceNumber,
              notes: t.notes,
              transactionDate: t.transactionDate,
              actorId: t.actorId,
            })),
          },
        },
        update: {
          ...data,
          installments: {
            create: installmentsData.map((i) => ({
              id: i.id,
              installmentNumber: i.installmentNumber,
              title: i.title,
              amount: i.amount,
              paidAmount: i.paidAmount,
              status: i.status,
              dueDate: i.dueDate,
            })),
          },
          transactions: {
            create: transactionsData.map((t) => ({
              id: t.id,
              installmentId: t.installmentId,
              transactionType: t.transactionType,
              paymentMethod: t.paymentMethod,
              amount: t.amount,
              referenceNumber: t.referenceNumber,
              notes: t.notes,
              transactionDate: t.transactionDate,
              actorId: t.actorId,
            })),
          },
        },
        include: {
          installments: true,
          transactions: true,
        },
      });

      return upserted;
    });

    return PaymentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Payment | null> {
    const found = await this.prisma.paymentModel.findUnique({
      where: { id },
      include: {
        installments: true,
        transactions: true,
      },
    });

    if (!found) return null;
    return PaymentMapper.toDomain(found);
  }

  async findByCode(code: string): Promise<Payment | null> {
    const found = await this.prisma.paymentModel.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        installments: true,
        transactions: true,
      },
    });

    if (!found) return null;
    return PaymentMapper.toDomain(found);
  }

  async findAll(filter: ListPaymentsFilter): Promise<PaginatedResult<Payment>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.PaymentModelWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.PaymentModelWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.eventId ? { eventId: filter.eventId } : {}),
      ...(filter.contractId ? { contractId: filter.contractId } : {}),
      ...(filter.deliverableId ? { deliverableId: filter.deliverableId } : {}),
      ...(filter.payerPersonId ? { payerPersonId: filter.payerPersonId } : {}),
      ...(filter.payerOrganizationId ? { payerOrganizationId: filter.payerOrganizationId } : {}),
      ...(filter.status ? { status: filter.status as unknown as PaymentStatus } : {}),
      ...(filter.paymentPlan ? { paymentPlan: filter.paymentPlan as unknown as PaymentPlan } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.paymentModel.count({ where });
    const rawRecords = await this.prisma.paymentModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        installments: true,
        transactions: true,
      },
    });

    const records = rawRecords as unknown as PrismaPaymentWithRelations[];

    return {
      data: records.map((r) => PaymentMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('PAY');
  }
}
