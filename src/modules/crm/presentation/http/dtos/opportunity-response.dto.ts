import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CRMPipelineStage, QuotationStatus, CRMActivityType } from '../../../domain/enums/crm.enums.js';
import type { Opportunity } from '../../../domain/entities/opportunity.entity.js';

export class QuotationItemResponseDto {
  @ApiProperty() description!: string;
  @ApiProperty() quantity!: number;
  @ApiProperty() unitPrice!: number;
  @ApiProperty() total!: number;
}

export class QuotationResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() quotationNumber!: string;
  @ApiProperty() title!: string;
  @ApiProperty() subtotalAmount!: number;
  @ApiProperty() taxAmount!: number;
  @ApiProperty() totalAmount!: number;
  @ApiProperty({ enum: QuotationStatus }) status!: QuotationStatus;
  @ApiPropertyOptional() validUntil?: Date | null;
  @ApiProperty({ type: [QuotationItemResponseDto] }) items!: QuotationItemResponseDto[];
}

export class CRMActivityResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: CRMActivityType }) activityType!: CRMActivityType;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() notes?: string | null;
  @ApiProperty() occurredAt!: Date;
  @ApiPropertyOptional() actorId?: string | null;
}

export class CRMTaskResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() dueDate!: Date;
  @ApiProperty() isCompleted!: boolean;
  @ApiPropertyOptional() completedAt?: Date | null;
}

export class CustomerJourneyResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: CRMPipelineStage }) fromStage!: CRMPipelineStage;
  @ApiProperty({ enum: CRMPipelineStage }) toStage!: CRMPipelineStage;
  @ApiPropertyOptional() notes?: string | null;
  @ApiProperty() changedAt!: Date;
  @ApiPropertyOptional() actorId?: string | null;
}

export class OpportunityResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiPropertyOptional() personId?: string | null;
  @ApiPropertyOptional() organizationId?: string | null;
  @ApiPropertyOptional() eventId?: string | null;
  @ApiPropertyOptional() contractId?: string | null;
  @ApiPropertyOptional() paymentId?: string | null;
  @ApiProperty({ enum: CRMPipelineStage }) stage!: CRMPipelineStage;
  @ApiProperty() estimatedValue!: number;
  @ApiProperty() currency!: string;
  @ApiProperty() probabilityPercentage!: number;
  @ApiProperty({ type: [QuotationResponseDto] }) quotations!: QuotationResponseDto[];
  @ApiProperty({ type: [CRMActivityResponseDto] }) activities!: CRMActivityResponseDto[];
  @ApiProperty({ type: [CRMTaskResponseDto] }) tasks!: CRMTaskResponseDto[];
  @ApiProperty({ type: [CustomerJourneyResponseDto] }) journeyHistory!: CustomerJourneyResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() createdBy?: string | null;
  @ApiProperty() updatedAt!: Date;
  @ApiPropertyOptional() deletedAt?: Date | null;

  static fromDomain(opportunity: Opportunity): OpportunityResponseDto {
    const dto = new OpportunityResponseDto();
    dto.id = opportunity.id;
    dto.code = opportunity.code;
    dto.title = opportunity.title;
    dto.description = opportunity.description;
    dto.personId = opportunity.personId;
    dto.organizationId = opportunity.organizationId;
    dto.eventId = opportunity.eventId;
    dto.contractId = opportunity.contractId;
    dto.paymentId = opportunity.paymentId;
    dto.stage = opportunity.stage;
    dto.estimatedValue = opportunity.estimatedValue;
    dto.currency = opportunity.currency;
    dto.probabilityPercentage = opportunity.probabilityPercentage;
    dto.quotations = opportunity.quotations.map((q) => ({
      id: q.id,
      quotationNumber: q.quotationNumber,
      title: q.title,
      subtotalAmount: q.subtotalAmount,
      taxAmount: q.taxAmount,
      totalAmount: q.totalAmount,
      status: q.status,
      validUntil: q.validUntil,
      items: q.items as QuotationItemResponseDto[],
    }));
    dto.activities = opportunity.activities.map((a) => ({
      id: a.id,
      activityType: a.activityType,
      title: a.title,
      notes: a.notes,
      occurredAt: a.occurredAt,
      actorId: a.actorId,
    }));
    dto.tasks = opportunity.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      isCompleted: t.isCompleted,
      completedAt: t.completedAt,
    }));
    dto.journeyHistory = opportunity.journeyHistory.map((j) => ({
      id: j.id,
      fromStage: j.fromStage,
      toStage: j.toStage,
      notes: j.notes,
      changedAt: j.changedAt,
      actorId: j.actorId,
    }));
    dto.createdAt = opportunity.audit.createdAt;
    dto.createdBy = opportunity.audit.createdBy;
    dto.updatedAt = opportunity.audit.updatedAt;
    dto.deletedAt = opportunity.audit.deletedAt;
    return dto;
  }
}
