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
import { CreateGalleryUseCase } from '../../../application/create-gallery/create-gallery.use-case.js';
import { GetGalleryUseCase } from '../../../application/get-gallery/get-gallery.use-case.js';
import { UpdateGalleryUseCase } from '../../../application/update-gallery/update-gallery.use-case.js';
import { ManageGalleryStateUseCase } from '../../../application/manage-gallery-state/manage-gallery-state.use-case.js';
import { ManageGalleryAssetsUseCase } from '../../../application/manage-gallery-assets/manage-gallery-assets.use-case.js';
import { ManageGalleryAlbumsUseCase } from '../../../application/manage-gallery-albums/manage-gallery-albums.use-case.js';
import { ListGalleriesUseCase } from '../../../application/list-galleries/list-galleries.use-case.js';
import { CreateGalleryDto } from '../dtos/create-gallery.dto.js';
import { UpdateGalleryDto } from '../dtos/update-gallery.dto.js';
import { QueryGalleriesDto } from '../dtos/query-galleries.dto.js';
import { CreateGalleryAlbumDto } from '../dtos/create-gallery-album.dto.js';
import { AddGalleryAssetDto } from '../dtos/add-gallery-asset.dto.js';
import { GalleryResponseDto } from '../dtos/gallery-response.dto.js';

export interface PaginatedGalleriesResponse {
  data: GalleryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Galleries')
@Controller('galleries')
export class GalleriesController {
  constructor(
    private readonly createGalleryUseCase: CreateGalleryUseCase,
    private readonly getGalleryUseCase: GetGalleryUseCase,
    private readonly updateGalleryUseCase: UpdateGalleryUseCase,
    private readonly manageGalleryStateUseCase: ManageGalleryStateUseCase,
    private readonly manageGalleryAssetsUseCase: ManageGalleryAssetsUseCase,
    private readonly manageGalleryAlbumsUseCase: ManageGalleryAlbumsUseCase,
    private readonly listGalleriesUseCase: ListGalleriesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery for an event' })
  @ApiResponse({ status: 201, type: GalleryResponseDto })
  async create(@Body() dto: CreateGalleryDto): Promise<GalleryResponseDto> {
    const gallery = await this.createGalleryUseCase.execute({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      eventId: dto.eventId,
      visibility: dto.visibility,
      coverMediaAssetId: dto.coverMediaAssetId,
      settings: dto.settings,
    });
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Get()
  @ApiOperation({ summary: 'List galleries with pagination and filters' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QueryGalleriesDto): Promise<PaginatedGalleriesResponse> {
    const result = await this.listGalleriesUseCase.execute({
      page: query.page,
      limit: query.limit,
      eventId: query.eventId,
      status: query.status,
      visibility: query.visibility,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });

    return {
      data: result.data.map((gallery) => GalleryResponseDto.fromDomain(gallery)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get gallery by ID or code (GAL-XXXXXX)' })
  @ApiParam({ name: 'identifier', description: 'UUID or Business Code (GAL-XXXXXX)' })
  @ApiResponse({ status: 200, type: GalleryResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<GalleryResponseDto> {
    const gallery = await this.getGalleryUseCase.execute(identifier);
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gallery details and settings' })
  @ApiResponse({ status: 200, type: GalleryResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGalleryDto,
  ): Promise<GalleryResponseDto> {
    const gallery = await this.updateGalleryUseCase.execute({
      id,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      visibility: dto.visibility,
      coverMediaAssetId: dto.coverMediaAssetId,
      settings: dto.settings,
    });
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish gallery to make it visible' })
  @ApiResponse({ status: 200, type: GalleryResponseDto })
  async publish(@Param('id') id: string): Promise<GalleryResponseDto> {
    const gallery = await this.manageGalleryStateUseCase.publish(id);
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unpublish gallery to draft/hidden state' })
  @ApiResponse({ status: 200, type: GalleryResponseDto })
  async unpublish(@Param('id') id: string): Promise<GalleryResponseDto> {
    const gallery = await this.manageGalleryStateUseCase.unpublish(id);
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) a gallery' })
  @ApiResponse({ status: 200, type: GalleryResponseDto })
  async archive(@Param('id') id: string): Promise<GalleryResponseDto> {
    const gallery = await this.manageGalleryStateUseCase.archive(id);
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived gallery' })
  @ApiResponse({ status: 200, type: GalleryResponseDto })
  async restore(@Param('id') id: string): Promise<GalleryResponseDto> {
    const gallery = await this.manageGalleryStateUseCase.restore(id);
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Post(':id/albums')
  @ApiOperation({ summary: 'Create an album inside a gallery' })
  @ApiResponse({ status: 201, type: GalleryResponseDto })
  async createAlbum(
    @Param('id') galleryId: string,
    @Body() dto: CreateGalleryAlbumDto,
  ): Promise<GalleryResponseDto> {
    const gallery = await this.manageGalleryAlbumsUseCase.createAlbum({
      galleryId,
      name: dto.name,
      description: dto.description,
      coverMediaAssetId: dto.coverMediaAssetId,
      sortOrder: dto.sortOrder,
    });
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Post(':id/assets')
  @ApiOperation({ summary: 'Add a MediaAsset reference to a gallery' })
  @ApiResponse({ status: 201, type: GalleryResponseDto })
  async addAsset(
    @Param('id') galleryId: string,
    @Body() dto: AddGalleryAssetDto,
  ): Promise<GalleryResponseDto> {
    const gallery = await this.manageGalleryAssetsUseCase.addAsset({
      galleryId,
      mediaAssetId: dto.mediaAssetId,
      albumId: dto.albumId,
      title: dto.title,
      caption: dto.caption,
      sortOrder: dto.sortOrder,
    });
    return GalleryResponseDto.fromDomain(gallery);
  }

  @Delete(':id/assets/:mediaAssetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a MediaAsset reference from a gallery' })
  @ApiResponse({ status: 200, type: GalleryResponseDto })
  async removeAsset(
    @Param('id') galleryId: string,
    @Param('mediaAssetId') mediaAssetId: string,
  ): Promise<GalleryResponseDto> {
    const gallery = await this.manageGalleryAssetsUseCase.removeAsset(galleryId, mediaAssetId);
    return GalleryResponseDto.fromDomain(gallery);
  }
}
