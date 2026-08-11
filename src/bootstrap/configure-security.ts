import type { INestApplication } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

export function configureSecurity(app: INestApplication): void {
  app.use(helmet());
  app.use(compression());
}
