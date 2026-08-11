import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { databaseConfig } from '../../../src/config/database.config.js';
import { PrismaService } from '../../../src/platform/database/prisma/prisma.service.js';

describe('PrismaService (integration)', () => {
  it('connects to PostgreSQL', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] })],
      providers: [PrismaService],
    }).compile();
    const prisma = moduleRef.get(PrismaService);

    await prisma.$connect();
    const result = await prisma.$queryRaw<{ value: number }[]>`SELECT 1 AS value`;

    expect(result[0]?.value).toBe(1);
    await prisma.$disconnect();
  });
});
