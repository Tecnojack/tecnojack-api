# Informe integral — Arquitectura e implementación de la Etapa 0

**Proyecto:** TECNOJACK API  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api>  
**Rama:** `main`  
**Fecha:** 11 de agosto de 2026  
**Estado:** Implementación publicada; validación Docker/CI pendiente por bloqueos externos

---

## 1. Resumen ejecutivo

Se diseñó y documentó la arquitectura funcional, de dominio y física de TECNOJACK. Posteriormente se implementó la Etapa 0 del Platform Blueprint directamente sobre el repositorio oficial.

El resultado es una aplicación NestJS compilable y modular, preparada para comenzar la construcción de dominios de negocio. Incluye PostgreSQL, Prisma, configuración validada, logging, manejo global de errores, Swagger, seguridad HTTP, health checks, rate limiting, Docker, pruebas, automatización de calidad y GitHub Actions.

No se implementó lógica de PEOPLE, EVENTS, CONTRACTS, PAYMENTS, CRM, MEDIA, GALLERY, DELIVERABLES o INVITATIONS.

La implementación fue publicada en la rama `main` mediante commits convencionales y sin `force push`.

---

## 2. Trabajo arquitectónico realizado

### 2.1 Propuesta de infraestructura

Se elaboró la propuesta de arquitectura e infraestructura del backend, incluyendo:

- Monolito modular.
- NestJS y TypeScript.
- PostgreSQL y Prisma ORM.
- JWT y refresh tokens como infraestructura futura de autenticación.
- Configuración por entorno.
- Seguridad HTTP.
- Validación global.
- Manejo global de errores.
- Logging estructurado.
- Rate limiting.
- Swagger/OpenAPI.
- Health checks.
- Docker y Docker Compose.
- Calidad, pruebas e integración continua.

Documento:

- [`docs/architecture/infrastructure-proposal.md`](../architecture/infrastructure-proposal.md)

### 2.2 Selección de versiones

Se verificaron versiones estables y compatibles, priorizando soporte y madurez:

| Tecnología | Versión fijada |
| ---------- | -------------: |
| Node.js    |    24.19.0 LTS |
| NestJS     |        11.1.29 |
| Prisma ORM |          7.9.1 |
| PostgreSQL |          17.10 |
| TypeScript |          5.9.3 |
| pnpm       |        10.15.1 |

PostgreSQL 17 fue elegido sobre PostgreSQL 18 para favorecer madurez operativa. Node.js 24 fue elegido porque es LTS, mientras que Node.js 26 todavía no era la línea productiva recomendada durante la decisión.

### 2.3 Events Domain Design v2

Se diseñó el primer dominio central de TECNOJACK y se convirtió en especificación oficial.

Decisiones principales:

- `Event` es el Aggregate Root principal del negocio.
- Event representa un proyecto audiovisual, no una cita de calendario.
- Event no depende directamente de Client.
- PEOPLE será propietario de Person y Organization.
- Los participantes se relacionarán mediante roles contextuales.
- `EventSession` es el término oficial para las etapas temporales.
- El brief forma parte de Event como objeto de valor.
- Location es reutilizable.
- EventType puede ofrecer plantillas versionadas.
- Tags proporcionarán clasificación flexible.
- Checklist queda diseñado como capacidad futura.
- Timeline será una proyección derivada.
- Los módulos dependientes conservarán su propio ownership.

El documento incluye lenguaje ubicuo, entidades, objetos de valor, estados, ciclo de vida, reglas, casos de uso, APIs, DTOs conceptuales, permisos, validaciones, riesgos e integraciones futuras.

Documento:

- [`docs/domains/events/events-domain-design.md`](../domains/events/events-domain-design.md)

### 2.4 TECNOJACK Platform Blueprint v1

Se creó la constitución arquitectónica de la plataforma completa.

Incluye:

