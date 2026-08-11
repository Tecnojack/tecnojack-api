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
import { CreateOpportunityUseCase } from '../../../application/create-opportunity/create-opportunity.use-case.js';
import { GetOpportunityUseCase } from '../../../application/get-opportunity/get-opportunity.use-case.js';
import { UpdateOpportunityUseCase } from '../../../application/update-opportunity/update-opportunity.use-case.js';
import { ManageOpportunityStageUseCase } from '../../../application/manage-opportunity-stage/manage-opportunity-stage.use-case.js';
import { ManageQuotationsUseCase } from '../../../application/manage-quotations/manage-quotations.use-case.js';
import { ManageCRMActivitiesUseCase } from '../../../application/manage-crm-activities/manage-crm-activities.use-case.js';
import { ListOpportunitiesUseCase } from '../../../application/list-opportunities/list-opportunities.use-case.js';
import { CreateOpportunityDto } from '../dtos/create-opportunity.dto.js';
import { QueryOpportunitiesDto } from '../dtos/query-opportunities.dto.js';
import { TransitionStageDto, ConvertOpportunityDto } from '../dtos/pipeline-stage.dto.js';
import { CreateQuotationDto } from '../dtos/create-quotation.dto.js';
import { LogActivityDto, AddTaskDto } from '../dtos/log-activity.dto.js';
import { OpportunityResponseDto } from '../dtos/opportunity-response.dto.js';

export interface PaginatedOpportunitiesResponse {
  data: OpportunityResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('CRM')
@Controller('crm/opportunities')
export class CRMController {
  constructor(
    private readonly createOpportunityUseCase: CreateOpportunityUseCase,
    private readonly getOpportunityUseCase: GetOpportunityUseCase,
    private readonly updateOpportunityUseCase: UpdateOpportunityUseCase,
    private readonly manageOpportunityStageUseCase: ManageOpportunityStageUseCase,
    private readonly manageQuotationsUseCase: ManageQuotationsUseCase,
    private readonly manageCRMActivitiesUseCase: ManageCRMActivitiesUseCase,
    private readonly listOpportunitiesUseCase: ListOpportunitiesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new Lead / Opportunity' })
  @ApiResponse({ status: 201, type: OpportunityResponseDto })
  async create(@Body() dto: CreateOpportunityDto): Promise<OpportunityResponseDto> {
    const opp = await this.createOpportunityUseCase.execute({
      title: dto.title,
      description: dto.description,
      personId: dto.personId,
      organizationId: dto.organizationId,
      estimatedValue: dto.estimatedValue,
      currency: dto.currency,
      probabilityPercentage: dto.probabilityPercentage,
      initialStage: dto.initialStage,
    });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Get()
  @ApiOperation({ summary: 'List opportunities / Pipeline view' })
  async findAll(@Query() query: QueryOpportunitiesDto): Promise<PaginatedOpportunitiesResponse> {
    const result = await this.listOpportunitiesUseCase.execute({
      page: query.page,
      limit: query.limit,
      stage: query.stage,
      personId: query.personId,
      organizationId: query.organizationId,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });
    return {
      data: result.data.map((o) => OpportunityResponseDto.fromDomain(o)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get opportunity by ID or code (OPP-XXXXXX)' })
  @ApiParam({ name: 'identifier', description: 'UUID or Business Code (OPP-XXXXXX)' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<OpportunityResponseDto> {
    const opp = await this.getOpportunityUseCase.execute(identifier);
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update opportunity details' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateOpportunityDto>,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.updateOpportunityUseCase.execute({
      id,
      title: dto.title,
      description: dto.description,
      estimatedValue: dto.estimatedValue,
      currency: dto.currency,
      probabilityPercentage: dto.probabilityPercentage,
    });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/stage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transition opportunity to a new pipeline stage' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async transitionStage(
    @Param('id') id: string,
    @Body() dto: TransitionStageDto,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.manageOpportunityStageUseCase.transitionTo({
      id,
      newStage: dto.newStage,
      notes: dto.notes,
    });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/convert')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Convert APPROVED opportunity into an Event (sale closed)' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async convert(
    @Param('id') id: string,
    @Body() dto: ConvertOpportunityDto,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.manageOpportunityStageUseCase.convert({
      id,
      eventId: dto.eventId,
      contractId: dto.contractId,
      paymentId: dto.paymentId,
    });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) an opportunity' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async archive(@Param('id') id: string): Promise<OpportunityResponseDto> {
    const opp = await this.manageOpportunityStageUseCase.archive(id);
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived opportunity' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async restore(@Param('id') id: string): Promise<OpportunityResponseDto> {
    const opp = await this.manageOpportunityStageUseCase.restore(id);
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/quotations')
  @ApiOperation({ summary: 'Add a quotation to the opportunity' })
  @ApiResponse({ status: 201, type: OpportunityResponseDto })
  async addQuotation(
    @Param('id') opportunityId: string,
    @Body() dto: CreateQuotationDto,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.manageQuotationsUseCase.addQuotation({
      opportunityId,
      title: dto.title,
      items: dto.items,
      subtotalAmount: dto.subtotalAmount,
      taxAmount: dto.taxAmount,
      totalAmount: dto.totalAmount,
      validUntil: dto.validUntil,
    });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/quotations/:quotationId/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a quotation' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async approveQuotation(
    @Param('id') opportunityId: string,
    @Param('quotationId') quotationId: string,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.manageQuotationsUseCase.approveQuotation({ opportunityId, quotationId });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/quotations/:quotationId/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a quotation' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async rejectQuotation(
    @Param('id') opportunityId: string,
    @Param('quotationId') quotationId: string,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.manageQuotationsUseCase.rejectQuotation({ opportunityId, quotationId });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Log a commercial activity (call, meeting, note, etc.)' })
  @ApiResponse({ status: 201, type: OpportunityResponseDto })
  async logActivity(
    @Param('id') opportunityId: string,
    @Body() dto: LogActivityDto,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.manageCRMActivitiesUseCase.logActivity({
      opportunityId,
      activityType: dto.activityType,
      title: dto.title,
      notes: dto.notes,
      occurredAt: dto.occurredAt,
    });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Add a follow-up task to the opportunity' })
  @ApiResponse({ status: 201, type: OpportunityResponseDto })
  async addTask(
    @Param('id') opportunityId: string,
    @Body() dto: AddTaskDto,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.manageCRMActivitiesUseCase.addTask({
      opportunityId,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
    });
    return OpportunityResponseDto.fromDomain(opp);
  }

  @Post(':id/tasks/:taskId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiResponse({ status: 200, type: OpportunityResponseDto })
  async completeTask(
    @Param('id') opportunityId: string,
    @Param('taskId') taskId: string,
  ): Promise<OpportunityResponseDto> {
    const opp = await this.manageCRMActivitiesUseCase.completeTask({
      opportunityId,
      taskId,
    });
    return OpportunityResponseDto.fromDomain(opp);
  }
}
