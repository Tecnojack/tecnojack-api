import { Injectable, Inject, Optional } from '@nestjs/common';
import type { NotificationProviderPort } from '../ports/notification-provider.port.js';

export const NOTIFICATION_PROVIDERS_TOKEN = Symbol('NOTIFICATION_PROVIDERS_TOKEN');

@Injectable()
export class NotificationProviderFactory {
  constructor(
    @Optional()
    @Inject(NOTIFICATION_PROVIDERS_TOKEN)
    private readonly providers: NotificationProviderPort[] = [],
  ) {}

  getProvider(channel: string): NotificationProviderPort {
    const provider = this.providers.find((p) => p.supportsChannel(channel));
    if (!provider) {
      // Fallback dummy mock provider to prevent runtime crashes when no physical providers are registered
      return {
        getProviderName: () => `FallbackMock${channel}Provider`,
        supportsChannel: () => true,
        send: async () => {
          // Mock send action
        },
      };
    }
    return provider;
  }
}
