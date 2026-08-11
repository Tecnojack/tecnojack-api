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
import { CreateDeliverableUseCase } from '../../../application/create-deliverable/create-deliverable.use-case.js';
import { GetDeliverableUseCase } from '../../../application/get-deliverable/get-deliverable.use-case.js';
import { UpdateDeliverableUseCase } from '../../../application/update-deliverable/update-deliverable.use-case.js';
import { ManageDeliverableStateUseCase } from '../../../application/manage-deliverable-state/manage-deliverable-state.use-case.js';
import { ManageDeliverableItemsUseCase } from '../../../application/manage-deliverable-items/manage-deliverable-items.use-case.js';
import { ListDeliverablesUseCase } from '../../../application/list-deliverables/list-deliverables.use-case.js';
import { CreateDeliverableDto } from '../dtos/create-deliverable.dto.js';
import { UpdateDeliverableDto } from '../dtos/update-deliverable.dto.js';
import { QueryDeliverablesDto } from '../dtos/query-deliverables.dto.js';
import { AddDeliverableItemDto } from '../dtos/add-deliverable-item.dto.js';
import { DeliverableResponseDto } from '../dtos/deliverable-response.dto.js';
import { DeliveryMethod } from '../../../domain/enums/deliverables.enums.js';

export interface PaginatedDeliverablesResponse {
  data: DeliverableResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Deliverables')
@Controller('deliverables')
export class DeliverablesController {
  constructor(
    private readonly createDeliverableUseCase: CreateDeliverableUseCase,
    private readonly getDeliverableUseCase: GetDeliverableUseCase,
    private readonly updateDeliverableUseCase: UpdateDeliverableUseCase,
    private readonly manageDeliverableStateUseCase: ManageDeliverableStateUseCase,
    private readonly manageDeliverableItemsUseCase: ManageDeliverableItemsUseCase,
    private readonly listDeliverablesUseCase: ListDeliverablesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deliverable' })
  @ApiResponse({ status: 201, type: DeliverableResponseDto })
  async create(@Body() dto: CreateDeliverableDto): Promise<DeliverableResponseDto> {
    const deliverable = await this.createDeliverableUseCase.execute({
      name: dto.name,
      description: dto.description,
      eventId: dto.eventId,
      type: dto.type,
      deliveryMethod: dto.deliveryMethod,
      recipientPersonId: dto.recipientPersonId,
      targetGalleryId: dto.targetGalleryId,
      estimatedDeliveryAt: dto.estimatedDeliveryAt,
      trackingNumber: dto.trackingNumber,
      deliveryNotes: dto.deliveryNotes,
    });
    return DeliverableResponseDto.fromDomain(deliverable);
  }

  @Get()
  @ApiOperation({ summary: 'List deliverables with pagination and filters' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QueryDeliverablesDto): Promise<PaginatedDeliverablesResponse> {
    const result = await this.listDeliverablesUseCase.execute({
      page: query.page,
      limit: query.limit,
      eventId: query.eventId,
      type: query.type,
      status: query.status,
      deliveryMethod: query.deliveryMethod,
      recipientPersonId: query.recipientPersonId,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });

    return {
      data: result.data.map((d) => DeliverableResponseDto.fromDomain(d)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get deliverable by ID or code (DEL-XXXXXX)' })
  @ApiParam({ name: 'identifier', description: 'UUID or Business Code (DEL-XXXXXX)' })
  @ApiResponse({ status: 200, type: DeliverableResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<DeliverableResponseDto> {
    const deliverable = await this.getDeliverableUseCase.execute(identifier);
    return DeliverableResponseDto.fromDomain(deliverable);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update deliverable details' })
  @ApiResponse({ status: 200, type: DeliverableResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeliverableDto,
  ): Promise<DeliverableResponseDto> {
    const deliverable = await this.updateDeliverableUseCase.execute({
      id,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      deliveryMethod: dto.deliveryMethod,
      recipientPersonId: dto.recipientPersonId,
      targetGalleryId: dto.targetGalleryId,
      estimatedDeliveryAt: dto.estimatedDeliveryAt,
      trackingNumber: dto.trackingNumber,
      deliveryNotes: dto.deliveryNotes,
    });
    return DeliverableResponseDto.fromDomain(deliverable);
  }

  @Post(':id/ready')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark deliverable as ready' })
  @ApiResponse({ status: 200, type: DeliverableResponseDto })
  async markAsReady(@Param('id') id: string): Promise<DeliverableResponseDto> {
    const deliverable = await this.manageDeliverableStateUseCase.markAsReady(id);
    return DeliverableResponseDto.fromDomain(deliverable);
  }

  @Post(':id/deliver')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark deliverable as delivered' })
  @ApiResponse({ status: 200, type: DeliverableResponseDto })
  async markAsDelivered(
    @Param('id') id: string,
    @Body('deliveryMethod') deliveryMethod?: DeliveryMethod,
    @Body('notes') notes?: string,
  ): Promise<DeliverableResponseDto> {
    const deliverable = await this.manageDeliverableStateUseCase.markAsDelivered(id, deliveryMethod, notes);
    return DeliverableResponseDto.fromDomain(deliverable);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) a deliverable' })
  @ApiResponse({ status: 200, type: DeliverableResponseDto })
  async archive(@Param('id') id: string): Promise<DeliverableResponseDto> {
    const deliverable = await this.manageDeliverableStateUseCase.archive(id);
    return DeliverableResponseDto.fromDomain(deliverable);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived deliverable' })
  @ApiResponse({ status: 200, type: DeliverableResponseDto })
  async restore(@Param('id') id: string): Promise<DeliverableResponseDto> {
    const deliverable = await this.manageDeliverableStateUseCase.restore(id);
    return DeliverableResponseDto.fromDomain(deliverable);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add an item to a deliverable' })
  @ApiResponse({ status: 201, type: DeliverableResponseDto })
  async addItem(
    @Param('id') deliverableId: string,
    @Body() dto: AddDeliverableItemDto,
  ): Promise<DeliverableResponseDto> {
    const deliverable = await this.manageDeliverableItemsUseCase.addItem({
      deliverableId,
      title: dto.title,
      description: dto.description,
      mediaAssetId: dto.mediaAssetId,
      quantity: dto.quantity,
    });
    return DeliverableResponseDto.fromDomain(deliverable);
  }

  @Delete(':id/items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an item from a deliverable' })
  @ApiResponse({ status: 200, type: DeliverableResponseDto })
  async removeItem(
    @Param('id') deliverableId: string,
    @Param('itemId') itemId: string,
  ): Promise<DeliverableResponseDto> {
    const deliverable = await this.manageDeliverableItemsUseCase.removeItem(deliverableId, itemId);
    return DeliverableResponseDto.fromDomain(deliverable);
  }
}
