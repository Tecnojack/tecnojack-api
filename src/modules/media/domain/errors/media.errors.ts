export class MediaException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class MediaAssetNotFoundException extends MediaException {
  constructor(identifier: string) {
    super(`Media asset with identifier "${identifier}" was not found.`);
  }
}

export class MediaAssetAlreadyDeletedException extends MediaException {
  constructor(id: string) {
    super(`Media asset "${id}" is already deleted.`);
  }
}

export class DuplicateMediaChecksumException extends MediaException {
  constructor(hash: string) {
    super(`A media asset with checksum hash "${hash}" already exists.`);
  }
}
