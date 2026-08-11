import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ContractPartyRole } from '../../../domain/enums/contracts.enums.js';

export class AddContractPartyDto {
  @ApiPropertyOptional({ description: 'Person UUID (from People domain)' })
  @IsOptional()
  @IsUUID()
  personId?: string;

  @ApiPropertyOptional({ description: 'Organization UUID (from People domain)' })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiProperty({ enum: ContractPartyRole, default: ContractPartyRole.CLIENT })
  @IsEnum(ContractPartyRole)
  role!: ContractPartyRole;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
