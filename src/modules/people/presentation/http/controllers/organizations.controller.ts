import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CreateOrganizationUseCase } from '../../../application/create-organization/create-organization.use-case.js';
import { UpdateOrganizationUseCase } from '../../../application/update-organization/update-organization.use-case.js';
import { ArchiveOrganizationUseCase } from '../../../application/archive-organization/archive-organization.use-case.js';
import { RestoreOrganizationUseCase } from '../../../application/restore-organization/restore-organization.use-case.js';
import { GetOrganizationUseCase } from '../../../application/get-organization/get-organization.use-case.js';
import { ListOrganizationsUseCase } from '../../../application/list-organizations/list-organizations.use-case.js';
import { CreateOrganizationDto } from '../dto/create-organization.dto.js';
import { UpdateOrganizationDto } from '../dto/update-organization.dto.js';
import { OrganizationResponseDto } from '../dto/organization-response.dto.js';
import { QueryOrganizationsDto } from '../dto/query-organizations.dto.js';
import {
  OrganizationNotFoundException,
  DuplicateTaxIdException,
  OrganizationAlreadyDeletedException,
} from '../../../domain/errors/people.errors.js';

export interface PaginatedOrganizationsResponse {
  data: OrganizationResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
    private readonly archiveOrganizationUseCase: ArchiveOrganizationUseCase,
    private readonly restoreOrganizationUseCase: RestoreOrganizationUseCase,
    private readonly getOrganizationUseCase: GetOrganizationUseCase,
    private readonly listOrganizationsUseCase: ListOrganizationsUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new Organization identity',
    description: 'Creates a new corporate / legal entity record in the PEOPLE domain identity registry.',
  })
  @ApiCreatedResponse({ description: 'Organization created successfully.', type: OrganizationResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload or missing mandatory fields.' })
  @ApiConflictResponse({ description: 'Duplicate Tax ID detected for the given country.' })
  async create(@Body() dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    try {
      const org = await this.createOrganizationUseCase.execute(dto);
      return OrganizationResponseDto.fromDomain(org);
    } catch (err) {
      if (err instanceof DuplicateTaxIdException) {
        throw new ConflictException(err.message);
      }
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'List and filter registered Organizations',
    description: 'Returns a paginated list of Organizations with optional search and filters.',
  })
  @ApiOkResponse({ description: 'Paginated Organizations list.' })
  async findAll(@Query() query: QueryOrganizationsDto): Promise<PaginatedOrganizationsResponse> {
    const result = await this.listOrganizationsUseCase.execute(query);
    return {
      data: result.data.map((o) => OrganizationResponseDto.fromDomain(o)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  @Get(':identifier')
  @ApiOperation({
    summary: 'Get Organization details by ID or code',
    description: 'Retrieves complete identity details for an Organization by UUID or human-readable code (ORG-XXXXXX).',
  })
  @ApiOkResponse({ description: 'Organization details retrieved.', type: OrganizationResponseDto })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  async findOne(@Param('identifier') identifier: string): Promise<OrganizationResponseDto> {
    try {
      const org = await this.getOrganizationUseCase.execute(identifier);
      return OrganizationResponseDto.fromDomain(org);
    } catch (err) {
      if (err instanceof OrganizationNotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Organization details',
    description: 'Updates legal name, trade name, tax document, status or contact points.',
  })
  @ApiOkResponse({ description: 'Organization updated successfully.', type: OrganizationResponseDto })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @ApiConflictResponse({ description: 'Duplicate Tax ID detected.' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto): Promise<OrganizationResponseDto> {
    try {
      const org = await this.updateOrganizationUseCase.execute({ id, ...dto });
      return OrganizationResponseDto.fromDomain(org);
    } catch (err) {
      if (err instanceof OrganizationNotFoundException) {
        throw new NotFoundException(err.message);
      }
      if (err instanceof DuplicateTaxIdException) {
        throw new ConflictException(err.message);
      }
      if (err instanceof OrganizationAlreadyDeletedException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Soft-delete an Organization record',
    description: 'Archives an Organization record logically without removing data physically.',
  })
  @ApiOkResponse({ description: 'Organization soft-deleted.', type: OrganizationResponseDto })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  async archive(@Param('id') id: string): Promise<OrganizationResponseDto> {
    try {
      const org = await this.archiveOrganizationUseCase.execute(id);
      return OrganizationResponseDto.fromDomain(org);
    } catch (err) {
      if (err instanceof OrganizationNotFoundException) {
        throw new NotFoundException(err.message);
      }
      if (err instanceof OrganizationAlreadyDeletedException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restore a soft-deleted Organization record',
    description: 'Clears the soft-deletion timestamp and brings the Organization record back to active query scope.',
  })
  @ApiOkResponse({ description: 'Organization restored successfully.', type: OrganizationResponseDto })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  async restore(@Param('id') id: string): Promise<OrganizationResponseDto> {
    try {
      const org = await this.restoreOrganizationUseCase.execute(id);
      return OrganizationResponseDto.fromDomain(org);
    } catch (err) {
      if (err instanceof OrganizationNotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }
}
