import { MediaAsset } from './media-asset.entity.js';
import { MediaType, MediaStatus } from '../enums/media.enums.js';
import { MediaMetadata } from '../value-objects/media-metadata.value-object.js';
import { MediaDimensions } from '../value-objects/media-dimensions.value-object.js';
import { MediaAssetAlreadyDeletedException } from '../errors/media.errors.js';

describe('MediaAsset Entity', () => {
  const sampleMetadata = new MediaMetadata({
    originalName: 'wedding-photo.jpg',
    normalizedName: 'wedding-photo.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 2048500,
    path: '2026/08/11/wedding-photo.jpg',
    url: 'http://localhost:3000/uploads/2026/08/11/wedding-photo.jpg',
  });

  it('should create a valid MediaAsset and raise MediaAssetRegisteredEvent', () => {
    const asset = MediaAsset.create({
      code: 'MED-000001',
      type: MediaType.IMAGE,
      metadata: sampleMetadata,
    });

    expect(asset.id).toBeDefined();
    expect(asset.code).toBe('MED-000001');
    expect(asset.type).toBe(MediaType.IMAGE);
    expect(asset.status).toBe(MediaStatus.READY);
    expect(asset.domainEvents.length).toBe(1);
    expect(asset.domainEvents[0]!.eventName).toBe('media.asset.registered');
  });

  it('should update dimensions and raise MediaAssetUpdatedEvent', () => {
    const asset = MediaAsset.create({
      code: 'MED-000002',
      type: MediaType.IMAGE,
      metadata: sampleMetadata,
    });
    asset.clearDomainEvents();

    const dims = new MediaDimensions({ width: 1920, height: 1080 });
    asset.updateDimensions(dims);

    expect(asset.dimensions?.width).toBe(1920);
    expect(asset.dimensions?.height).toBe(1080);
    expect(asset.domainEvents.length).toBe(1);
    expect(asset.domainEvents[0]!.eventName).toBe('media.asset.updated');
  });

  it('should soft delete media asset and throw when trying to update deleted asset', () => {
    const asset = MediaAsset.create({
      code: 'MED-000003',
      type: MediaType.IMAGE,
      metadata: sampleMetadata,
    });

    asset.softDelete('user-123');
    expect(asset.isDeleted()).toBe(true);
    expect(asset.status).toBe(MediaStatus.ARCHIVED);

    expect(() => asset.softDelete('user-123')).toThrow(MediaAssetAlreadyDeletedException);
    expect(() => asset.changeStatus(MediaStatus.READY)).toThrow(MediaAssetAlreadyDeletedException);
  });
});
