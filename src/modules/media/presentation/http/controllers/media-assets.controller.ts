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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegisterMediaAssetUseCase } from '../../../application/register-media-asset/register-media-asset.use-case.js';
import { GetMediaAssetUseCase } from '../../../application/get-media-asset/get-media-asset.use-case.js';
import { UpdateMediaAssetUseCase } from '../../../application/update-media-asset/update-media-asset.use-case.js';
import { ArchiveMediaAssetUseCase } from '../../../application/archive-media-asset/archive-media-asset.use-case.js';
import { RestoreMediaAssetUseCase } from '../../../application/restore-media-asset/restore-media-asset.use-case.js';
import { ListMediaAssetsUseCase } from '../../../application/list-media-assets/list-media-assets.use-case.js';
import { RegisterMediaAssetDto } from '../dtos/register-media-asset.dto.js';
import { UpdateMediaAssetDto } from '../dtos/update-media-asset.dto.js';
import { QueryMediaAssetsDto } from '../dtos/query-media-assets.dto.js';
import { MediaAssetResponseDto } from '../dtos/media-asset-response.dto.js';

export interface PaginatedMediaAssetsResponse {
  data: MediaAssetResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Media Assets')
@Controller('media-assets')
export class MediaAssetsController {
  constructor(
    private readonly registerMediaAssetUseCase: RegisterMediaAssetUseCase,
    private readonly getMediaAssetUseCase: GetMediaAssetUseCase,
    private readonly updateMediaAssetUseCase: UpdateMediaAssetUseCase,
    private readonly archiveMediaAssetUseCase: ArchiveMediaAssetUseCase,
    private readonly restoreMediaAssetUseCase: RestoreMediaAssetUseCase,
    private readonly listMediaAssetsUseCase: ListMediaAssetsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new media asset' })
  @ApiResponse({ status: 201, type: MediaAssetResponseDto })
  async register(@Body() dto: RegisterMediaAssetDto): Promise<MediaAssetResponseDto> {
    const asset = await this.registerMediaAssetUseCase.execute({
      originalName: dto.originalName,
      mimeType: dto.mimeType,
      storagePath: dto.storagePath,
      subfolder: dto.subfolder,
      checksumHash: dto.checksumHash,
      width: dto.width,
      height: dto.height,
      durationSec: dto.durationSec,
    });
    return MediaAssetResponseDto.fromDomain(asset);
  }

  @Get()
  @ApiOperation({ summary: 'List media assets with pagination and filters' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QueryMediaAssetsDto): Promise<PaginatedMediaAssetsResponse> {
    const result = await this.listMediaAssetsUseCase.execute({
      page: query.page,
      limit: query.limit,
      type: query.type,
      status: query.status,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });

    return {
      data: result.data.map((asset) => MediaAssetResponseDto.fromDomain(asset)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get a media asset by ID or code (MED-XXXXXX)' })
  @ApiParam({ name: 'identifier', description: 'UUID or Business Code (MED-XXXXXX)' })
  @ApiResponse({ status: 200, type: MediaAssetResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<MediaAssetResponseDto> {
    const asset = await this.getMediaAssetUseCase.execute(identifier);
    return MediaAssetResponseDto.fromDomain(asset);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update media asset status or metadata' })
  @ApiResponse({ status: 200, type: MediaAssetResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaAssetDto,
  ): Promise<MediaAssetResponseDto> {
    const asset = await this.updateMediaAssetUseCase.execute({
      id,
      status: dto.status,
      width: dto.width,
      height: dto.height,
      durationSec: dto.durationSec,
      checksumHash: dto.checksumHash,
    });
    return MediaAssetResponseDto.fromDomain(asset);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) a media asset' })
  @ApiResponse({ status: 200, type: MediaAssetResponseDto })
  async archive(@Param('id') id: string): Promise<MediaAssetResponseDto> {
    const asset = await this.archiveMediaAssetUseCase.execute({ id });
    return MediaAssetResponseDto.fromDomain(asset);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted media asset' })
  @ApiResponse({ status: 200, type: MediaAssetResponseDto })
  async restore(@Param('id') id: string): Promise<MediaAssetResponseDto> {
    const asset = await this.restoreMediaAssetUseCase.execute({ id });
    return MediaAssetResponseDto.fromDomain(asset);
  }
}