- Visión y objetivos globales.
- Principios arquitectónicos.
- Lenguaje ubicuo global.
- Core, Supporting y Generic Domains.
- Mapa de 24 módulos.
- Ownership Matrix.
- Dependencias permitidas y prohibidas.
- Flujo empresarial completo.
- Integraciones entre módulos.
- Eventos de dominio globales.
- Roadmap arquitectónico.
- Riesgos y mitigaciones.
- Registro ADR oficial.

Módulos definidos:

- AUTH.
- USERS.
- ROLES.
- PERMISSIONS.
- SYSTEM.
- PEOPLE.
- EVENTS.
- CONTRACTS.
- PAYMENTS.
- MEDIA.
- GALLERY.
- DELIVERABLES.
- INVITATIONS.
- PRODUCTION.
- CRM.
- CMS.
- NOTIFICATIONS.
- CLIENT PORTAL.
- BACKOFFICE.
- SETTINGS.
- AUTOMATION.
- ANALYTICS.
- STORAGE.
- AUDIT.

Documento:

- [`docs/architecture/platform-blueprint.md`](../architecture/platform-blueprint.md)

### 2.5 Repository Architecture v1

Se definió la arquitectura física oficial del repositorio.

Decisiones principales:

- Una sola aplicación NestJS en la raíz.
- Sin monorepo, `apps/`, `packages/` o `libs` inicialmente.
- Organización principal por módulo de dominio.
- Estructura proporcional: `public`, `domain`, `application`, `infrastructure` y `presentation` solo cuando exista contenido real.
- Otros módulos solo pueden importar la superficie `public/`.
- `shared/` contiene primitivas agnósticas de frameworks.
- `platform/` contiene infraestructura técnica.
- No se utilizarán carpetas ambiguas globales como `common`, `core`, `utils` o `misc`.
- Prisma utiliza esquema multiarchivo y migraciones centralizadas.
- Unit tests co-localizados; integración y E2E bajo `tests/`.

Documento:

- [`docs/architecture/repository-architecture.md`](../architecture/repository-architecture.md)

---

## 3. ADR registrados

Se estableció un mecanismo ADR obligatorio dentro del Platform Blueprint. Cada decisión futura debe contener identificador, estado, fecha, contexto, decisión y consecuencias.

ADRs registrados:

| ADR     | Decisión                                                |
| ------- | ------------------------------------------------------- |
| ADR-001 | Event es el Aggregate Root principal                    |
| ADR-002 | Monolito modular                                        |
| ADR-003 | PEOPLE es propietario de la identidad de negocio        |
| ADR-004 | Client es un rol y no una dependencia directa de Event  |
| ADR-005 | Ownership único por módulo                              |
| ADR-006 | MEDIA es propietario de los activos digitales           |
| ADR-007 | STORAGE es infraestructura agnóstica del proveedor      |
| ADR-008 | Timeline es una proyección derivada                     |
| ADR-009 | EventSession es el término temporal oficial             |
| ADR-010 | El brief forma parte de Event                           |
| ADR-011 | Location es reutilizable                                |
| ADR-012 | EventType ofrece plantillas versionadas no retroactivas |
| ADR-013 | Timeline y Analytics no son fuentes operacionales       |
| ADR-014 | Las interfaces de experiencia no poseen el dominio      |
| ADR-015 | Las automatizaciones usan comandos públicos             |
| ADR-016 | Las decisiones se registran como ADR                    |
| ADR-017 | Aplicación única NestJS en modo estándar                |
| ADR-018 | Organización física por módulo                          |
| ADR-019 | Superficie pública única para cada módulo               |
| ADR-020 | Separación entre `shared/` y `platform/`                |
| ADR-021 | Prisma multiarchivo y migraciones centralizadas         |
| ADR-022 | Estructura interna proporcional                         |
| ADR-023 | Organización oficial de pruebas                         |

El siguiente identificador disponible es `ADR-024`.

No fue necesario crear otro ADR durante la implementación porque el software respetó las decisiones ya aprobadas.

---

## 4. Preparación del repositorio

El workspace inicialmente contenía únicamente los documentos arquitectónicos y no era un repositorio Git.

