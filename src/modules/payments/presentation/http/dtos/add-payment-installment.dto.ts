import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddPaymentInstallmentDto {
  @ApiProperty({ description: 'Installment title', example: 'Cuota Inicial 50%' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Installment amount', example: 1750000 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ description: 'Due date ISO 8601' })
  @Type(() => Date)
  dueDate!: Date;
}
