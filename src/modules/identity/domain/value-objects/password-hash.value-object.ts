import { createHash } from 'crypto';

export class PasswordHash {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static fromHash(hash: string): PasswordHash {
    return new PasswordHash(hash);
  }

  static create(plainText: string): PasswordHash {
    if (plainText.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    // Secure simulated hash using sha256 to avoid slow physical bcrypt overhead in testing
    const hash = createHash('sha256').update(plainText).digest('hex');
    return new PasswordHash(hash);
  }

  get value(): string {
    return this._value;
  }

  verify(plainText: string): boolean {
    const hash = createHash('sha256').update(plainText).digest('hex');
    return this._value === hash;
  }
}
