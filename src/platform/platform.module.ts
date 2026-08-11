import { Module, Global } from '@nestjs/common';
import { PrismaService } from './database/prisma/prisma.service.js';
import { CLOCK_PROVIDER } from './domain/providers/clock.provider.port.js';
import { UUID_PROVIDER } from './domain/providers/uuid.provider.port.js';
import { SEQUENCE_GENERATOR } from './domain/providers/sequence-generator.port.js';
import { DOMAIN_EVENT_PUBLISHER } from './domain/events/domain-event-publisher.port.js';
import { SystemClockProvider } from './infrastructure/providers/system-clock.provider.js';
import { CryptoUuidProvider } from './infrastructure/providers/crypto-uuid.provider.js';
import { PrismaSequenceGenerator } from './infrastructure/sequence/prisma-sequence-generator.js';
import { InMemoryDomainEventPublisher } from './infrastructure/events/in-memory-domain-event-publisher.js';

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: CLOCK_PROVIDER, useClass: SystemClockProvider },
    { provide: UUID_PROVIDER, useClass: CryptoUuidProvider },
    { provide: SEQUENCE_GENERATOR, useClass: PrismaSequenceGenerator },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: InMemoryDomainEventPublisher },
  ],
  exports: [
    PrismaService,
    CLOCK_PROVIDER,
    UUID_PROVIDER,
    SEQUENCE_GENERATOR,
    DOMAIN_EVENT_PUBLISHER,
  ],
})
export class PlatformModule {}
