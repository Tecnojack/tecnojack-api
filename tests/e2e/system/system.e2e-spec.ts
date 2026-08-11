import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Express } from 'express';
import request from 'supertest';

import { AppModule } from '../../../src/app.module.js';

describe('System (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('reports liveness', async () => {
    const server = app.getHttpAdapter().getInstance() as Express;
    await request(server).get('/api/v1/health/live').expect(200);
  });

  it('reports readiness when PostgreSQL is available', async () => {
    const server = app.getHttpAdapter().getInstance() as Express;
    await request(server).get('/api/v1/health/ready').expect(200);
  });
});