Acciones realizadas:

1. Inicialización de Git con rama `main`.
2. Configuración del remoto oficial.
3. Organización de documentos bajo `docs/`.
4. Creación del índice documental.
5. Creación de `.gitignore`.
6. Primer commit de arquitectura.
7. Integración posterior del commit inicial existente en GitHub sin reescribir la historia.
8. Publicación de `main` sin `force push`.

El commit remoto inicial contenía únicamente un README mínimo. Se integró mediante merge de historias no relacionadas y se conservó el README técnico completo de la implementación.

---

## 5. Implementación de la Etapa 0

### 5.1 Proyecto NestJS

Se creó una aplicación NestJS 11 en modo estándar con:

- `src/main.ts` como entrada.
- `src/app.module.ts` como composition root.
- Arranque separado en `src/bootstrap/`.
- Shutdown hooks.
- Prefijo global `/api/v1`.
- ESM mediante `type: module`.
- Imports compatibles con NodeNext.

### 5.2 TypeScript

Configuración estricta:

- `strict`.
- `noImplicitOverride`.
- `noUncheckedIndexedAccess`.
- `noImplicitReturns`.
- `noFallthroughCasesInSwitch`.
- `forceConsistentCasingInFileNames`.
- Decorators y metadata para NestJS.
- Build separado en `dist/`.
- Configuración específica para Jest.

Aliases preparados:

- `@app/*`.
- `@config/*`.
- `@modules/*`.
- `@platform/*`.
- `@shared/*`.
- `@generated/*`.
- `@test/*`.

### 5.3 pnpm

Se configuró:

- `packageManager: pnpm@10.15.1`.
- Lockfile reproducible.
- Versiones exactas.
- Validación estricta de engines.
- Node.js `>=24 <25`.
- Scripts de desarrollo, calidad, build, test, Prisma y seed.

### 5.4 Configuración centralizada

Archivos implementados:

- `app.config.ts`.
- `auth.config.ts`.
- `cors.config.ts`.
- `database.config.ts`.
- `logging.config.ts`.
- `rate-limit.config.ts`.
- `swagger.config.ts`.
- `storage.config.ts`.
- `mail.config.ts`.
- `upload.config.ts`.
- `image.config.ts`.
- `ffmpeg.config.ts`.

La aplicación valida las variables durante el arranque con Zod. Si falta PostgreSQL, el secreto JWT es débil o una variable tiene formato incorrecto, el proceso falla de forma explícita.

Ningún módulo debe leer `process.env` directamente fuera de la capa de configuración.

### 5.5 Variables de entorno

Se creó `.env.example` con:

- Entorno, puerto, prefijo y versión.
- PostgreSQL.
- JWT HS256 y expiraciones.
- CORS.
- Logging.
- Swagger.
- Rate limiting.
- Storage.
- Mail.
- Uploads.
- Image Processing.
- FFmpeg.

No se confirmó ningún secreto real.

### 5.6 Autenticación preparada

Se creó el módulo de infraestructura AUTH con `JwtModule`:

- HS256.
- Secreto validado de mínimo 32 caracteres.
- Expiración configurable.
- Registro global del servicio JWT.

No se implementaron endpoints, credenciales, usuarios, entidades o sesiones persistentes. La rotación de refresh tokens pertenece a una etapa posterior del módulo AUTH.

### 5.7 Validación global

Se configuró `ValidationPipe` global con:

- Transformación.
- Whitelist.
- Rechazo de propiedades desconocidas.
- Rechazo de valores no válidos.
- Reporte de todos los errores aplicables.

### 5.8 Manejo global de errores

Se implementó un filtro global compatible con Problem Details:

- Content type `application/problem+json`.
- Tipo, título, estado y detalle.
- Ruta de la petición.
- Request ID.
- Timestamp.
- Errores de validación normalizados.
- Ocultación de detalles internos para errores 500.
- Logging de stack trace únicamente en servidor.

### 5.9 Request ID

Se implementó middleware global:

