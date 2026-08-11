# Repository Architecture v1

## Arquitectura física oficial de `tecnojack-api`

**Estado:** Propuesta para aprobación  
**Versión:** 1.0  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 10 de agosto de 2026

---

## 1. Propósito y alcance

Este documento define la estructura física oficial del backend de TECNOJACK. Traduce el Platform Blueprint v1, Events Domain Design v2 y la infraestructura aprobada a una organización concreta de carpetas, archivos, dependencias y convenciones.

La estructura debe permitir:

- Navegación rápida por dominio.
- Alta cohesión dentro de cada módulo.
- Bajo acoplamiento entre módulos.
- Ownership visible en el sistema de archivos.
- Crecimiento gradual sin carpetas ceremoniales vacías.
- Integración clara con NestJS, Prisma, Swagger, Docker, CI/CD y Angular.
- Pruebas proporcionales al tipo de comportamiento.
- Documentación profesional y trazable.

Este documento no inicializa NestJS, no crea módulos, no instala dependencias y no implementa código. El árbol descrito es el objetivo que se materializará después de su aprobación.

---

## 2. Decisiones estructurales principales

1. El repositorio contiene inicialmente una sola aplicación NestJS desplegable.
2. Se utiliza la raíz `src/`; no se crean `apps/`, `packages/` ni `libs/` todavía.
3. La organización principal es por módulo de dominio, no por tipo técnico global.
4. Cada módulo protege su dominio, aplicación, infraestructura y presentación.
5. Solo la superficie `public/` de un módulo puede ser importada por otros módulos.
6. `shared/` contiene únicamente conceptos estables y agnósticos del negocio y de frameworks.
7. `platform/` contiene infraestructura técnica reutilizable.
8. No existirán carpetas globales `common/`, `core/`, `utils/`, `helpers/` o `misc/` sin un significado acotado.
9. Prisma tendrá un esquema multiarchivo organizado por ownership de módulo y una sola historia de migraciones.
10. Las carpetas opcionales se crean cuando contienen una responsabilidad real; el estándar no obliga a crear directorios vacíos.

---

## 3. Árbol completo del repositorio

