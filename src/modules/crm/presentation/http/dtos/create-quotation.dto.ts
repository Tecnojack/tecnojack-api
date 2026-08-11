import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsArray, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuotationItemDto {
  @ApiProperty() @IsString() @IsNotEmpty() description!: string;
  @ApiProperty() @IsNumber() @Min(1) quantity!: number;
  @ApiProperty() @IsNumber() @Min(0) unitPrice!: number;
  @ApiProperty() @IsNumber() @Min(0) total!: number;
}

export class CreateQuotationDto {
  @ApiProperty({ example: 'Paquete Fotográfico Premium' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ type: [QuotationItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationItemDto)
  items?: QuotationItemDto[];

  @ApiProperty({ example: 2580000 })
  @IsNumber()
  @Min(0)
  subtotalAmount!: number;

  @ApiPropertyOptional({ example: 420000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiProperty({ example: 3000000 })
  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  validUntil?: Date;
}
