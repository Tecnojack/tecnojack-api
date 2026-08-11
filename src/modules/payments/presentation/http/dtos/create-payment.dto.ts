import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentPlan } from '../../../domain/enums/payments.enums.js';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment title', example: 'Cobro de Cobertura Boda' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event UUID' })
  @IsUUID()
  eventId!: string;

  @ApiPropertyOptional({ description: 'Contract UUID' })
  @IsOptional()
  @IsUUID()
  contractId?: string;

  @ApiPropertyOptional({ description: 'Deliverable UUID' })
  @IsOptional()
  @IsUUID()
  deliverableId?: string;

  @ApiPropertyOptional({ description: 'Payer Person UUID' })
  @IsOptional()
  @IsUUID()
  payerPersonId?: string;

  @ApiPropertyOptional({ description: 'Payer Organization UUID' })
  @IsOptional()
  @IsUUID()
  payerOrganizationId?: string;

  @ApiProperty({ description: 'Total amount', example: 3500000 })
  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @ApiPropertyOptional({ default: 'COP' })
  @IsOptional()
  @IsString()
  currency?: string = 'COP';

  @ApiPropertyOptional({ enum: PaymentPlan, default: PaymentPlan.FULL_PAYMENT })
  @IsOptional()
  @IsEnum(PaymentPlan)
  paymentPlan?: PaymentPlan;

  @ApiPropertyOptional({ description: 'Due date ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;
}
