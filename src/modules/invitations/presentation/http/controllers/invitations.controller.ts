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
import { CreateInvitationUseCase } from '../../../application/create-invitation/create-invitation.use-case.js';
import { DuplicateInvitationUseCase } from '../../../application/duplicate-invitation/duplicate-invitation.use-case.js';
import { ManageInvitationGuestsUseCase } from '../../../application/manage-invitation-guests/manage-invitation-guests.use-case.js';
import { ManageInvitationLayoutUseCase } from '../../../application/manage-invitation-layout/manage-invitation-layout.use-case.js';
import { ManageInvitationLifecycleUseCase } from '../../../application/manage-invitation-lifecycle/manage-invitation-lifecycle.use-case.js';
import { ListInvitationsUseCase } from '../../../application/list-invitations/list-invitations.use-case.js';
import { CreateInvitationDto } from '../dtos/create-invitation.dto.js';
import { QueryInvitationsDto } from '../dtos/query-invitations.dto.js';
import { SetSectionsDto, SetSchedulesDto } from '../dtos/invitation-layout.dto.js';
import { AddGuestDto, ConfirmRSVPDto } from '../dtos/invitation-guest.dto.js';
import { InvitationResponseDto } from '../dtos/invitation-response.dto.js';

export interface PaginatedInvitationsResponse {
  data: InvitationResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly createInvitationUseCase: CreateInvitationUseCase,
    private readonly duplicateInvitationUseCase: DuplicateInvitationUseCase,
    private readonly guestsUseCase: ManageInvitationGuestsUseCase,
    private readonly layoutUseCase: ManageInvitationLayoutUseCase,
    private readonly lifecycleUseCase: ManageInvitationLifecycleUseCase,
    private readonly listInvitationsUseCase: ListInvitationsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invitation layout' })
  @ApiResponse({ status: 201, type: InvitationResponseDto })
  async create(@Body() dto: CreateInvitationDto): Promise<InvitationResponseDto> {
    const expiresDate = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
    const inv = await this.createInvitationUseCase.execute({
      eventId: dto.eventId,
      slug: dto.slug,
      title: dto.title,
      description: dto.description,
      language: dto.language,
      visibility: dto.visibility,
      password: dto.password,
      expiresAt: expiresDate,
      theme: dto.theme,
    });
    return InvitationResponseDto.fromDomain(inv);
  }

  @Get()
  @ApiOperation({ summary: 'List and query invitations' })
  async findAll(@Query() query: QueryInvitationsDto): Promise<PaginatedInvitationsResponse> {
    const result = await this.listInvitationsUseCase.execute({
      page: query.page,
      limit: query.limit,
      eventId: query.eventId,
      status: query.status,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });
    return {
      data: result.data.map((inv) => InvitationResponseDto.fromDomain(inv)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get invitation by ID, business code, or unique slug' })
  @ApiParam({ name: 'identifier', description: 'UUID, INV-XXXXXX, or unique-slug' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<InvitationResponseDto> {
    const inv = await this.lifecycleUseCase.findByIdOrCodeOrSlug(identifier);
    return InvitationResponseDto.fromDomain(inv);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update basic invitation configurations and theme styling' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async updateConfig(
    @Param('id') id: string,
    @Body() dto: Partial<CreateInvitationDto>,
  ): Promise<InvitationResponseDto> {
    const expiresDate = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
    const inv = await this.lifecycleUseCase.updateConfig(id, {
      title: dto.title,
      description: dto.description,
      language: dto.language,
      visibility: dto.visibility,
      passwordHash: dto.password,
      expiresAt: expiresDate,
      theme: dto.theme,
    });
    return InvitationResponseDto.fromDomain(inv);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate an existing invitation template layout configuration' })
  @ApiResponse({ status: 201, type: InvitationResponseDto })
  async duplicate(
    @Param('id') id: string,
    @Body() body: { newSlug: string; newTitle: string },
  ): Promise<InvitationResponseDto> {
    const inv = await this.duplicateInvitationUseCase.execute({
      sourceId: id,
      newSlug: body.newSlug,
      newTitle: body.newTitle,
    });
    return InvitationResponseDto.fromDomain(inv);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish the invitation (enable public views and RSVPs)' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async publish(@Param('id') id: string): Promise<InvitationResponseDto> {
    const inv = await this.lifecycleUseCase.publish(id);
    return InvitationResponseDto.fromDomain(inv);
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revert invitation to draft (unpublish)' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async unpublish(@Param('id') id: string): Promise<InvitationResponseDto> {
    const inv = await this.lifecycleUseCase.unpublish(id);
    return InvitationResponseDto.fromDomain(inv);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) an invitation' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async archive(@Param('id') id: string): Promise<InvitationResponseDto> {
    const inv = await this.lifecycleUseCase.archive(id);
    return InvitationResponseDto.fromDomain(inv);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived invitation' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async restore(@Param('id') id: string): Promise<InvitationResponseDto> {
    const inv = await this.lifecycleUseCase.restore(id);
    return InvitationResponseDto.fromDomain(inv);
  }

  // Dynamic layout sections
  @Post(':id/sections')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Overwrite custom sections layouts' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async setSections(
    @Param('id') id: string,
    @Body() dto: SetSectionsDto,
  ): Promise<InvitationResponseDto> {
    const inv = await this.layoutUseCase.setSections({
      invitationId: id,
      sections: dto.sections,
    });
    return InvitationResponseDto.fromDomain(inv);
  }

  // Timeline schedule
  @Post(':id/schedules')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Overwrite schedule timeline itineraries' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async setSchedules(
    @Param('id') id: string,
    @Body() dto: SetSchedulesDto,
  ): Promise<InvitationResponseDto> {
    const inv = await this.layoutUseCase.setSchedules({
      invitationId: id,
      schedules: dto.schedules,
    });
    return InvitationResponseDto.fromDomain(inv);
  }

  // Guest list & RSVP
  @Post(':id/guests')
  @ApiOperation({ summary: 'Register a guest for the invitation' })
  @ApiResponse({ status: 201, type: InvitationResponseDto })
  async addGuest(
    @Param('id') id: string,
    @Body() dto: AddGuestDto,
  ): Promise<InvitationResponseDto> {
    const inv = await this.guestsUseCase.addGuest({
      invitationId: id,
      displayName: dto.displayName,
      email: dto.email,
      phone: dto.phone,
      maxCompanions: dto.maxCompanions,
      personId: dto.personId,
      notifyGuest: dto.notifyGuest,
    });
    return InvitationResponseDto.fromDomain(inv);
  }

  @Post(':id/guests/:guestId/rsvp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit RSVP attendance confirmation' })
  @ApiResponse({ status: 200, type: InvitationResponseDto })
  async rsvp(
    @Param('id') id: string,
    @Param('guestId') guestId: string,
    @Body() dto: ConfirmRSVPDto,
  ): Promise<InvitationResponseDto> {
    const inv = await this.guestsUseCase.confirmRSVP({
      invitationId: id,
      guestId,
      isComing: dto.isComing,
      companions: dto.companions,
      dietaryRestrictions: dto.dietaryRestrictions,
      guestNotes: dto.guestNotes,
    });
    return InvitationResponseDto.fromDomain(inv);
  }
}
