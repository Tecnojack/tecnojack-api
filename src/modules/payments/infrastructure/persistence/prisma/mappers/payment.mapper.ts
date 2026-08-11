import type {
  PaymentModel as PrismaPayment,
  PaymentInstallmentModel as PrismaPaymentInstallment,
  PaymentTransactionModel as PrismaPaymentTransaction,
} from '../../../../../../generated/prisma/client.js';
import type {
  PaymentStatus as PrismaPaymentStatus,
  PaymentPlan as PrismaPaymentPlan,
  InstallmentStatus as PrismaInstallmentStatus,
  PaymentMethod as PrismaPaymentMethod,
  TransactionType as PrismaTransactionType,
} from '../../../../../../generated/prisma/enums.js';
import { Payment } from '../../../../domain/entities/payment.entity.js';
import { PaymentInstallment } from '../../../../domain/entities/payment-installment.entity.js';
import { PaymentTransaction } from '../../../../domain/entities/payment-transaction.entity.js';
import type {
  PaymentStatus,
  PaymentPlan,
  InstallmentStatus,
  PaymentMethod,
  TransactionType,
} from '../../../../domain/enums/payments.enums.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';

export type PrismaPaymentWithRelations = PrismaPayment & {
  installments?: PrismaPaymentInstallment[];
  transactions?: PrismaPaymentTransaction[];
};

export interface PersistencePaymentData {
  id: string;
  code: string;
  title: string;
  description: string | null;
  eventId: string;
  contractId: string | null;
  deliverableId: string | null;
  payerPersonId: string | null;
  payerOrganizationId: string | null;
  status: PrismaPaymentStatus;
  paymentPlan: PrismaPaymentPlan;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  currency: string;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}

export class PaymentMapper {
  static toDomain(raw: PrismaPaymentWithRelations): Payment {
    const installments = (raw.installments ?? []).map(
      (i) =>
        new PaymentInstallment({
          id: i.id,
          paymentId: i.paymentId,
          installmentNumber: i.installmentNumber,
          title: i.title,
          amount: Number(i.amount),
          paidAmount: Number(i.paidAmount),
          status: i.status as unknown as InstallmentStatus,
          dueDate: i.dueDate,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
        }),
    );

    const transactions = (raw.transactions ?? []).map(
      (t) =>
        new PaymentTransaction({
          id: t.id,
          paymentId: t.paymentId,
          installmentId: t.installmentId,
          transactionType: t.transactionType as unknown as TransactionType,
          paymentMethod: t.paymentMethod as unknown as PaymentMethod,
          amount: Number(t.amount),
          referenceNumber: t.referenceNumber,
          notes: t.notes,
          transactionDate: t.transactionDate,
          actorId: t.actorId,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
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

    return new Payment({
      id: raw.id,
      code: raw.code,
      title: raw.title,
      description: raw.description,
      eventId: raw.eventId,
      contractId: raw.contractId,
      deliverableId: raw.deliverableId,
      payerPersonId: raw.payerPersonId,
      payerOrganizationId: raw.payerOrganizationId,
      status: raw.status as unknown as PaymentStatus,
      paymentPlan: raw.paymentPlan as unknown as PaymentPlan,
      totalAmount: Number(raw.totalAmount),
      paidAmount: Number(raw.paidAmount),
      pendingAmount: Number(raw.pendingAmount),
      currency: raw.currency,
      dueDate: raw.dueDate,
      completedAt: raw.completedAt,
      installments,
      transactions,
      audit,
    });
  }

  static toPersistence(entity: Payment): PersistencePaymentData {
    return {
      id: entity.id,
      code: entity.code,
      title: entity.title,
      description: entity.description,
      eventId: entity.eventId,
      contractId: entity.contractId,
      deliverableId: entity.deliverableId,
      payerPersonId: entity.payerPersonId,
      payerOrganizationId: entity.payerOrganizationId,
      status: entity.status as unknown as PrismaPaymentStatus,
      paymentPlan: entity.paymentPlan as unknown as PrismaPaymentPlan,
      totalAmount: entity.totalAmount,
      paidAmount: entity.paidAmount,
      pendingAmount: entity.pendingAmount,
      currency: entity.currency,
      dueDate: entity.dueDate,
      completedAt: entity.completedAt,
      createdAt: entity.audit.createdAt,
      createdBy: entity.audit.createdBy,
      updatedAt: entity.audit.updatedAt,
      updatedBy: entity.audit.updatedBy,
      deletedAt: entity.audit.deletedAt,
      deletedBy: entity.audit.deletedBy,
    };
  }

  static toPersistenceInstallments(installments: readonly PaymentInstallment[]): {
    id: string;
    paymentId: string;
    installmentNumber: number;
    title: string;
    amount: number;
    paidAmount: number;
    status: PrismaInstallmentStatus;
    dueDate: Date;
  }[] {
    return installments.map((i) => ({
      id: i.id,
      paymentId: i.paymentId,
      installmentNumber: i.installmentNumber,
      title: i.title,
      amount: i.amount,
      paidAmount: i.paidAmount,
      status: i.status as unknown as PrismaInstallmentStatus,
      dueDate: i.dueDate,
    }));
  }

  static toPersistenceTransactions(transactions: readonly PaymentTransaction[]): {
    id: string;
    paymentId: string;
    installmentId: string | null;
    transactionType: PrismaTransactionType;
    paymentMethod: PrismaPaymentMethod;
    amount: number;
    referenceNumber: string | null;
    notes: string | null;
    transactionDate: Date;
    actorId: string | null;
  }[] {
    return transactions.map((t) => ({
      id: t.id,
      paymentId: t.paymentId,
      installmentId: t.installmentId,
      transactionType: t.transactionType as unknown as PrismaTransactionType,
      paymentMethod: t.paymentMethod as unknown as PrismaPaymentMethod,
      amount: t.amount,
      referenceNumber: t.referenceNumber,
      notes: t.notes,
      transactionDate: t.transactionDate,
      actorId: t.actorId,
    }));
  }
}
