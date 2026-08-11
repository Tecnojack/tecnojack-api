import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../platform/database/prisma/prisma.service.js';

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  version: string;
  build: string;
  database: {
    status: 'UP' | 'DOWN';
  };
  storage: {
    status: 'UP' | 'DOWN';
  };
  queue: {
    status: 'UP' | 'DOWN' | 'PREPARED';
  };
}

@Injectable()
export class HealthChecksService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthStatus> {
    let dbStatus: 'UP' | 'DOWN' = 'UP';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'DOWN';
    }

    const overallStatus = dbStatus === 'UP' ? 'UP' : 'DOWN';

    return {
      status: overallStatus,
      version: '1.0.0',
      build: 'development-build',
      database: {
        status: dbStatus,
      },
      storage: {
        status: 'UP',
      },
      queue: {
        status: 'PREPARED',
      },
    };
  }
}
