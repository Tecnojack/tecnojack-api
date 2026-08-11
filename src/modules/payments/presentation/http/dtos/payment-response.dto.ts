import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentStatus,
  PaymentPlan,
  InstallmentStatus,
  PaymentMethod,
  TransactionType,
} from '../../../domain/enums/payments.enums.js';
import type { Payment } from '../../../domain/entities/payment.entity.js';

export class PaymentInstallmentResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() paymentId!: string;
  @ApiProperty() installmentNumber!: number;
  @ApiProperty() title!: string;
  @ApiProperty() amount!: number;
  @ApiProperty() paidAmount!: number;
  @ApiProperty({ enum: InstallmentStatus }) status!: InstallmentStatus;
  @ApiProperty() dueDate!: Date;
}

export class PaymentTransactionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() paymentId!: string;
  @ApiPropertyOptional() installmentId?: string | null;
  @ApiProperty({ enum: TransactionType }) transactionType!: TransactionType;
  @ApiProperty({ enum: PaymentMethod }) paymentMethod!: PaymentMethod;
  @ApiProperty() amount!: number;
  @ApiPropertyOptional() referenceNumber?: string | null;
  @ApiPropertyOptional() notes?: string | null;
  @ApiProperty() transactionDate!: Date;
  @ApiPropertyOptional() actorId?: string | null;
}

export class PaymentResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() eventId!: string;
  @ApiPropertyOptional() contractId?: string | null;
  @ApiPropertyOptional() deliverableId?: string | null;
  @ApiPropertyOptional() payerPersonId?: string | null;
  @ApiPropertyOptional() payerOrganizationId?: string | null;
  @ApiProperty({ enum: PaymentStatus }) status!: PaymentStatus;
  @ApiProperty({ enum: PaymentPlan }) paymentPlan!: PaymentPlan;
  @ApiProperty() totalAmount!: number;
  @ApiProperty() paidAmount!: number;
  @ApiProperty() pendingAmount!: number;
  @ApiProperty() currency!: string;
  @ApiPropertyOptional() dueDate?: Date | null;
  @ApiPropertyOptional() completedAt?: Date | null;
  @ApiProperty({ type: [PaymentInstallmentResponseDto] }) installments!: PaymentInstallmentResponseDto[];
  @ApiProperty({ type: [PaymentTransactionResponseDto] }) transactions!: PaymentTransactionResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() createdBy?: string | null;
  @ApiProperty() updatedAt!: Date;
  @ApiPropertyOptional() updatedBy?: string | null;
  @ApiPropertyOptional() deletedAt?: Date | null;

  static fromDomain(payment: Payment): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id;
    dto.code = payment.code;
    dto.title = payment.title;
    dto.description = payment.description;
    dto.eventId = payment.eventId;
    dto.contractId = payment.contractId;
    dto.deliverableId = payment.deliverableId;
    dto.payerPersonId = payment.payerPersonId;
    dto.payerOrganizationId = payment.payerOrganizationId;
    dto.status = payment.status;
    dto.paymentPlan = payment.paymentPlan;
    dto.totalAmount = payment.totalAmount;
    dto.paidAmount = payment.paidAmount;
    dto.pendingAmount = payment.pendingAmount;
    dto.currency = payment.currency;
    dto.dueDate = payment.dueDate;
    dto.completedAt = payment.completedAt;
    dto.installments = payment.installments.map((i) => ({
      id: i.id,
      paymentId: i.paymentId,
      installmentNumber: i.installmentNumber,
      title: i.title,
      amount: i.amount,
      paidAmount: i.paidAmount,
      status: i.status,
      dueDate: i.dueDate,
    }));
    dto.transactions = payment.transactions.map((t) => ({
      id: t.id,
      paymentId: t.paymentId,
      installmentId: t.installmentId,
      transactionType: t.transactionType,
      paymentMethod: t.paymentMethod,
      amount: t.amount,
      referenceNumber: t.referenceNumber,
      notes: t.notes,
      transactionDate: t.transactionDate,
      actorId: t.actorId,
    }));
    dto.createdAt = payment.audit.createdAt;
    dto.createdBy = payment.audit.createdBy;
    dto.updatedAt = payment.audit.updatedAt;
    dto.updatedBy = payment.audit.updatedBy;
    dto.deletedAt = payment.audit.deletedAt;
    return dto;
  }
}
