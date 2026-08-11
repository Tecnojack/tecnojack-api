import { Injectable } from '@nestjs/common';
import type { UuidProviderPort } from '../../domain/providers/uuid.provider.port.js';

@Injectable()
export class CryptoUuidProvider implements UuidProviderPort {
  generate(): string {
    return crypto.randomUUID();
  }

  validate(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