- Respeta `X-Request-Id` válido enviado por el consumidor.
- Genera UUID cuando no existe.
- Devuelve el identificador en la respuesta.
- Lo incorpora en respuestas de error.

### 5.10 Logging

Se configuró Pino mediante `nestjs-pino`:

- JSON estructurado por defecto.
- Nivel configurable.
- Pretty logging para desarrollo.
- Redacción de Authorization, cookies, tokens, refresh tokens y contraseñas.
- Integración como logger oficial de NestJS.

### 5.11 Seguridad HTTP

Se implementó:

- Helmet.
- Compresión.
- CORS configurable.
- Métodos y headers permitidos explícitos.
- Exposición de `X-Request-Id`.
- Rate limiting global.
- Secretos obligatorios.
- Swagger deshabilitado por defecto.

### 5.12 Swagger/OpenAPI

Swagger se habilita mediante configuración e incluye:

- Título y descripción.
- Versión.
- Esquema Bearer JWT.
- Swagger UI.
- Documento OpenAPI JSON.

Rutas predeterminadas:

- `/docs`.
- `/docs/openapi.json`.

### 5.13 SYSTEM

Se implementó exclusivamente el módulo de infraestructura SYSTEM.

Endpoints:

| Endpoint                   | Función                                     |
| -------------------------- | ------------------------------------------- |
| `GET /api/v1/health/live`  | Comprueba que el proceso está vivo          |
| `GET /api/v1/health/ready` | Comprueba PostgreSQL mediante consulta real |
| `GET /api/v1/version`      | Devuelve nombre, versión y entorno          |

No se implementaron APIs funcionales de negocio.

---

## 6. Prisma y PostgreSQL

### 6.1 Prisma ORM

Se configuró Prisma 7.9.1 con:

- ESM.
- Generador moderno `prisma-client`.
- Output explícito en `src/generated/prisma/`.
- Esquema multiarchivo bajo `prisma/schema/`.
- Configuración mediante `prisma.config.ts`.
- Driver adapter PostgreSQL.
- PrismaService integrado con el ciclo de vida de NestJS.
- Conexión y desconexión explícitas.

### 6.2 Esquema

El esquema inicial no contiene entidades de negocio. Esto respeta la prohibición de implementar PEOPLE, EVENTS u otros módulos antes de su aprobación.

Los archivos futuros del esquema se organizarán por módulo propietario.

### 6.3 Migraciones

Se prepararon scripts para:

- Desarrollo.
- Deploy.
- Consulta de estado.
- Validación.
- Formato.

Las migraciones se ejecutan como tarea separada; el servidor web no modifica ocultamente el esquema durante su arranque.

### 6.4 Seeders

Se creó el orquestador inicial y quedaron reservadas las categorías aprobadas:

1. Permissions.
2. Roles.
3. Admin.
4. Settings.

No se insertan todavía datos porque aún no existen sus modelos propietarios.

---

## 7. Docker

### 7.1 Dockerfile

Se implementó un Dockerfile multi-stage:

- Imagen Node.js 24.19.0 Bookworm Slim.
- pnpm mediante Corepack.
- Instalación reproducible.
- Stage de desarrollo.
- Generación de Prisma Client.
- Build productivo.
- Poda de dependencias de desarrollo.
- Usuario productivo sin privilegios.
- Exposición del puerto 3000.

### 7.2 Docker Compose

Se crearon:

- `compose.yml`: API y PostgreSQL.
- `compose.override.yml`: desarrollo con bind mount.
- `compose.test.yml`: PostgreSQL de pruebas en puerto 5433.
- `docker/compose.prod.yml`: referencia productiva portable.

PostgreSQL usa `postgres:17.10-bookworm` con:

- Volumen persistente.
- Health check.
- Usuario y base local documentados.
- Dependencia saludable antes de iniciar la API.

La API tiene health check HTTP.

Se agregó un servicio `migrate` bajo perfil `tools` para aplicar migraciones como tarea explícita.

### 7.3 Imágenes verificadas

