import { StorageValidatorService } from './storage-validator.service.js';
import {
  FileTooLargeStorageException,
  InvalidFileTypeStorageException,
} from '../errors/storage.errors.js';

describe('StorageValidatorService', () => {
  let validator: StorageValidatorService;

  beforeEach(() => {
    validator = new StorageValidatorService();
  });

  it('should pass size validation when within limit', () => {
    expect(() => validator.validateSize(1024, 2048)).not.toThrow();
  });

  it('should throw FileTooLargeStorageException when size exceeds limit', () => {
    expect(() => validator.validateSize(5000, 2048)).toThrow(FileTooLargeStorageException);
  });

  it('should pass extension validation when extension is allowed', () => {
    expect(() => validator.validateExtension('document.pdf', ['pdf', 'png'])).not.toThrow();
  });

  it('should throw InvalidFileTypeStorageException when extension is not allowed', () => {
    expect(() => validator.validateExtension('script.exe', ['pdf', 'png'])).toThrow(
      InvalidFileTypeStorageException,
    );
  });

  it('should infer mime type based on extension', () => {
    expect(validator.inferMimeType('photo.png')).toBe('image/png');
    expect(validator.inferMimeType('file.pdf')).toBe('application/pdf');
    expect(validator.inferMimeType('data.unknown')).toBe('application/octet-stream');
  });
});
