import { Injectable } from '@nestjs/common';
import type { ClockProviderPort } from '../../domain/providers/clock.provider.port.js';

@Injectable()
export class SystemClockProvider implements ClockProviderPort {
  now(): Date {
    return new Date();
  }
}