Se confirmó en Docker Hub que existen y están activas:

- `node:24.19.0-bookworm-slim`.
- `postgres:17.10-bookworm`.

### 7.4 Limitación local

Docker no está instalado en la máquina de trabajo. Por esta razón no fue posible ejecutar localmente:

- `docker compose up -d`.
- PostgreSQL en contenedor.
- Test de health readiness real.
- Pruebas de integración.
- Pruebas E2E.
- Build real de la imagen Docker.

La configuración fue formateada y revisada estáticamente, pero la ejecución permanece pendiente.

---

## 8. Calidad de código

### 8.1 ESLint

Se configuró ESLint flat config con TypeScript type-aware:

- Cero warnings permitidos.
- Promesas no manejadas prohibidas.
- Imports de tipos consistentes.
- Variables no usadas controladas.
- Reglas estilísticas y de seguridad de tipos.
- Exclusión de Prisma generado y artefactos.

### 8.2 Prettier

Se configuró formato consistente para:

- TypeScript.
- JavaScript.
- JSON.
- YAML.
- Markdown.

Los documentos arquitectónicos aprobados fueron normalizados por Prettier sin cambiar sus decisiones.

### 8.3 Husky y lint-staged

Hooks creados:

- `pre-commit`: lint-staged.
- `commit-msg`: commitlint.

Los hooks ejecutan pnpm mediante Corepack y están versionados como ejecutables.

### 8.4 Conventional Commits

Se configuró Commitlint con la convención oficial.

Los mensajes confirmados fueron validados correctamente.

---

## 9. Pruebas

### 9.1 Unitarias

Se implementaron pruebas de configuración para validar:

- Defaults seguros.
- Rechazo de PostgreSQL ausente.
- Rechazo de secretos JWT débiles.

Resultado:

- 1 suite aprobada.
- 3 pruebas aprobadas.
- 0 fallos.

### 9.2 Integración

Se preparó una prueba real de Prisma contra PostgreSQL:

- Conexión.
- Consulta `SELECT 1`.
- Desconexión.

No pudo ejecutarse localmente por ausencia de PostgreSQL/Docker.

### 9.3 E2E

Se prepararon pruebas HTTP para:

- Liveness.
- Readiness con PostgreSQL.

No pudieron ejecutarse localmente por ausencia de PostgreSQL/Docker.

### 9.4 Organización

- Unitarias co-localizadas con el código.
- Integración bajo `tests/integration/`.
- E2E bajo `tests/e2e/`.
- Setup bajo `tests/support/`.
- Configuración Jest específica para NodeNext/TypeScript.

---

## 10. GitHub Actions y automatización

### 10.1 Workflow CI

Se creó `.github/workflows/ci.yml` con:

1. Checkout.
2. pnpm 10.15.1.
3. Node.js 24.19.0.
4. PostgreSQL 17.10 como service container.
5. Instalación con lockfile.
6. Generación Prisma.
7. Validación Prisma.
8. Verificación de formato.
9. ESLint.
10. Typecheck.
11. Unit tests con cobertura.
12. Migraciones en base de pruebas.
13. Integration tests.
14. E2E tests.
15. Build productivo.

### 10.2 Security workflow

Se creó un workflow semanal y manual para:

- Instalar con lockfile.
- Ejecutar auditoría de dependencias productivas.
- Fallar ante vulnerabilidades de severidad alta.

### 10.3 Dependabot

Se configuraron actualizaciones para:

- npm/pnpm.
- NestJS agrupado.
- Prisma agrupado.
- GitHub Actions.
- Docker.

### 10.4 Pull request template

Incluye checklist de:

- Formato.
- Lint.
- Typecheck.
- Pruebas.
- Build.
- Documentación/OpenAPI.
- Ownership y límites.
- Necesidad de ADR.

### 10.5 Estado actual de CI

GitHub Actions fue disparado dos veces:

- Primera ejecución: <https://github.com/Tecnojack/tecnojack-api/actions/runs/31460119578>
- Segunda ejecución: <https://github.com/Tecnojack/tecnojack-api/actions/runs/31460230178>

