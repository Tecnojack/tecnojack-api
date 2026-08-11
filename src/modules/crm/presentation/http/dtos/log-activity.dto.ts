import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CRMActivityType } from '../../../domain/enums/crm.enums.js';

export class LogActivityDto {
  @ApiProperty({ enum: CRMActivityType })
  @IsEnum(CRMActivityType)
  activityType!: CRMActivityType;

  @ApiProperty({ example: 'Llamada de primer contacto' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  occurredAt?: Date;
}

export class AddTaskDto {
  @ApiProperty({ example: 'Enviar propuesta por correo' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Due date ISO 8601' })
  @Type(() => Date)
  dueDate!: Date;
}
