import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType, PaymentMethod } from '../../../domain/enums/payments.enums.js';

export class RegisterPaymentTransactionDto {
  @ApiPropertyOptional({ description: 'Target installment UUID' })
  @IsOptional()
  @IsUUID()
  installmentId?: string;

  @ApiProperty({ enum: TransactionType, default: TransactionType.PAYMENT })
  @IsEnum(TransactionType)
  transactionType!: TransactionType;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.BANK_TRANSFER })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ description: 'Transaction amount', example: 1000000 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Transaction date ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  transactionDate?: Date;
}
