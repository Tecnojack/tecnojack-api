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
import { CreatePersonUseCase } from '../../../application/create-person/create-person.use-case.js';
import { UpdatePersonUseCase } from '../../../application/update-person/update-person.use-case.js';
import { ArchivePersonUseCase } from '../../../application/archive-person/archive-person.use-case.js';
import { RestorePersonUseCase } from '../../../application/restore-person/restore-person.use-case.js';
import { GetPersonUseCase } from '../../../application/get-person/get-person.use-case.js';
import { ListPersonsUseCase } from '../../../application/list-persons/list-persons.use-case.js';
import { CreatePersonDto } from '../dto/create-person.dto.js';
import { UpdatePersonDto } from '../dto/update-person.dto.js';
import { PersonResponseDto } from '../dto/person-response.dto.js';
import { QueryPersonsDto } from '../dto/query-persons.dto.js';
import {
  PersonNotFoundException,
  DuplicateDocumentException,
  PersonAlreadyDeletedException,
} from '../../../domain/errors/people.errors.js';

export interface PaginatedPersonsResponse {
  data: PersonResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@ApiTags('Persons')
@Controller('persons')
export class PersonsController {
  constructor(
    private readonly createPersonUseCase: CreatePersonUseCase,
    private readonly updatePersonUseCase: UpdatePersonUseCase,
    private readonly archivePersonUseCase: ArchivePersonUseCase,
    private readonly restorePersonUseCase: RestorePersonUseCase,
    private readonly getPersonUseCase: GetPersonUseCase,
    private readonly listPersonsUseCase: ListPersonsUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new Person identity',
    description: 'Creates a new physical Person record in the PEOPLE domain identity registry.',
  })
  @ApiCreatedResponse({ description: 'Person created successfully.', type: PersonResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload or missing mandatory fields.' })
  @ApiConflictResponse({ description: 'Duplicate document number detected for the given country.' })
  async create(@Body() dto: CreatePersonDto): Promise<PersonResponseDto> {
    try {
      const person = await this.createPersonUseCase.execute(dto);
      return PersonResponseDto.fromDomain(person);
    } catch (err) {
      if (err instanceof DuplicateDocumentException) {
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
    summary: 'List and filter registered Persons',
    description: 'Returns a paginated list of Persons with optional search and filters.',
  })
  @ApiOkResponse({ description: 'Paginated Persons list.' })
  async findAll(@Query() query: QueryPersonsDto): Promise<PaginatedPersonsResponse> {
    const result = await this.listPersonsUseCase.execute(query);
    return {
      data: result.data.map((p) => PersonResponseDto.fromDomain(p)),
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
    summary: 'Get Person details by ID or code',
    description: 'Retrieves complete identity details for a Person by UUID or human-readable code (PER-XXXXXX).',
  })
  @ApiOkResponse({ description: 'Person details retrieved.', type: PersonResponseDto })
  @ApiNotFoundResponse({ description: 'Person not found.' })
  async findOne(@Param('identifier') identifier: string): Promise<PersonResponseDto> {
    try {
      const person = await this.getPersonUseCase.execute(identifier);
      return PersonResponseDto.fromDomain(person);
    } catch (err) {
      if (err instanceof PersonNotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Person details',
    description: 'Updates names, document, status or contact points for an existing Person.',
  })
  @ApiOkResponse({ description: 'Person updated successfully.', type: PersonResponseDto })
  @ApiNotFoundResponse({ description: 'Person not found.' })
  @ApiConflictResponse({ description: 'Duplicate document detected.' })
  async update(@Param('id') id: string, @Body() dto: UpdatePersonDto): Promise<PersonResponseDto> {
    try {
      const person = await this.updatePersonUseCase.execute({ id, ...dto });
      return PersonResponseDto.fromDomain(person);
    } catch (err) {
      if (err instanceof PersonNotFoundException) {
        throw new NotFoundException(err.message);
      }
      if (err instanceof DuplicateDocumentException) {
        throw new ConflictException(err.message);
      }
      if (err instanceof PersonAlreadyDeletedException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Soft-delete a Person record',
    description: 'Archives a Person record logically without removing data physically.',
  })
  @ApiOkResponse({ description: 'Person soft-deleted.', type: PersonResponseDto })
  @ApiNotFoundResponse({ description: 'Person not found.' })
  async archive(@Param('id') id: string): Promise<PersonResponseDto> {
    try {
      const person = await this.archivePersonUseCase.execute(id);
      return PersonResponseDto.fromDomain(person);
    } catch (err) {
      if (err instanceof PersonNotFoundException) {
        throw new NotFoundException(err.message);
      }
      if (err instanceof PersonAlreadyDeletedException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restore a soft-deleted Person record',
    description: 'Clears the soft-deletion timestamp and brings the Person record back to active query scope.',
  })
  @ApiOkResponse({ description: 'Person restored successfully.', type: PersonResponseDto })
  @ApiNotFoundResponse({ description: 'Person not found.' })
  async restore(@Param('id') id: string): Promise<PersonResponseDto> {
    try {
      const person = await this.restorePersonUseCase.execute(id);
      return PersonResponseDto.fromDomain(person);
    } catch (err) {
      if (err instanceof PersonNotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }
}
