import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateContractUseCase } from '../../../application/create-contract/create-contract.use-case.js';
import { GetContractUseCase } from '../../../application/get-contract/get-contract.use-case.js';
import { UpdateContractUseCase } from '../../../application/update-contract/update-contract.use-case.js';
import { ManageContractStateUseCase } from '../../../application/manage-contract-state/manage-contract-state.use-case.js';
import { ManageContractVersionsUseCase } from '../../../application/manage-contract-versions/manage-contract-versions.use-case.js';
import { ManageContractPartiesUseCase } from '../../../application/manage-contract-parties/manage-contract-parties.use-case.js';
import { ListContractsUseCase } from '../../../application/list-contracts/list-contracts.use-case.js';
import { CreateContractDto } from '../dtos/create-contract.dto.js';
import { UpdateContractDto } from '../dtos/update-contract.dto.js';
import { QueryContractsDto } from '../dtos/query-contracts.dto.js';
import { AddContractVersionDto } from '../dtos/add-contract-version.dto.js';
import { AddContractPartyDto } from '../dtos/add-contract-party.dto.js';
import { ContractResponseDto } from '../dtos/contract-response.dto.js';

export interface PaginatedContractsResponse {
  data: ContractResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Contracts')
@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly createContractUseCase: CreateContractUseCase,
    private readonly getContractUseCase: GetContractUseCase,
    private readonly updateContractUseCase: UpdateContractUseCase,
    private readonly manageContractStateUseCase: ManageContractStateUseCase,
    private readonly manageContractVersionsUseCase: ManageContractVersionsUseCase,
    private readonly manageContractPartiesUseCase: ManageContractPartiesUseCase,
    private readonly listContractsUseCase: ListContractsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({ status: 201, type: ContractResponseDto })
  async create(@Body() dto: CreateContractDto): Promise<ContractResponseDto> {
    const contract = await this.createContractUseCase.execute({
      title: dto.title,
      description: dto.description,
      eventId: dto.eventId,
      deliverableId: dto.deliverableId,
      templateType: dto.templateType,
      notes: dto.notes,
      expiresAt: dto.expiresAt,
    });
    return ContractResponseDto.fromDomain(contract);
  }

  @Get()
  @ApiOperation({ summary: 'List contracts with pagination and filters' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QueryContractsDto): Promise<PaginatedContractsResponse> {
    const result = await this.listContractsUseCase.execute({
      page: query.page,
      limit: query.limit,
      eventId: query.eventId,
      deliverableId: query.deliverableId,
      status: query.status,
      templateType: query.templateType,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });

    return {
      data: result.data.map((c) => ContractResponseDto.fromDomain(c)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get contract by ID or code (CTR-XXXXXX)' })
  @ApiParam({ name: 'identifier', description: 'UUID or Business Code (CTR-XXXXXX)' })
  @ApiResponse({ status: 200, type: ContractResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<ContractResponseDto> {
    const contract = await this.getContractUseCase.execute(identifier);
    return ContractResponseDto.fromDomain(contract);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contract details' })
  @ApiResponse({ status: 200, type: ContractResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContractDto,
  ): Promise<ContractResponseDto> {
    const contract = await this.updateContractUseCase.execute({
      id,
      title: dto.title,
      description: dto.description,
      deliverableId: dto.deliverableId,
      templateType: dto.templateType,
      notes: dto.notes,
      expiresAt: dto.expiresAt,
    });
    return ContractResponseDto.fromDomain(contract);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish contract (transition to PENDING_SIGNATURE)' })
  @ApiResponse({ status: 200, type: ContractResponseDto })
  async publish(@Param('id') id: string): Promise<ContractResponseDto> {
    const contract = await this.manageContractStateUseCase.publish(id);
    return ContractResponseDto.fromDomain(contract);
  }

  @Post(':id/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark contract as executed' })
  @ApiResponse({ status: 200, type: ContractResponseDto })
  async markAsExecuted(@Param('id') id: string): Promise<ContractResponseDto> {
    const contract = await this.manageContractStateUseCase.markAsExecuted(id);
    return ContractResponseDto.fromDomain(contract);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) a contract' })
  @ApiResponse({ status: 200, type: ContractResponseDto })
  async archive(@Param('id') id: string): Promise<ContractResponseDto> {
    const contract = await this.manageContractStateUseCase.archive(id);
    return ContractResponseDto.fromDomain(contract);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived contract' })
  @ApiResponse({ status: 200, type: ContractResponseDto })
  async restore(@Param('id') id: string): Promise<ContractResponseDto> {
    const contract = await this.manageContractStateUseCase.restore(id);
    return ContractResponseDto.fromDomain(contract);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Add a new version with clauses to a contract' })
  @ApiResponse({ status: 201, type: ContractResponseDto })
  async addVersion(
    @Param('id') contractId: string,
    @Body() dto: AddContractVersionDto,
  ): Promise<ContractResponseDto> {
    const contract = await this.manageContractVersionsUseCase.addVersion({
      contractId,
      title: dto.title,
      contentSummary: dto.contentSummary,
      clauses: dto.clauses,
      changeReason: dto.changeReason,
    });
    return ContractResponseDto.fromDomain(contract);
  }

  @Post(':id/parties')
  @ApiOperation({ summary: 'Add a party to a contract' })
  @ApiResponse({ status: 201, type: ContractResponseDto })
  async addParty(
    @Param('id') contractId: string,
    @Body() dto: AddContractPartyDto,
  ): Promise<ContractResponseDto> {
    const contract = await this.manageContractPartiesUseCase.addParty({
      contractId,
      personId: dto.personId,
      organizationId: dto.organizationId,
      role: dto.role,
      isPrimary: dto.isPrimary,
    });
    return ContractResponseDto.fromDomain(contract);
  }
}