```text
tecnojack-api/
├── .github/
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml
│       ├── security.yml
│       └── release.yml
├── .husky/
│   ├── commit-msg
│   └── pre-commit
├── assets/
│   ├── email/
│   ├── fonts/
│   ├── logos/
│   ├── pdf/
│   └── templates/
├── docker/
│   ├── api/
│   │   └── entrypoint.sh
│   ├── postgres/
│   │   └── init/
│   ├── compose.prod.yml
│   └── README.md
├── docs/
│   ├── README.md
│   ├── architecture/
│   │   ├── platform-blueprint.md
│   │   ├── repository-architecture.md
│   │   └── diagrams/
│   ├── domains/
│   │   ├── events/
│   │   │   └── events-domain-design.md
│   │   └── README.md
│   ├── api/
│   │   ├── conventions.md
│   │   ├── errors.md
│   │   ├── versioning.md
│   │   └── openapi/
│   ├── deployment/
│   │   ├── environments.md
│   │   ├── migrations.md
│   │   └── release-process.md
│   └── runbooks/
│       ├── database-restore.md
│       ├── incident-response.md
│       ├── key-rotation.md
│       └── service-recovery.md
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma
│   │   ├── auth.prisma
│   │   ├── users.prisma
│   │   ├── authorization.prisma
│   │   ├── system.prisma
│   │   ├── people.prisma
│   │   ├── events.prisma
│   │   ├── contracts.prisma
│   │   ├── payments.prisma
│   │   ├── production.prisma
│   │   ├── media.prisma
│   │   ├── gallery.prisma
│   │   ├── deliverables.prisma
│   │   ├── invitations.prisma
│   │   ├── crm.prisma
│   │   ├── cms.prisma
│   │   ├── notifications.prisma
│   │   ├── settings.prisma
│   │   ├── automation.prisma
│   │   └── audit.prisma
│   ├── migrations/
│   ├── seed/
│   │   ├── index.ts
│   │   ├── context.ts
│   │   ├── seeders/
│   │   │   ├── roles.seeder.ts
│   │   │   ├── permissions.seeder.ts
│   │   │   ├── admin.seeder.ts
│   │   │   └── settings.seeder.ts
│   │   ├── factories/
│   │   └── data/
│   └── README.md
├── scripts/
│   ├── database/
│   ├── development/
│   ├── documentation/
│   └── release/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── bootstrap/
│   │   ├── bootstrap-application.ts
│   │   ├── configure-cors.ts
│   │   ├── configure-openapi.ts
│   │   ├── configure-security.ts
│   │   └── configure-validation.ts
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── auth.config.ts
│   │   ├── cors.config.ts
│   │   ├── database.config.ts
│   │   ├── ffmpeg.config.ts
│   │   ├── image.config.ts
│   │   ├── logging.config.ts
│   │   ├── mail.config.ts
│   │   ├── rate-limit.config.ts
│   │   ├── storage.config.ts
│   │   ├── swagger.config.ts
│   │   ├── upload.config.ts
│   │   ├── env.schema.ts
│   │   └── index.ts
│   ├── generated/
│   │   └── prisma/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── system/
│   │   ├── people/
│   │   ├── events/
│   │   ├── contracts/
│   │   ├── payments/
│   │   ├── production/
│   │   ├── media/
│   │   ├── gallery/
│   │   ├── deliverables/
│   │   ├── invitations/
│   │   ├── crm/
│   │   ├── cms/
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── automation/
│   │   ├── analytics/
│   │   └── audit/
│   ├── platform/
│   │   ├── database/
│   │   │   └── prisma/
│   │   ├── http/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── middleware/
│   │   │   └── pipes/
│   │   ├── logging/
│   │   ├── mail/
│   │   ├── media-processing/
│   │   │   ├── ffmpeg/
│   │   │   └── image/
│   │   ├── security/
│   │   └── storage/
│   │       ├── providers/
│   │       └── storage-provider.ts
│   └── shared/
│       ├── application/
│       │   ├── pagination/
│       │   └── result/
│       ├── domain/
│       │   ├── entity/
│       │   ├── errors/
│       │   ├── events/
│       │   └── value-objects/
│       └── types/
├── tests/
│   ├── contracts/
│   ├── e2e/
│   │   ├── modules/
│   │   └── system/
│   ├── integration/
│   │   ├── database/
│   │   ├── modules/
│   │   └── platform/
│   ├── support/
│   │   ├── builders/
│   │   ├── factories/
│   │   ├── fixtures/
│   │   ├── helpers/
│   │   └── setup/
│   └── README.md
├── .dockerignore
├── .editorconfig
├── .env.example
├── .gitignore
├── .nvmrc
├── commitlint.config.ts
├── compose.override.yml
├── compose.test.yml
├── compose.yml
├── Dockerfile
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── prettier.config.mjs
├── prisma.config.ts
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

### 3.1 Lectura del árbol

El árbol muestra el destino de largo plazo. Durante la Etapa 0 solo se materializarán carpetas que contengan archivos reales. No se crearán decenas de directorios vacíos para simular progreso.

Los esquemas Prisma y módulos futuros aparecen para reservar su ownership conceptual, no para autorizar su implementación anticipada.

---

## 4. Responsabilidad de las carpetas raíz

### `.github/`

**Puede contener:** workflows, CODEOWNERS, plantillas de pull request y configuración de actualizaciones automáticas.  
**No puede contener:** scripts de negocio, secretos, lógica de despliegue específica de un proveedor oculta en YAML.  
**Puede depender de:** comandos públicos de `package.json`, Docker y scripts versionados.  
**No debe depender de:** rutas internas accidentales o credenciales comprometidas.

### `.husky/`

**Puede contener:** hooks Git pequeños que delegan en scripts de `package.json`.  
**No puede contener:** lógica compleja, instalaciones o tareas largas.  
Los hooks mejoran la experiencia local; CI continúa siendo la autoridad.

### `assets/`

**Puede contener:** recursos estáticos versionados y compartidos para email, PDF, logos, fuentes y plantillas.  
**No puede contener:** archivos cargados por usuarios, Media Assets, secretos o resultados generados.  
Los módulos consumen estos recursos mediante servicios responsables, no mediante rutas improvisadas.

### `docker/`

**Puede contener:** archivos auxiliares de imágenes, inicialización local, configuración de Compose y documentación de contenedores.  
**No puede contener:** lógica del dominio ni datos persistentes.  
El `Dockerfile` permanece en la raíz para descubrimiento estándar.

### `docs/`

**Puede contener:** especificaciones oficiales, convenciones, diagramas, runbooks y documentación de despliegue.  
**No puede contener:** secretos, documentación generada sin control o versiones contradictorias de una decisión.  
Todos los equipos y experiencias pueden depender conceptualmente de esta documentación.

### `prisma/`

**Puede contener:** definición física del modelo de datos, migraciones y seeders.  
**No puede contener:** reglas de negocio, DTO HTTP o repositorios de aplicación.  
Solo la infraestructura de persistencia y herramientas de base de datos dependen directamente de Prisma.

### `scripts/`

**Puede contener:** automatizaciones operativas explícitas y reutilizables para desarrollo, documentación, base de datos y releases.  
**No puede contener:** lógica requerida por la aplicación en runtime ni scripts destructivos sin validación.  
Cada script tendrá un propósito, documentación y modo no interactivo cuando sea apropiado.

### `src/`

Contiene todo el código ejecutable de la aplicación. No contiene pruebas E2E, migraciones, documentación ni activos de usuario.

### `tests/`

Contiene pruebas que cruzan archivos, capas o procesos: integración, E2E y contratos. También contiene soporte de pruebas. Las pruebas unitarias permanecen junto al código probado.

### Archivos raíz

Se reservan para configuración estándar y puntos de entrada reconocibles. No se colocarán documentos o scripts arbitrarios en la raíz una vez organizada la documentación.

---

## 5. Responsabilidad dentro de `src/`

### `bootstrap/`

Compone el arranque del proceso: validación global, seguridad HTTP, CORS, OpenAPI y ciclo de vida.

- Puede depender de NestJS, `config/`, `platform/` y módulos raíz.
- No contiene reglas de negocio.
- Ningún dominio depende de `bootstrap/`.

### `config/`

Define configuración tipada y validación de variables de entorno.

- Puede importar librerías de validación y tipos técnicos mínimos.
- No puede importar módulos de negocio.
- No crea conexiones ni clientes; describe configuración.
- `index.ts` ensambla y exporta únicamente configuraciones públicas.

### `generated/`

Contiene artefactos generados, inicialmente Prisma Client.

- No se edita manualmente.
- No contiene wrappers ni código propio.
- Se excluye del lint cuando sea necesario y se regenera en instalación/build.
- Solo infraestructura puede importarlo directamente.

### `modules/`

Contiene los bounded contexts y módulos definidos por el Blueprint.

- Cada módulo posee su comportamiento, contratos internos y adaptadores.
- Un módulo no importa detalles internos de otro.
- Las dependencias cruzadas pasan por `public/`.
- No se crean carpetas globales por tipo, como `controllers/` para toda la aplicación.

### `platform/`

Contiene infraestructura técnica transversal y adaptadores reutilizables: Prisma, HTTP, logging, mail, seguridad, procesamiento y storage.

- Puede depender de `config/`, `shared/` y librerías externas.
- No contiene términos o reglas específicos del negocio.
- Los módulos dependen de sus capacidades mediante ports cuando necesiten aislamiento.
- `platform/` no depende de módulos de negocio.

### `shared/`

Contiene primitivas estables que tienen exactamente el mismo significado en varios módulos.

- Puede contener Entity base, DomainEvent base, Result, paginación y tipos muy generales.
- No puede contener Prisma, NestJS, HTTP, JWT, Storage, mail o reglas de Event.
- No puede importar `platform/`, `config/` ni `modules/`.
- Todo elemento nuevo requiere demostrar al menos dos consumidores reales.

---

## 6. Carpetas que no existirán

### `common/`

No se utilizará. Su significado es ambiguo y suele convertirse en un almacén de elementos sin owner.

### `core/`

No se utilizará como carpeta física. En el Blueprint, Core Domain es una clasificación de negocio, no una ubicación técnica.

### `utils/`, `helpers/` o `misc/` globales

No se utilizarán. Una función debe vivir con su módulo o dentro de una carpeta compartida nombrada por su responsabilidad concreta.

### `apps/`, `packages/` o `libs/`

No existirán inicialmente porque solo hay una aplicación desplegable. Si aparece una segunda aplicación real o un paquete publicable, se revisará mediante ADR y podrá migrarse a workspace sin alterar los límites de los módulos.

### `storage/` en la raíz

No se utilizará para datos cargados. El almacenamiento persistente pertenece a servicios o volúmenes externos. La abstracción vive en `src/platform/storage/` y el dominio de Media conserva la semántica.

---

## 7. Estructura interna oficial de un módulo

Ejemplo de módulo rico en dominio:

```text
src/modules/events/
├── events.module.ts
├── public/
│   ├── index.ts
│   ├── events.facade.ts
│   ├── contracts/
│   ├── events/
│   └── read-models/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── events/
│   ├── policies/
│   ├── services/
│   └── errors/
├── application/
│   ├── commands/
│   │   └── create-event/
│   ├── queries/
│   │   └── get-event/
│   ├── services/
│   ├── ports/
│   │   ├── inbound/
│   │   └── outbound/
│   └── mappers/
├── infrastructure/
│   ├── persistence/
│   │   └── prisma/
│   │       ├── repositories/
│   │       └── mappers/
│   └── integrations/
└── presentation/
    └── http/
        ├── controllers/
        ├── dto/
        ├── decorators/
        ├── guards/
        ├── interceptors/
        ├── pipes/
        └── validators/
