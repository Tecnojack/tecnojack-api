export class GalleryException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class GalleryNotFoundException extends GalleryException {
  constructor(identifier: string) {
    super(`Gallery with identifier "${identifier}" was not found.`);
  }
}

export class GalleryAlreadyDeletedException extends GalleryException {
  constructor(id: string) {
    super(`Gallery "${id}" is already deleted.`);
  }
}

export class GalleryAssetAlreadyExistsException extends GalleryException {
  constructor(galleryId: string, mediaAssetId: string) {
    super(`Media asset "${mediaAssetId}" is already part of gallery "${galleryId}".`);
  }
}

export class InvalidGalleryStatusTransitionException extends GalleryException {
  constructor(current: string, target: string, reason?: string) {
    super(`Invalid gallery status transition from "${current}" to "${target}".${reason ? ` Reason: ${reason}` : ''}`);
  }
}