Ambas fallaron antes de asignar un runner:

- `0` steps ejecutados.
- Sin `runner_name`.
- Sin step fallido.
- Sin logs descargables.
- Ningún comando del proyecto fue ejecutado.

Se verificó que las imágenes Docker existen. El comportamiento apunta a un problema externo de preparación o permisos/capacidad de GitHub Actions, no a una prueba, build o lint fallido.

La GitHub App disponible permite lectura, pero no reejecutar el workflow ni descargar el log administrativo. GitHub CLI no está instalado en la máquina.

---

## 11. README y operación

Se creó un README técnico que documenta:

- Estado de la etapa.
- Requisitos.
- Inicio rápido.
- Endpoints.
- Scripts.
- Prisma.
- Docker.
- Variables de entorno.
- Arquitectura.
- Commits.

Documento:

- [`README.md`](../../README.md)

También se crearon:

- Índice documental.
- README de Prisma.
- README de Docker.
- README de pruebas.

---

## 12. Scripts disponibles

### Desarrollo y build

- `pnpm start`.
- `pnpm start:dev`.
- `pnpm start:debug`.
- `pnpm build`.
- `pnpm check`.

### Calidad

- `pnpm format`.
- `pnpm format:check`.
- `pnpm lint`.
- `pnpm lint:fix`.
- `pnpm typecheck`.

### Pruebas

- `pnpm test`.
- `pnpm test:watch`.
- `pnpm test:cov`.
- `pnpm test:integration`.
- `pnpm test:e2e`.

### Prisma

- `pnpm prisma:generate`.
- `pnpm prisma:validate`.
- `pnpm prisma:format`.
- `pnpm prisma:migrate:dev`.
- `pnpm prisma:migrate:deploy`.
- `pnpm prisma:migrate:status`.
- `pnpm prisma:seed`.

---

## 13. Verificaciones realizadas

### Aprobadas

| Verificación                | Resultado                             |
| --------------------------- | ------------------------------------- |
| Instalación de dependencias | Aprobada                              |
| Lockfile pnpm               | Generado                              |
| Prisma Client               | Generado con 7.9.1                    |
| Prisma schema               | Válido                                |
| Prettier                    | Aprobado                              |
| ESLint                      | Aprobado, cero warnings               |
| TypeScript                  | Aprobado                              |
| Unit tests                  | 3/3 aprobadas                         |
| NestJS build                | Aprobado                              |
| Commitlint                  | Aprobado                              |
| Git worktree                | Limpio al finalizar la implementación |
| Publicación remota          | `main` sincronizada                   |

### Condiciones del entorno

La máquina local usa Node.js 22.16.0. El proyecto exige Node.js 24.19.0 mediante `engine-strict`.

Para ejecutar verificaciones en la máquina se aplicó una excepción exclusivamente en la línea de comandos. No se debilitó el contrato del repositorio ni el CI.

### Pendientes por infraestructura externa

| Verificación             | Motivo                               |
| ------------------------ | ------------------------------------ |
| Docker Compose runtime   | Docker no instalado                  |
| PostgreSQL runtime local | Docker/PostgreSQL no disponibles     |
| Integration tests        | Requieren PostgreSQL                 |
| E2E tests                | Requieren PostgreSQL                 |
| Imagen Docker            | Docker no instalado                  |
| CI completa              | GitHub falla antes de asignar runner |

---

## 14. Commits realizados

| Commit    | Mensaje                                                         |
| --------- | --------------------------------------------------------------- |
| `043da76` | `docs(architecture): establish approved project specifications` |
| `33a0cf6` | `feat(bootstrap): initialize infrastructure application`        |
| `2560122` | `feat(docker): add postgres and container workflows`            |
| `db3c5ca` | `chore(ci): enforce quality and commit standards`               |
| `72d8522` | `docs(readme): document stage zero operations`                  |
| `efb942d` | `chore(repo): integrate remote initial history`                 |
| `542b520` | `chore(ci): retry workflow after runner setup failure`          |

