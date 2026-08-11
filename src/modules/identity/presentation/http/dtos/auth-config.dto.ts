import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PolicyEffect } from '../../../domain/enums/identity.enums.js';

export class CreateRoleDto {
  @ApiProperty({ example: 'FOTOGRAFO' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenantId?: string;
}

export class CreatePermissionDto {
  @ApiProperty({ example: 'galleries' })
  @IsString()
  @IsNotEmpty()
  resource!: string;

  @ApiProperty({ example: 'write' })
  @IsString()
  @IsNotEmpty()
  action!: string;

  @ApiProperty({ example: 'Permite subir y editar galerías fotográficas' })
  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class PolicyConditionDto {
  @ApiProperty({ example: 'userId' }) @IsString() @IsNotEmpty() field!: string;
  @ApiProperty({ example: 'EQUALS' }) @IsString() @IsNotEmpty() operator!: 'EQUALS' | 'CONTAINS';
  @ApiProperty({ example: 'resource.ownerId' }) @IsString() @IsNotEmpty() value!: string;
}

export class PolicyRuleDto {
  @ApiProperty({ enum: PolicyEffect }) @IsEnum(PolicyEffect) effect!: PolicyEffect;
  @ApiProperty({ example: 'galleries:*' }) @IsString() @IsNotEmpty() resourcePattern!: string;
  @ApiProperty({ example: 'write' }) @IsString() @IsNotEmpty() actionPattern!: string;
  @ApiProperty({ type: [PolicyConditionDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => PolicyConditionDto) conditions!: PolicyConditionDto[];
}

export class CreatePolicyDto {
  @ApiProperty({ example: 'OnlyOwnGalleriesPolicy' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: [PolicyRuleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicyRuleDto)
  rules!: PolicyRuleDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenantId?: string;
}
