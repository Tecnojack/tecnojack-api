import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';

import { bootstrapApplication } from './bootstrap/bootstrap-application.js';

const app = await bootstrapApplication();
const config = app.get(ConfigService);
const port = config.getOrThrow<number>('app.port');

await app.listen(port, '0.0.0.0');