```

### 7.1 Regla de proporcionalidad

La estructura define ubicaciones oficiales, no carpetas obligatorias. Un módulo sencillo puede comenzar con:

```text
module-name/
├── module-name.module.ts
├── public/
├── application/
└── presentation/
```

Las carpetas `domain/` o `infrastructure/` aparecen cuando existe comportamiento o adaptación real. No se crean archivos vacíos, clases base innecesarias ni interfaces con una única implementación sin una razón de límite.

### 7.2 `public/`

Es la única superficie importable desde otros módulos.

Puede contener:

- Facade de capacidades internas.
- Contratos estables.
- Domain Events publicados para consumidores.
- Read models mínimos.

No puede contener:

- Entidades internas.
- Repositorios.
- Implementaciones.
- DTO HTTP.
- Prisma Client.

### 7.3 `domain/`

Contiene reglas puras del dominio.

- `entities/`: entidades y Aggregate Roots.
- `value-objects/`: conceptos inmutables validados por construcción.
- `events/`: hechos internos producidos por el dominio.
- `policies/`: reglas que combinan información para una decisión.
- `services/`: comportamiento de dominio que no pertenece naturalmente a una entidad.
- `errors/`: errores expresados en lenguaje del dominio.

No depende de NestJS, Prisma, HTTP, configuración ni SDK externos.

### 7.4 `application/`

Orquesta casos de uso.

- `commands/`: solicitudes de cambio y sus handlers.
- `queries/`: solicitudes de lectura y sus handlers.
- `services/`: coordinación reutilizable entre casos de uso del módulo.
- `ports/inbound/`: contratos de entrada cuando una facade o canal los necesita.
- `ports/outbound/`: capacidades externas requeridas, como repositorios o proveedores.
- `mappers/`: traducción entre modelos del dominio y modelos de aplicación/read models.

Puede depender de `domain/`, `shared/` y superficies públicas de otros módulos. No depende de controllers ni de Prisma.

### 7.5 `infrastructure/`

Implementa ports y adaptaciones técnicas.

- Repositorios Prisma.
- Mappers de persistencia.
- Adaptadores de integraciones.
- Suscriptores técnicos.

Puede depender de application, domain, platform, config y Prisma generado. Ningún dominio importa infrastructure.

### 7.6 `presentation/`

Expone el módulo a canales de entrada.

- Controllers HTTP.
- DTOs de request/response.
- Decorators, guards, pipes, validators e interceptors específicos del recurso.
- Documentación Swagger cercana al contrato.

Puede depender de application y public. No accede directamente a Prisma ni implementa reglas de negocio.

---

## 8. Ubicación oficial por tipo de elemento

| Elemento                   | Ubicación                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| Controller                 | `modules/<module>/presentation/http/controllers/`                  |
| DTO HTTP                   | `modules/<module>/presentation/http/dto/`                          |
| Command y handler          | `modules/<module>/application/commands/<use-case>/`                |
| Query y handler            | `modules/<module>/application/queries/<use-case>/`                 |
| Application service        | `modules/<module>/application/services/`                           |
| Domain entity              | `modules/<module>/domain/entities/`                                |
| Value Object               | `modules/<module>/domain/value-objects/`                           |
| Domain service             | `modules/<module>/domain/services/`                                |
| Domain policy              | `modules/<module>/domain/policies/`                                |
| Domain error               | `modules/<module>/domain/errors/`                                  |
| Domain Event interno       | `modules/<module>/domain/events/`                                  |
| Evento público             | `modules/<module>/public/events/`                                  |
| Repository port            | `modules/<module>/application/ports/outbound/`                     |
| Repository Prisma          | `modules/<module>/infrastructure/persistence/prisma/repositories/` |
| Persistence mapper         | `modules/<module>/infrastructure/persistence/prisma/mappers/`      |
| Application mapper         | `modules/<module>/application/mappers/`                            |
| Validator de DTO           | Junto al DTO o en `presentation/http/validators/`                  |
| Regla de dominio           | Entity, Value Object o `domain/policies/`                          |
| Guard específico           | `presentation/http/guards/` del módulo                             |
| Guard global               | `platform/http/guards/` o `platform/security/`                     |
| Decorator específico       | `presentation/http/decorators/` del módulo                         |
| Decorator global           | `platform/http/decorators/`                                        |
| Pipe específico            | `presentation/http/pipes/` del módulo                              |
| Pipe global                | `platform/http/pipes/`                                             |
| Interceptor específico     | `presentation/http/interceptors/`                                  |
| Interceptor global         | `platform/http/interceptors/`                                      |
| Exception filter global    | `platform/http/filters/`                                           |
| Configuración              | `config/`                                                          |
| Adapter técnico compartido | `platform/<capability>/`                                           |
| Tipo realmente universal   | `shared/types/`                                                    |

Una ubicación específica prevalece sobre una carpeta compartida. No se mueve algo a `shared/` solo para acortar imports.

---

## 9. Reglas oficiales de dependencia

### 9.1 Dependencias dentro de un módulo

```text
presentation ──► application ──► domain
                       ▲
