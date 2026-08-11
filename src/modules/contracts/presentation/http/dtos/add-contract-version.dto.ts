import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ContractClauseDto {
  @ApiProperty({ example: '1.1' }) @IsString() @IsNotEmpty() number!: string;
  @ApiProperty({ example: 'Objeto del Contrato' }) @IsString() @IsNotEmpty() title!: string;
  @ApiProperty({ example: 'El prestador ofrecerá la cobertura del evento...' }) @IsString() @IsNotEmpty() body!: string;
  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() isMandatory?: boolean;
}

export class AddContractVersionDto {
  @ApiProperty({ description: 'Version title', example: 'Versión 2.0 con Cláusula de Privacidad' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentSummary?: string;

  @ApiPropertyOptional({ type: [ContractClauseDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractClauseDto)
  clauses?: ContractClauseDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changeReason?: string;
}
