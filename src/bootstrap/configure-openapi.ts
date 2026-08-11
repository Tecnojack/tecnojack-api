import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureOpenApi(app: INestApplication): void {
  const config = app.get(ConfigService);

  if (!config.get<boolean>('swagger.enabled', false)) {
    return;
  }

  const documentConfig = new DocumentBuilder()
    .setTitle('TECNOJACK API')
    .setDescription('API de la plataforma audiovisual TECNOJACK')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup(config.get<string>('swagger.path', 'docs'), app, document, {
    jsonDocumentUrl: `${config.get<string>('swagger.path', 'docs')}/openapi.json`,
    customSiteTitle: 'TECNOJACK API Documentation',
  });
}
