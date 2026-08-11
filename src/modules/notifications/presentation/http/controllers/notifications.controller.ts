import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SendNotificationUseCase } from '../../../application/send-notification/send-notification.use-case.js';
import { ManageNotificationUseCase } from '../../../application/manage-notification/manage-notification.use-case.js';
import { ListNotificationsUseCase } from '../../../application/list-notifications/list-notifications.use-case.js';
import { ManageNotificationTemplatesUseCase } from '../../../application/manage-notification-templates/manage-notification-templates.use-case.js';
import { CreateNotificationDto } from '../dtos/create-notification.dto.js';
import { QueryNotificationsDto } from '../dtos/query-notifications.dto.js';
import { CreateTemplateDto } from '../dtos/create-template.dto.js';
import { NotificationResponseDto, TemplateResponseDto } from '../dtos/notification-response.dto.js';

export interface PaginatedNotificationsResponse {
  data: NotificationResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly manageNotificationUseCase: ManageNotificationUseCase,
    private readonly listNotificationsUseCase: ListNotificationsUseCase,
    private readonly templatesUseCase: ManageNotificationTemplatesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create and dispatch/schedule a notification' })
  @ApiResponse({ status: 201, type: NotificationResponseDto })
  async create(@Body() dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const scheduledDate = dto.scheduledFor ? new Date(dto.scheduledFor) : undefined;
    const n = await this.sendNotificationUseCase.execute({
      templateCode: dto.templateCode,
      channel: dto.channel,
      priority: dto.priority,
      variables: dto.variables,
      scheduledFor: scheduledDate,
      recipients: dto.recipients.map((r) => ({
        personId: r.personId,
        recipientAddress: r.recipientAddress,
      })),
    });
    return NotificationResponseDto.fromDomain(n);
  }

  @Get()
  @ApiOperation({ summary: 'List notifications' })
  async findAll(@Query() query: QueryNotificationsDto): Promise<PaginatedNotificationsResponse> {
    const result = await this.listNotificationsUseCase.execute({
      page: query.page,
      limit: query.limit,
      channel: query.channel,
      status: query.status,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });
    return {
      data: result.data.map((n) => NotificationResponseDto.fromDomain(n)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get notification by ID or business code (NTF-XXXXXX)' })
  @ApiParam({ name: 'identifier', description: 'UUID or NTF-XXXXXX code' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<NotificationResponseDto> {
    const n = await this.manageNotificationUseCase.findByIdOrCode(identifier);
    return NotificationResponseDto.fromDomain(n);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a pending or scheduled notification' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async cancel(@Param('id') id: string): Promise<NotificationResponseDto> {
    const n = await this.manageNotificationUseCase.cancel(id);
    return NotificationResponseDto.fromDomain(n);
  }

  @Post(':id/retry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retry sending a failed notification manually' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async retry(@Param('id') id: string): Promise<NotificationResponseDto> {
    const n = await this.manageNotificationUseCase.retry(id);
    return NotificationResponseDto.fromDomain(n);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) a notification record' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async softDelete(@Param('id') id: string): Promise<NotificationResponseDto> {
    const n = await this.manageNotificationUseCase.softDelete(id);
    return NotificationResponseDto.fromDomain(n);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived notification record' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async restore(@Param('id') id: string): Promise<NotificationResponseDto> {
    const n = await this.manageNotificationUseCase.restore(id);
    return NotificationResponseDto.fromDomain(n);
  }

  // Templates management
  @Post('templates')
  @ApiOperation({ summary: 'Create a reusable notification layout template' })
  @ApiResponse({ status: 201, type: TemplateResponseDto })
  async createTemplate(@Body() dto: CreateTemplateDto): Promise<TemplateResponseDto> {
    const t = await this.templatesUseCase.createTemplate({
      name: dto.name,
      category: dto.category,
      language: dto.language,
      subjectLayout: dto.subjectLayout,
      bodyLayout: dto.bodyLayout,
      variables: dto.variables,
    });
    return TemplateResponseDto.fromDomain(t);
  }

  @Get('templates/:identifier')
  @ApiOperation({ summary: 'Get template by ID or code' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  async getTemplate(@Param('identifier') identifier: string): Promise<TemplateResponseDto> {
    const t = await this.templatesUseCase.getTemplate(identifier);
    return TemplateResponseDto.fromDomain(t);
  }
}
