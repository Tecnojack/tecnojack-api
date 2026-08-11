export class StorageException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FileNotFoundStorageException extends StorageException {
  constructor(path: string) {
    super(`File not found at path: "${path}"`);
  }
}

export class FileTooLargeStorageException extends StorageException {
  constructor(sizeBytes: number, maxBytes: number) {
    super(`File size (${sizeBytes} bytes) exceeds maximum allowed limit (${maxBytes} bytes).`);
  }
}

export class InvalidFileTypeStorageException extends StorageException {
  constructor(extension: string, allowedExtensions: string[]) {
    super(`File extension ".${extension}" is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}.`);
  }
}

export class PathTraversalStorageException extends StorageException {
  constructor(path: string) {
    super(`Access denied. Path traversal detected in: "${path}".`);
  }
}

export class StorageOperationFailedException extends StorageException {
  constructor(operation: string, details: string) {
    super(`Storage operation "${operation}" failed: ${details}`);
  }
}
