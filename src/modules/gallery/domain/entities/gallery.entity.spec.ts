import { Gallery } from './gallery.entity.js';
import { GalleryStatus, GalleryVisibility } from '../enums/gallery.enums.js';
import { GalleryAssetReference } from './gallery-asset-reference.entity.js';
import { GalleryAlbum } from './gallery-album.entity.js';
import { GalleryAlreadyDeletedException, GalleryAssetAlreadyExistsException } from '../errors/gallery.errors.js';

describe('Gallery Aggregate Entity', () => {
  it('should create a valid DRAFT gallery and raise GalleryCreatedEvent', () => {
    const gallery = Gallery.create({
      code: 'GAL-000001',
      name: 'Boda Gabriel y Mercedes - Fotos Oficiales',
      eventId: crypto.randomUUID(),
    });

    expect(gallery.id).toBeDefined();
    expect(gallery.code).toBe('GAL-000001');
    expect(gallery.status).toBe(GalleryStatus.DRAFT);
    expect(gallery.visibility).toBe(GalleryVisibility.PRIVATE);
    expect(gallery.domainEvents.length).toBe(1);
    expect(gallery.domainEvents[0]!.eventName).toBe('gallery.created');
  });

  it('should publish gallery', () => {
    const gallery = Gallery.create({
      code: 'GAL-000002',
      name: 'Fiesta Quinceañera Sofia',
      eventId: crypto.randomUUID(),
    });
    gallery.clearDomainEvents();

    gallery.publish('admin-user');
    expect(gallery.status).toBe(GalleryStatus.PUBLISHED);
    expect(gallery.publishedAt).toBeDefined();
    expect(gallery.domainEvents[0]!.eventName).toBe('gallery.published');
  });

  it('should add albums and media asset references without duplicating files', () => {
    const gallery = Gallery.create({
      code: 'GAL-000003',
      name: 'Galería Corporativa',
      eventId: crypto.randomUUID(),
    });

    const album = new GalleryAlbum({
      galleryId: gallery.id,
      name: 'Ceremonia de Premiación',
    });
    gallery.addAlbum(album);

    const assetRef = new GalleryAssetReference({
      galleryId: gallery.id,
      albumId: album.id,
      mediaAssetId: crypto.randomUUID(),
      title: 'Foto Principal',
    });

    gallery.addAssetReference(assetRef);
    expect(gallery.albums.length).toBe(1);
    expect(gallery.assetReferences.length).toBe(1);

    expect(() => gallery.addAssetReference(assetRef)).toThrow(GalleryAssetAlreadyExistsException);
  });

  it('should soft delete and throw on subsequent mutations', () => {
    const gallery = Gallery.create({
      code: 'GAL-000004',
      name: 'Galería Graduación',
      eventId: crypto.randomUUID(),
    });

    gallery.softDelete('user-1');
    expect(gallery.isDeleted()).toBe(true);
    expect(gallery.status).toBe(GalleryStatus.ARCHIVED);

    expect(() => gallery.softDelete('user-1')).toThrow(GalleryAlreadyDeletedException);
    expect(() => gallery.publish()).toThrow(GalleryAlreadyDeletedException);
  });
});