infrastructure ────────┘
```

- `domain/` no depende de otras capas del módulo.
- `application/` depende de domain y contracts públicos.
- `infrastructure/` implementa lo requerido por application.
- `presentation/` invoca application.
- El Nest module raíz realiza el wiring.

### 9.2 Dependencias entre módulos

Permitido:

```text
@modules/events/public
```

Prohibido:

```text
@modules/events/domain/entities/...
@modules/events/infrastructure/...
@modules/events/presentation/...
```

### 9.3 Reglas adicionales

1. Ningún módulo importa Prisma generado salvo su infraestructura.
2. Ningún controller importa un repositorio.
3. Ningún DTO HTTP entra al dominio como entidad.
4. Ningún módulo consulta tablas ajenas para evitar una API.
5. Los eventos públicos contienen contratos mínimos y versionables.
6. Las dependencias circulares se consideran un fallo de arquitectura.
7. `forwardRef` no será una solución permanente para ciclos entre módulos.
8. Las reglas se comprobarán progresivamente con ESLint y pruebas arquitectónicas.

---

## 10. Arquitectura Prisma

### 10.1 Esquema multiarchivo

`prisma.config.ts` apuntará a `prisma/schema/`. `schema.prisma` contendrá datasource y generator; los archivos restantes agruparán modelos por módulo propietario.

La separación física no crea bases de datos ni servicios independientes. Hace visible el ownership dentro de un único modelo relacional.

### 10.2 Reglas de esquema

- Un modelo vive en el archivo del módulo propietario.
- Una relación entre módulos se documenta en ambos diseños, pero se declara físicamente una sola vez conforme a Prisma.
- Los nombres de archivo siguen el nombre del módulo, no el nombre de una tabla.
- No existe `shared.prisma`; un modelo siempre tiene owner.
- Los enums de un módulo viven con su owner.
- El output generado se dirige a `src/generated/prisma/`.
- El código generado no se edita ni se exporta desde módulos públicos.

### 10.3 Migraciones

`prisma/migrations/` conserva una historia única, cronológica e inmutable después de aplicarse en entornos compartidos.

- No se separan migraciones por módulo.
- El nombre indica intención, no ticket solamente.
- Una migración destructiva requiere revisión explícita y estrategia de datos.
- Producción usa migraciones aprobadas, nunca sincronización automática de esquema.
- El servidor HTTP no genera migraciones al iniciar.

### 10.4 Seeders

`prisma/seed/index.ts` es el orquestador. Cada seeder es idempotente y tiene un orden declarado.

Orden inicial:

1. Permissions.
2. Roles.
3. Admin.
4. Settings.

`factories/` ayuda a construir datos persistibles para seeders. `data/` contiene catálogos estáticos revisados. Los fixtures de pruebas no viven aquí.

### 10.5 Factories y fixtures

- Factories de seed: `prisma/seed/factories/`.
- Builders de dominio para pruebas: `tests/support/builders/`.
- Factories persistentes de pruebas: `tests/support/factories/`.
- Datos estáticos de prueba: `tests/support/fixtures/`.
- Nunca se importan utilidades de prueba desde producción.

---

## 11. Arquitectura Docker

### `Dockerfile`

Permanece en la raíz y define un build multi-stage reproducible. La imagen final ejecuta el proceso con usuario no privilegiado y contiene únicamente runtime y artefactos necesarios.

### `compose.yml`

Define el entorno local estándar: API, PostgreSQL, red, volumen y health checks.

### `compose.override.yml`

Contiene ajustes automáticos de desarrollo local, como bind mounts o comandos de recarga. No contiene secretos personales.

### `compose.test.yml`

Define servicios aislados para integración y E2E. No reutiliza la base local del desarrollador.

### `docker/compose.prod.yml`

Documenta una composición productiva portable cuando Compose sea el destino. No sustituye la configuración del proveedor de despliegue.

### `docker/api/entrypoint.sh`

Contiene únicamente preparación del proceso. Las migraciones productivas se ejecutan como tarea separada; no se ocultan dentro del arranque web.

### `docker/postgres/init/`

Se reserva para inicialización local imprescindible, por ejemplo extensiones aprobadas. No contiene el esquema de negocio ni migraciones duplicadas.

### Reglas

- No se comprometen volúmenes ni datos de PostgreSQL.
- Desarrollo, pruebas y producción usan configuraciones separadas.
- La misma imagen productiva debe promoverse entre ambientes.
- Las credenciales se inyectan externamente.
- No se instala FFmpeg en la imagen hasta que un caso implementado lo requiera; su ubicación futura ya está definida.

---

## 12. Arquitectura de configuración

Cada archivo de `src/config/` representa una capacidad concreta:

| Archivo                | Responsabilidad                                |
| ---------------------- | ---------------------------------------------- |
| `app.config.ts`        | Puerto, prefijo, entorno y metadatos generales |
| `auth.config.ts`       | JWT HS256 inicial, sesiones y expiraciones     |
| `cors.config.ts`       | Orígenes, métodos y credenciales               |
| `database.config.ts`   | Conexión, pool y timeouts                      |
| `logging.config.ts`    | Nivel, formato y redacción                     |
| `rate-limit.config.ts` | Políticas globales predeterminadas             |
| `swagger.config.ts`    | Activación y metadatos OpenAPI                 |
| `storage.config.ts`    | Provider seleccionado y parámetros no secretos |
| `mail.config.ts`       | Remitente y adapter seleccionado               |
| `upload.config.ts`     | Límites, tipos y expiraciones de carga         |
| `image.config.ts`      | Políticas de procesamiento de imagen           |
| `ffmpeg.config.ts`     | Disponibilidad, rutas y límites de FFmpeg      |
| `env.schema.ts`        | Validación central de variables                |

### Reglas

- Config describe valores; `platform/` crea providers y clientes.
- Ningún módulo lee `process.env` directamente.
- Las variables se validan antes de iniciar la aplicación.
- Secretos no tienen valores predeterminados inseguros.
- `.env.example` documenta todas las variables sin incluir secretos reales.
- SETTINGS administra configuración funcional; `config/` administra configuración de despliegue. No se confunden.

---

## 13. Arquitectura de documentación

### `docs/architecture/`

Contiene el Platform Blueprint, Repository Architecture y diagramas transversales.

El registro ADR canónico permanece en el capítulo **Decisiones arquitectónicas oficiales** del Platform Blueprint, conforme a ADR-016. No se mantienen copias divergentes en archivos separados.

### `docs/domains/`

Cada dominio tiene una carpeta con su especificación oficial, lenguaje, reglas, eventos y relaciones. `events/events-domain-design.md` es la primera.

### `docs/api/`

Contiene convenciones HTTP, errores, versionado y artefactos OpenAPI.

- Los contratos OpenAPI generados se identifican como generados.
- La documentación manual explica decisiones que OpenAPI no expresa.
- Angular consume contratos públicos, no modelos Prisma.

### `docs/deployment/`

Describe ambientes, migraciones y proceso de release.

### `docs/runbooks/`

Contiene procedimientos operativos ejecutables: recuperación, restauración, rotación e incidentes. Cada runbook indica precondiciones, riesgo, verificación y rollback.

### Gobierno documental

- Un documento oficial declara estado y versión.
- Un documento reemplazado conserva referencia al sucesor.
- Las decisiones importantes actualizan automáticamente el Blueprint con un ADR.
- Los diagramas no contradicen texto normativo.
- Los documentos de raíz actuales se moverán a `docs/` durante la implementación aprobada, conservando su contenido e historial.

---

## 14. Arquitectura de pruebas

### 14.1 Pruebas unitarias

Se colocan junto al archivo probado con sufijo `.spec.ts`.

Razones:

- Navegación inmediata.
- Ownership claro.
- Refactors más seguros.
- Evita duplicar todo el árbol en `tests/unit/`.

No usan red, filesystem, PostgreSQL ni Nest application completa.

### 14.2 Pruebas de integración

Viven en `tests/integration/` y usan sufijo `.integration-spec.ts`.

Validan:

- Repositorios Prisma.
- Restricciones reales de PostgreSQL.
- Adaptadores de platform.
- Integración controlada entre módulos.

### 14.3 Pruebas E2E

Viven en `tests/e2e/` y usan sufijo `.e2e-spec.ts`.

Validan la aplicación desde su frontera pública: HTTP, autenticación, autorización, validación, errores, transacciones y health checks.

### 14.4 Pruebas de contrato

Viven en `tests/contracts/` y validan:

- Superficies `public/` entre módulos.
- Eventos publicados.
- OpenAPI y compatibilidad de respuestas.
- Providers sustituibles como StorageProvider.

### 14.5 Soporte de pruebas

- `builders/`: construcción expresiva de entidades y Value Objects.
- `factories/`: persistencia controlada para integración/E2E.
- `fixtures/`: datos estáticos pequeños.
- `helpers/`: solo funciones específicas del entorno de pruebas.
- `setup/`: ciclo de vida de aplicación, base de datos y limpieza.

### Reglas

- Cada prueba crea los datos que necesita.
- No depende del orden de ejecución.
- La base de pruebas es desechable y separada.
- No se comparten objetos mutables entre pruebas.
- Los mocks no sustituyen una integración cuya conducta real sea el objeto de la prueba.
- Los errores de arquitectura se prueban mediante reglas de imports.

---

## 15. Convenciones oficiales de nombres

### 15.1 Carpetas y archivos

- Carpetas: `kebab-case`.
- Archivos TypeScript: `kebab-case` más sufijo de rol.
- Un concepto principal por archivo.
- El nombre del archivo describe el símbolo principal.

| Elemento          | Convención                      | Ejemplo                          |
| ----------------- | ------------------------------- | -------------------------------- |
| Nest module       | `<module>.module.ts`            | `events.module.ts`               |
| Controller        | `<resource>.controller.ts`      | `events.controller.ts`           |
| DTO               | `<action>.dto.ts`               | `create-event.dto.ts`            |
| Command           | `<action>.command.ts`           | `create-event.command.ts`        |
| Command handler   | `<action>.handler.ts`           | `create-event.handler.ts`        |
| Query             | `<action>.query.ts`             | `get-event.query.ts`             |
| Entity            | `<entity>.entity.ts`            | `event.entity.ts`                |
| Value Object      | `<concept>.value-object.ts`     | `event-code.value-object.ts`     |
| Domain Event      | `<fact>.event.ts`               | `event-created.event.ts`         |
| Repository port   | `<entity>.repository.ts`        | `event.repository.ts`            |
| Prisma repository | `prisma-<entity>.repository.ts` | `prisma-event.repository.ts`     |
| Mapper            | `<source>-<target>.mapper.ts`   | `event-persistence.mapper.ts`    |
| Policy            | `<rule>.policy.ts`              | `event-activation.policy.ts`     |
| Guard             | `<purpose>.guard.ts`            | `event-access.guard.ts`          |
| Decorator         | `<purpose>.decorator.ts`        | `current-user.decorator.ts`      |
| Filter            | `<purpose>.filter.ts`           | `global-exception.filter.ts`     |
| Interceptor       | `<purpose>.interceptor.ts`      | `request-context.interceptor.ts` |

### 15.2 Clases e interfaces

- Clases y tipos: `PascalCase`.
- Variables y funciones: `camelCase`.
- Constantes globales reales: `UPPER_SNAKE_CASE`.
- Interfaces no usan prefijo `I`.
- Ports se nombran por capacidad: `EventRepository`, `StorageProvider`, `EventReader`.
- Implementaciones revelan tecnología: `PrismaEventRepository`, `S3StorageProvider`.
- DTOs terminan en `Dto`: `CreateEventDto`.
- Commands terminan en `Command` y Queries en `Query`.
- Domain Events usan pasado: `EventCreated`.
- Application services describen capacidad, no usan nombres vagos como `Manager`.

### 15.3 Idioma

El código y contratos técnicos utilizarán inglés para coincidir con el Ubiquitous Language oficial (`Event`, `EventSession`, `Participant`). La documentación funcional puede estar en español conservando los términos oficiales.

---

## 16. Imports, aliases y barrel files

### Aliases

| Alias          | Destino                                |
| -------------- | -------------------------------------- |
| `@app/*`       | `src/*`                                |
| `@config/*`    | `src/config/*`                         |
| `@modules/*`   | `src/modules/*`                        |
| `@platform/*`  | `src/platform/*`                       |
| `@shared/*`    | `src/shared/*`                         |
| `@generated/*` | `src/generated/*`                      |
| `@test/*`      | `tests/*`, solo configuración de tests |

### Reglas de import

- Imports relativos dentro de la misma feature pequeña.
- Aliases al cruzar áreas principales.
- Otro módulo se importa únicamente mediante `@modules/<name>/public`.
- No se importan archivos generados desde presentation o domain.
- Se evitan rutas relativas profundas.
- El orden de imports será automatizado por ESLint.

### Barrel files

Solo se permiten en:

- `modules/<module>/public/index.ts`.
- `config/index.ts`.
- Directorios pequeños con API pública deliberada.

No se crean barrels recursivos en cada carpeta. Pueden ocultar ciclos, aumentar el acoplamiento y dificultar tree-shaking o navegación.

---

## 17. Integración con Swagger y Angular

- Los DTO HTTP pertenecen a presentation.
- Swagger describe esos DTOs y operaciones públicas.
- Entidades de dominio y modelos Prisma nunca se publican directamente.
- El contrato OpenAPI versionado puede generar clientes o tipos para Angular en un proceso separado.
- Los artefactos generados del frontend no se almacenan dentro de este backend salvo decisión explícita.
- Un cambio incompatible requiere estrategia de versión y documentación.
- Figma usa el lenguaje, estados y permisos documentados; no define reglas de dominio.

---

## 18. Integración con CI/CD

Los workflows delegarán en comandos reproducibles del repositorio:

1. Instalación con lockfile.
2. Validación de formato.
3. ESLint y reglas de arquitectura.
4. Type checking.
5. Validación y formato Prisma.
6. Pruebas unitarias.
7. Pruebas de integración con PostgreSQL aislado.
8. Pruebas E2E.
9. Validación de OpenAPI.
10. Build productivo.
11. Escaneo de dependencias e imagen.

`release.yml` no desplegará automáticamente hasta que exista una estrategia de ambientes aprobada. Los secretos pertenecerán al sistema de CI/CD, nunca al repositorio.

---

## 19. Reglas de crecimiento

### Crear una carpeta compartida

Solo cuando:

- Existen al menos dos consumidores reales.
- El significado es idéntico para ambos.
- No tiene owner natural en un módulo.
- Puede nombrarse por una responsabilidad concreta.

### Crear un nuevo módulo

Requiere:

- Responsabilidad y ownership propios.
- Límite definido en el Blueprint.
- Capacidad pública identificable.
- Razón por la que no pertenece a un módulo existente.
- ADR si cambia la arquitectura transversal.

### Adoptar monorepo

Se reconsiderará si existe:

- Una segunda aplicación desplegable real.
- Una librería consumida por procesos independientes.
- Necesidad de ciclos de release separados.
- Beneficio superior al coste de workspace y tooling.

No se adoptará solo para anticipar un futuro posible.

---

## 20. Riesgos estructurales

| Riesgo                               | Prevención                                                   |
| ------------------------------------ | ------------------------------------------------------------ |
| `shared/` se convierte en misc       | Criterios de admisión y dependencias unidireccionales        |
| Capas vacías y exceso de archivos    | Carpetas opcionales y regla de proporcionalidad              |
| Imports internos entre módulos       | Superficie `public/`, ESLint y pruebas arquitectónicas       |
| Reglas en controllers                | Controllers delgados; comandos y casos de uso en application |
| Dominio acoplado a Prisma            | Mappers y repositorios en infrastructure                     |
| DTO usado como entidad               | Separación entre presentation, application y domain          |
| Migraciones divididas por módulo     | Historia central cronológica                                 |
| Seeders no idempotentes              | Orquestador, orden y upserts controlados                     |
| Documentación duplicada              | Jerarquía documental y ADR canónico en Blueprint             |
| Unit tests difíciles de encontrar    | Co-localización con el código probado                        |
| Monorepo prematuro                   | Una sola aplicación en modo estándar                         |
| Configuración mezclada con providers | `config/` describe; `platform/` instancia                    |

---

## 21. Criterios de conformidad

Una contribución será conforme cuando:

- Coloque el comportamiento en el módulo propietario.
- Respete la dirección de dependencias.
- Importe otros módulos solo desde `public/`.
- No exponga Prisma ni entidades como contratos HTTP.
- No cree una carpeta genérica sin owner.
- Añada pruebas en el nivel apropiado.
- Actualice documentación y OpenAPI cuando cambie contratos.
- Registre en el Blueprint cualquier nueva decisión arquitectónica significativa.
- Preserve el lenguaje oficial de TECNOJACK.

---

## 22. Referencias oficiales

- TECNOJACK Platform Blueprint v1.
- Events Domain Design v2.
- Propuesta de arquitectura e infraestructura aprobada.
- [Prisma Schema: organización en uno o varios archivos](https://docs.prisma.io/docs/orm/prisma-schema/overview).
- [Prisma Config: ubicación de schema y migrations](https://docs.prisma.io/docs/orm/reference/prisma-config-reference).
- [NestJS CLI: modo estándar y evolución posterior a workspace](https://docs.nestjs.com/cli/overview).

---

## 23. Decisión solicitada

La aprobación de Repository Architecture v1 oficializará:

- Aplicación única NestJS en la raíz.
- Organización por módulos de dominio.
- Estructura interna proporcional en cuatro áreas y superficie pública.
- Separación estricta entre `shared/`, `platform/`, `config/` y `modules/`.
- Prisma multiarchivo con migraciones centralizadas.
- Pruebas unitarias co-localizadas e integración/E2E centralizadas.
- Documentación gobernada por Blueprint y ADR.
- Ausencia inicial de monorepo, microservicios y carpetas genéricas.

No se iniciará la implementación de la Etapa 0 hasta recibir esta aprobación.
