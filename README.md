# TECNOJACK API

Backend modular de la plataforma audiovisual TECNOJACK.

## Estado

La Etapa 0 implementa exclusivamente infraestructura: NestJS, configuración, PostgreSQL, Prisma, Docker, Swagger, seguridad HTTP, validación, logging, health checks, rate limiting, CI/CD y calidad de código. No contiene lógica de los dominios PEOPLE, EVENTS, CONTRACTS, PAYMENTS, MEDIA, GALLERY ni DELIVERABLES.

## Requisitos

- Node.js 24.19.0 LTS.
- pnpm 10.15.1 mediante Corepack.
- Docker con Docker Compose v2.

## Inicio rápido

1. Copiar `.env.example` como `.env`.
2. Cambiar `JWT_SECRET` por un valor local de al menos 32 caracteres.
3. Instalar dependencias con `pnpm install`.
4. Iniciar PostgreSQL y la API con `docker compose up -d`.
5. Generar Prisma Client con `pnpm prisma:generate`.
6. Crear/aplicar migraciones de desarrollo con `pnpm prisma:migrate:dev`.
7. Ejecutar localmente con `pnpm start:dev` si no se utiliza el contenedor de API.

## Endpoints de infraestructura

| Endpoint                   | Propósito                         |
| -------------------------- | --------------------------------- |
| `GET /api/v1/health/live`  | Liveness del proceso              |
| `GET /api/v1/health/ready` | Readiness con PostgreSQL          |
| `GET /api/v1/version`      | Metadatos de versión              |
| `GET /docs`                | Swagger UI cuando está habilitado |
| `GET /docs/openapi.json`   | Contrato OpenAPI generado         |

## Comandos

### Desarrollo y build

| Comando          | Acción                                   |
| ---------------- | ---------------------------------------- |
| `pnpm start:dev` | Inicia NestJS con recarga                |
| `pnpm build`     | Genera el build productivo               |
| `pnpm start`     | Ejecuta `dist/main.js`                   |
| `pnpm check`     | Formato, lint, tipos, unit tests y build |

### Calidad y pruebas

| Comando                 | Acción                      |
| ----------------------- | --------------------------- |
| `pnpm format`           | Formatea el repositorio     |
| `pnpm format:check`     | Verifica formato            |
| `pnpm lint`             | Ejecuta ESLint sin warnings |
| `pnpm typecheck`        | Verifica TypeScript         |
| `pnpm test`             | Pruebas unitarias           |
| `pnpm test:integration` | Pruebas con PostgreSQL      |
| `pnpm test:e2e`         | Pruebas HTTP E2E            |
| `pnpm test:cov`         | Cobertura unitaria          |

### Prisma

| Comando                      | Acción                            |
| ---------------------------- | --------------------------------- |
| `pnpm prisma:generate`       | Genera Prisma Client              |
| `pnpm prisma:validate`       | Valida el esquema                 |
| `pnpm prisma:migrate:dev`    | Crea y aplica una migración local |
| `pnpm prisma:migrate:deploy` | Aplica migraciones aprobadas      |
| `pnpm prisma:migrate:status` | Consulta estado                   |
| `pnpm prisma:seed`           | Ejecuta seeders idempotentes      |

## Docker

- `compose.yml`: API y PostgreSQL para desarrollo.
- `compose.override.yml`: bind mount y recarga local.
- `compose.test.yml`: PostgreSQL aislado de pruebas en el puerto 5433.
- `docker/compose.prod.yml`: referencia portable de producción.

Las migraciones no se ejecutan ocultas durante el arranque web. Para ejecutarlas como tarea Compose:

```text
docker compose --profile tools run --rm migrate
```

## Variables de entorno

`.env.example` es el contrato documental. La aplicación valida todas las variables durante el arranque y falla de forma explícita si falta una obligatoria. Ningún secreto real debe confirmarse en Git.

Swagger está desactivado por defecto y se habilita mediante `SWAGGER_ENABLED=true`. CORS acepta una lista separada por comas en `CORS_ORIGINS`.

## Arquitectura

La documentación oficial está indexada en [`docs/README.md`](docs/README.md). Las decisiones nuevas deben registrarse como ADR dentro del Platform Blueprint.

Regla de frontera: un módulo solo puede importar la superficie `public/` de otro módulo. Prisma y los adaptadores técnicos permanecen fuera del dominio.

## Commits

El repositorio usa Conventional Commits, Commitlint, Husky y lint-staged. CI vuelve a ejecutar todas las comprobaciones relevantes.
