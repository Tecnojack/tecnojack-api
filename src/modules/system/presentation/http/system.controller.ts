import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, type HealthCheckResult } from '@nestjs/terminus';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PrismaService } from '../../../../platform/database/prisma/prisma.service.js';

interface VersionResponse {
  name: string;
  version: string;
  environment: string;
}

@ApiTags('System')
@Controller()
export class SystemController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('health/live')
  @HealthCheck()
  @ApiOperation({ summary: 'Check whether the API process is alive' })
  @ApiOkResponse({ description: 'The API process is alive.' })
  checkLiveness(): Promise<HealthCheckResult> {
    return this.health.check([() => Promise.resolve({ api: { status: 'up' as const } })]);
  }

  @Get('health/ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Check whether the API is ready to receive traffic' })
  @ApiOkResponse({ description: 'The API and PostgreSQL are ready.' })
  checkReadiness(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => {
        await this.prisma.$queryRaw`SELECT 1`;
        return { database: { status: 'up' as const } };
      },
    ]);
  }

  @Get('version')
  @ApiOperation({ summary: 'Get service version metadata' })
  @ApiOkResponse({ description: 'Current service version.' })
  getVersion(): VersionResponse {
    return {
      name: '@tecnojack/api',
      version: process.env.npm_package_version ?? '0.1.0',
      environment: process.env.NODE_ENV ?? 'development',
    };
  }
}