El commit `efb942d` integra el commit remoto inicial sin `force push` y conserva ambas historias.

---

## 15. Decisiones técnicas importantes

### Node.js 24 estricto

El proyecto rechaza runtimes fuera de la línea 24 para evitar diferencias entre desarrollo, CI y producción.

### ESM y NodeNext

Prisma 7 utiliza ESM y el proyecto adopta módulos modernos. Los imports internos incluyen extensiones compatibles con el runtime compilado.

### Configuración fail-fast

La aplicación no inicia con configuración inválida. Esto evita fallos tardíos y despliegues parcialmente funcionales.

### Prisma sin modelos de negocio

No se inventaron entidades antes de diseñar e implementar el módulo propietario.

### Health separado

- Liveness verifica proceso.
- Readiness verifica PostgreSQL.

Esto evita reinicios incorrectos cuando una dependencia externa está temporalmente indisponible.

### Migraciones separadas del servidor

El servidor web no ejecuta cambios de esquema de forma oculta. Las migraciones son una tarea de despliegue explícita.

### Swagger configurable

Permanece deshabilitado por defecto en producción y no expone documentación de forma accidental.

### Seguridad de logs

Authorization, cookies, contraseñas y tokens se redactan antes de escribir logs.

### Sin carpetas ni módulos ficticios

Solo se materializaron AUTH y SYSTEM porque pertenecen a la infraestructura de la Etapa 0. Los módulos futuros permanecen documentados, pero no se crearon directorios vacíos.

---

## 16. Elementos no implementados deliberadamente

- PEOPLE.
- EVENTS.
- CONTRACTS.
- PAYMENTS.
- CRM.
- MEDIA.
- GALLERY.
- DELIVERABLES.
- INVITATIONS.
- PRODUCTION funcional.
- CMS funcional.
- AUTOMATION funcional.
- ANALYTICS funcional.
- Registro/login HTTP.
- Persistencia de refresh tokens.
- Roles y permisos persistentes.
- Multitenancy.
- Redis.
- Microservicios.
- Kubernetes.
- Procesamiento FFmpeg.
- Procesamiento de imágenes.
- Proveedor real de Storage.
- Proveedor real de Mail.

Esto mantiene la Etapa 0 dentro del alcance aprobado.

---

## 17. Pendientes para cerrar formalmente la Etapa 0

1. Instalar Docker Desktop o proporcionar un runner con Docker.
2. Ejecutar `docker compose up -d`.
3. Verificar PostgreSQL 17.10.
4. Ejecutar migraciones en la base de pruebas.
5. Ejecutar integration tests.
6. Ejecutar E2E tests.
7. Construir y ejecutar la imagen productiva.
8. Obtener el mensaje administrativo del fallo de preparación de GitHub Actions.
9. Corregir la configuración externa del runner si corresponde.
10. Confirmar una ejecución CI completamente verde.

---

## 18. Próximo módulo recomendado

Según el Roadmap oficial, después de cerrar y aprobar la Etapa 0 debe diseñarse e implementarse **PEOPLE**.

Razones:

- Será propietario de Person y Organization.
- Evitará duplicar identidades en CRM, Contracts y Events.
- Permitirá modelar Participants sin introducir `clientId` en Event.
- Es una dependencia fundacional para CRM, Contracts, Notifications y Client Portal.

No debe iniciarse automáticamente. Requiere aprobación explícita de la Etapa 0 y su propia especificación de dominio.

---

## 19. Estado final

La arquitectura está documentada y publicada. La aplicación de infraestructura compila, pasa lint, typecheck, unit tests, build y validación Prisma. El repositorio oficial contiene commits reales y la rama local está alineada con `origin/main` al cierre de la implementación.

La Etapa 0 está **implementada**, pero su aceptación operativa permanece **pendiente** hasta ejecutar Docker/PostgreSQL y conseguir un pipeline GitHub Actions verde.
