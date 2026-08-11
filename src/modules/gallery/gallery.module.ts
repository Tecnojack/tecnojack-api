import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module.js';
import { MediaModule } from '../media/media.module.js';
import { PeopleModule } from '../people/people.module.js';
import { GALLERY_REPOSITORY } from './application/ports/gallery.repository.port.js';
import { PrismaGalleryRepository } from './infrastructure/persistence/prisma/repositories/prisma-gallery.repository.js';
import { CreateGalleryUseCase } from './application/create-gallery/create-gallery.use-case.js';
import { GetGalleryUseCase } from './application/get-gallery/get-gallery.use-case.js';
import { UpdateGalleryUseCase } from './application/update-gallery/update-gallery.use-case.js';
import { ManageGalleryStateUseCase } from './application/manage-gallery-state/manage-gallery-state.use-case.js';
import { ManageGalleryAssetsUseCase } from './application/manage-gallery-assets/manage-gallery-assets.use-case.js';
import { ManageGalleryAlbumsUseCase } from './application/manage-gallery-albums/manage-gallery-albums.use-case.js';
import { ListGalleriesUseCase } from './application/list-galleries/list-galleries.use-case.js';
import { GalleriesController } from './presentation/http/controllers/galleries.controller.js';
import { GalleryFacade } from './public/gallery.facade.js';

@Module({
  imports: [EventsModule, MediaModule, PeopleModule],
  controllers: [GalleriesController],
  providers: [
    {
      provide: GALLERY_REPOSITORY,
      useClass: PrismaGalleryRepository,
    },
    CreateGalleryUseCase,
    GetGalleryUseCase,
    UpdateGalleryUseCase,
    ManageGalleryStateUseCase,
    ManageGalleryAssetsUseCase,
    ManageGalleryAlbumsUseCase,
    ListGalleriesUseCase,
    GalleryFacade,
  ],
  exports: [GalleryFacade, GALLERY_REPOSITORY],
})
export class GalleryModule {}
