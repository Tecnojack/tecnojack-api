# TECNOJACK API

## Propuesta de arquitectura e infraestructura

**Estado:** Pendiente de aprobación  
**Alcance actual:** Diseño técnico, sin implementación  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Fecha de análisis:** 10 de agosto de 2026

---

## 1. Contexto

TECNOJACK API será el backend de una plataforma SaaS para una empresa audiovisual. No se plantea como el backend de una página web aislada, sino como la base técnica de una plataforma empresarial que deberá crecer durante los próximos diez años.

El frontend ya existe y está construido con Angular. Queda expresamente fuera del alcance de esta fase y no será modificado.

El repositorio remoto fue inspeccionado antes de plantear la arquitectura. Actualmente está vacío, declara `main` como rama predeterminada y no existe todavía un checkout Git dentro del workspace local. Por tanto, no hay código previo que conservar ni decisiones heredadas que condicionen la arquitectura inicial.

---

## 2. Objetivo de la primera fase

Construir una base empresarial moderna, segura, mantenible y preparada para incorporar posteriormente los módulos del negocio audiovisual.

Esta primera fase incluirá exclusivamente infraestructura técnica y capacidades transversales:

- Aplicación NestJS y TypeScript.
- PostgreSQL y Prisma ORM.
- Configuración por variables de entorno.
- Autenticación JWT y refresh tokens.
- Seguridad HTTP.
- Validación global.
- Manejo global de errores.
- Logging estructurado.
- Rate limiting.
- Health checks.
- Swagger/OpenAPI.
- Docker y Docker Compose.
- Calidad de código y automatización.
- Pruebas base e integración continua.

No se implementarán todavía módulos como clientes, producciones, proyectos, inventario, equipos, contratos, facturación, agenda, proveedores, talento o cualquier otro proceso propio del negocio audiovisual.

---

## 3. Stack tecnológico

### 3.1 Tecnologías obligatorias

| Componente    | Tecnología propuesta              | Propósito                                  |
| ------------- | --------------------------------- | ------------------------------------------ |
| Runtime       | Node.js 24 LTS                    | Ejecución estable y con soporte prolongado |
| Framework     | NestJS 11, última versión estable | API modular y empresarial                  |
| Lenguaje      | TypeScript en modo estricto       | Seguridad de tipos y mantenibilidad        |
| Base de datos | PostgreSQL 18                     | Persistencia relacional robusta            |
| ORM           | Prisma ORM 7                      | Acceso tipado, migraciones y modelado      |
| API           | REST versionada                   | Contrato HTTP predecible                   |
| Documentación | Swagger/OpenAPI                   | Descubrimiento y prueba del API            |
| Autenticación | JWT + refresh tokens rotatorios   | Sesiones seguras                           |
| Contenedores  | Docker + Docker Compose           | Entornos reproducibles                     |
| Calidad       | ESLint + Prettier                 | Estándares automáticos de código           |
| Hooks Git     | Husky + lint-staged + commitlint  | Validación antes de confirmar cambios      |
| Pruebas       | Jest + Supertest                  | Pruebas unitarias, integración y E2E       |

### 3.2 Versiones recomendadas

Se recomienda usar Node.js 24 LTS en producción, no Node.js 26 mientras permanezca en estado `Current`. Las aplicaciones productivas deben ejecutarse sobre versiones LTS.

NestJS 11 requiere Node.js 20 o superior y recomienda la última versión LTS. Prisma ORM 7 exige ESM para sus integraciones modernas, requiere un adaptador de base de datos para conexiones directas y soporta Node.js 24.

Las versiones menores y de parche exactas se resolverán al iniciar la implementación y quedarán fijadas en el lockfile para garantizar builds reproducibles.

---

## 4. Enfoque arquitectónico

### 4.1 Monolito modular

Se recomienda comenzar con un monolito modular con límites internos estrictos.

Esto ofrece:

- Menor complejidad operativa que una arquitectura de microservicios.
- Transacciones locales y consistentes.
- Desarrollo, pruebas y despliegue más sencillos.
- Menor coste de infraestructura.
- Capacidad de separar módulos en servicios independientes en el futuro.
- Límites claros entre dominios desde el primer día.

No se recomienda comenzar con microservicios sin necesidades verificadas de escalabilidad, aislamiento operativo o equipos independientes. La modularidad permitirá evolucionar hacia ellos cuando exista una razón concreta.

### 4.2 Flujo de dependencias

```text
Petición HTTP
    │
    ▼
Controller + DTO validation
    │
    ▼
Application service / use case
    │
    ▼
Domain contracts
    │
    ▼
Infrastructure adapters
    │
    ▼
Prisma ORM + PostgreSQL
```

Las capas internas no deben depender de detalles HTTP ni de Prisma. Los módulos podrán exponer contratos y mantener encapsuladas sus reglas.

### 4.3 Principios

- Separación de responsabilidades.
- Alta cohesión y bajo acoplamiento.
- Inversión de dependencias donde aporte valor real.
- Configuración explícita.
- Seguridad por defecto.
- Observabilidad desde el inicio.
- Migraciones reproducibles.
- Contratos API estables y versionados.
- Pruebas proporcionales al riesgo.
- Ausencia de abstracciones prematuras.

---

## 5. Estructura propuesta

```text
tecnojack-api/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   ├── commit-msg
│   └── pre-commit
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── common/
│   │   ├── constants/
│   │   ├── decorators/
│   │   ├── exceptions/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   ├── types/
│   │   └── utils/
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── auth.config.ts
│   │   ├── database.config.ts
│   │   ├── env.validation.ts
│   │   └── swagger.config.ts
│   ├── infrastructure/
│   │   ├── database/
│   │   │   └── prisma/
│   │   ├── health/
│   │   ├── logging/
│   │   └── security/
│   ├── modules/
│   │   └── auth/
│   │       ├── application/
│   │       ├── domain/
│   │       ├── infrastructure/
│   │       └── presentation/
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── e2e/
│   ├── integration/
│   └── unit/
├── .dockerignore
├── .editorconfig
├── .env.example
├── .gitignore
├── .nvmrc
├── commitlint.config.*
├── compose.yml
├── Dockerfile
├── eslint.config.*
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── prettier.config.*
├── prisma.config.ts
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

Los módulos futuros seguirán la misma estructura vertical. Cada módulo será dueño de su lógica, contratos, persistencia y endpoints.

---

## 6. API HTTP

### 6.1 Versionado

La API se publicará inicialmente bajo:

```text
/api/v1
```

El versionado permitirá evolucionar contratos públicos sin romper inmediatamente a los consumidores existentes.

### 6.2 Convenciones

- JSON como formato principal.
- Fechas y horas en ISO 8601 y UTC.
- Identificadores opacos.
- Códigos HTTP semánticamente correctos.
- Paginación consistente para colecciones futuras.
- Parámetros de ordenamiento y filtros normalizados.
- Idempotencia en operaciones sensibles cuando corresponda.
- OpenAPI como contrato documentado.

### 6.3 Errores

Los errores seguirán una estructura compatible con RFC 9457 Problem Details:

```json
{
  "type": "https://api.tecnojack.com/problems/validation-error",
  "title": "Validation failed",
  "status": 400,
  "detail": "One or more fields are invalid",
  "instance": "/api/v1/example",
  "requestId": "0198...",
  "errors": [
    {
      "field": "email",
      "message": "email must be valid"
    }
  ]
}
```

No se devolverán stack traces, detalles internos de Prisma, SQL ni secretos al cliente.

---

## 7. Configuración y variables de entorno

La configuración será centralizada, tipada y validada durante el arranque. La aplicación fallará de forma inmediata y explícita si falta una variable obligatoria o tiene un formato inválido.

Categorías previstas:

```text
NODE_ENV
PORT
API_PREFIX
API_VERSION
DATABASE_URL
JWT_PRIVATE_KEY
JWT_PUBLIC_KEY
JWT_ACCESS_TTL
REFRESH_TOKEN_TTL
CORS_ORIGINS
LOG_LEVEL
SWAGGER_ENABLED
RATE_LIMIT_TTL
RATE_LIMIT_LIMIT
```

El archivo `.env.example` documentará nombres y ejemplos no sensibles. Ningún secreto real se incluirá en Git.

Para producción, las claves y credenciales deberán proceder del sistema de secretos de la plataforma de despliegue, no de archivos `.env` almacenados en el servidor.

---

## 8. Base de datos y Prisma

### 8.1 Prisma ORM 7

La integración empleará:

- ESM.
- Generador `prisma-client`.
- Directorio de salida explícito.
- Adaptador `@prisma/adapter-pg`.
- Servicio Prisma administrado por NestJS.
- Conexión y desconexión controladas durante el ciclo de vida.
- Migraciones versionadas con Prisma Migrate.

### 8.2 Migraciones

- En desarrollo se crearán migraciones mediante comandos explícitos.
- En producción se usará `prisma migrate deploy`.
- El servidor no generará migraciones automáticamente.
- La aplicación no alterará el esquema de manera implícita al arrancar.
- La ejecución de migraciones será una tarea separada dentro del proceso de despliegue.
- Las migraciones destructivas deberán revisarse antes de su aplicación.

### 8.3 Convenciones de datos

- Nombres consistentes para tablas, columnas, índices y restricciones.
- Fechas de creación y actualización donde proceda.
- Índices definidos según patrones reales de consulta.
- Restricciones de unicidad y claves foráneas aplicadas en PostgreSQL.
- Eliminación lógica únicamente cuando exista una necesidad del dominio.
- Transacciones explícitas para operaciones atómicas.
- Sin consultas SQL sin parametrizar.

---

## 9. Autenticación y sesiones

La autenticación se considera infraestructura transversal de la plataforma, no un módulo del negocio audiovisual.

### 9.1 Access tokens

- JWT de corta duración.
- Duración inicial sugerida: 15 minutos.
- Firma asimétrica con clave privada y verificación mediante clave pública.
- Claims mínimos y documentados.
- Inclusión de identificador de token y sujeto.
- No se almacenarán datos sensibles dentro del JWT.

La firma asimétrica permite que futuros servicios verifiquen tokens sin recibir la clave privada usada para firmarlos.

### 9.2 Refresh tokens

Se recomienda que el refresh token sea opaco y criptográficamente aleatorio, en lugar de otro JWT de larga duración.

- Solo se almacenará su hash en PostgreSQL.
- Rotación obligatoria en cada renovación.
- Expiración configurable.
- Revocación individual por sesión.
- Revocación global por usuario.
- Registro de dispositivo, IP y user-agent cuando estén disponibles.
- Asociación a una familia de tokens.
- Detección de reutilización de tokens ya rotados.
- Revocación de la familia si se detecta posible robo.

### 9.3 Contraseñas

- Hash mediante Argon2id.
- Nunca se almacenarán contraseñas en texto plano.
- Parámetros configurados con un coste razonable para el entorno productivo.
- Comparación segura.
- Contraseñas y hashes excluidos de logs y respuestas.

### 9.4 Alcance inicial del módulo de autenticación

La infraestructura podrá contemplar:

- Inicio de sesión.
- Renovación de sesión.
- Cierre de una sesión.
- Cierre de todas las sesiones.
- Consulta del usuario autenticado.
- Guards y decoradores de autenticación.
- Base para roles y permisos futuros.

No se implementarán todavía registro público, recuperación de contraseña, proveedores sociales, MFA ni reglas de negocio de usuarios salvo aprobación adicional.

---

## 10. Seguridad

La configuración inicial incluirá:

- Helmet para cabeceras HTTP seguras.
- CORS configurable mediante variables de entorno.
- Lista explícita de orígenes permitidos.
- Validación y transformación global de entradas.
- Eliminación o rechazo de propiedades no declaradas.
- Límites configurables del tamaño de solicitudes.
- Rate limiting global.
- Límites más estrictos para endpoints de autenticación.
- No exposición de stack traces en producción.
- Redacción de secretos y datos sensibles en logs.
- Contenedor ejecutado con usuario no privilegiado.
- Dependencias bloqueadas mediante lockfile.
- Auditoría automática de dependencias en CI.
- Swagger desactivado por defecto en producción o protegido de forma explícita.

La autorización de negocio se diseñará al introducir los dominios correspondientes. No se asumirán prematuramente roles fijos que puedan resultar incorrectos.

---

## 11. Validación global

NestJS utilizará un `ValidationPipe` global con una política equivalente a:

- Transformación de tipos habilitada.
- Eliminación de propiedades desconocidas.
- Rechazo de propiedades no permitidas.
- Validación de DTO completos.
- Mensajes de error normalizados.
- DTO independientes de los modelos Prisma.

Los objetos de transporte HTTP no se utilizarán directamente como modelos de persistencia. Esto evita acoplar el contrato externo al esquema de base de datos.

---

## 12. Manejo global de errores

Se implementará un filtro global responsable de:

- Normalizar excepciones HTTP.
- Convertir errores conocidos de Prisma a códigos HTTP apropiados.
- Gestionar errores de validación.
- Generar un `requestId` rastreable.
- Registrar errores internos con su contexto.
- Ocultar información sensible al consumidor.
- Mantener una respuesta homogénea.

Los errores esperados del dominio se expresarán mediante excepciones propias y no dependerán directamente de excepciones HTTP dentro de las capas internas.

---

## 13. Logging y observabilidad

Se recomienda Pino por su rendimiento y salida JSON estructurada.

Cada registro debería poder incluir:

- Timestamp.
- Nivel.
- Entorno.
- Nombre del servicio.
- Versión de la aplicación.
- Request ID o correlation ID.
- Método HTTP.
- Ruta.
- Código de respuesta.
- Duración.
- Identificador de usuario cuando sea seguro.
- Información del error interno.

Se ocultarán expresamente:

- Cabecera `Authorization`.
- Cookies.
- Contraseñas.
- Access tokens.
- Refresh tokens.
- Claves privadas.
- Secretos y cadenas de conexión.

La estructura quedará preparada para integrarse posteriormente con OpenTelemetry, una plataforma APM o un agregador central de logs sin acoplar la aplicación a un proveedor específico.

---

## 14. Rate limiting

Se aplicará una política global configurable y reglas específicas para rutas sensibles.

Ejemplo conceptual:

| Tipo de ruta     | Política inicial                |
| ---------------- | ------------------------------- |
| API general      | Límite moderado por IP          |
| Inicio de sesión | Límite estricto por IP y cuenta |
| Renovación       | Límite estricto por sesión/IP   |
| Health checks    | Política diferenciada           |

Los valores exactos serán variables de entorno. Si la aplicación escala horizontalmente, el almacenamiento del rate limiter deberá migrarse desde memoria a un almacén compartido, normalmente Redis.

Redis no se incluirá inicialmente si no es necesario, pero la abstracción debe permitir incorporarlo sin cambiar los controladores.

---

## 15. Health checks

Se expondrán dos comprobaciones diferenciadas:

```text
GET /health/live
GET /health/ready
```

### Liveness

Indica si el proceso está activo. No debe depender de todos los servicios externos para evitar reinicios innecesarios.

### Readiness

Indica si la instancia puede recibir tráfico e incluirá al menos una comprobación real de PostgreSQL.

Estas rutas serán compatibles con Docker y con futuros orquestadores como Kubernetes.

---

## 16. Swagger y OpenAPI

La documentación incluirá:

- Título y descripción del servicio.
- Versión del API.
- Esquema Bearer JWT.
- DTO de solicitudes y respuestas.
- Respuestas de error comunes.
- Agrupación por módulos.
- Ejemplos seguros.
- Endpoint configurable, por ejemplo `/docs`.
- Documento OpenAPI serializable para automatización futura.

Swagger se habilitará por configuración. En producción estará desactivado por defecto salvo que se decida protegerlo y publicarlo de manera consciente.

---

## 17. CORS

CORS no quedará abierto mediante `*` cuando se utilicen credenciales.

La configuración admitirá:

- Uno o varios orígenes permitidos.
- Métodos autorizados.
- Cabeceras permitidas y expuestas.
- Credenciales configurables.
- Comportamiento diferente por entorno.

La URL del frontend Angular se proporcionará mediante variables de entorno y no quedará codificada en el código fuente.

---

## 18. Docker

### 18.1 Imagen de la aplicación

El `Dockerfile` será multi-stage:

1. Instalación reproducible de dependencias.
2. Generación de Prisma Client.
3. Compilación de TypeScript.
4. Instalación o copia exclusiva de artefactos necesarios para producción.
5. Ejecución con usuario sin privilegios.

La imagen final no incluirá herramientas de desarrollo innecesarias.

### 18.2 Docker Compose

El entorno local contendrá al menos:

- Servicio `api`.
- Servicio `postgres`.
- Volumen persistente para PostgreSQL.
- Red interna.
- Health checks.
- Dependencias condicionadas por salud cuando sean aplicables.

Las credenciales locales estarán documentadas como valores de desarrollo y no se reutilizarán en producción.

### 18.3 Migraciones

Las migraciones se ejecutarán mediante un comando o tarea separada. El proceso web no deberá intentar crear migraciones ni modificar el esquema automáticamente.

---

## 19. Calidad de código

### ESLint

- Configuración moderna flat config.
- Reglas compatibles con TypeScript.
- Detección de promesas no manejadas.
- Prevención de imports inconsistentes.
- Reglas de seguridad y mantenibilidad razonables.

### Prettier

- Formato único para TypeScript, JSON, Markdown y archivos relacionados.
- Integración con ESLint sin reglas duplicadas.

### Husky y lint-staged

El hook `pre-commit` ejecutará comprobaciones rápidas solo sobre archivos preparados para commit.

El hook `commit-msg` validará Conventional Commits mediante commitlint.

Las comprobaciones completas seguirán ejecutándose en CI; los hooks locales no serán la única barrera de calidad.

---

## 20. Pruebas

La infraestructura incluirá tres niveles:

### Unitarias

- Servicios y utilidades aislados.
- Sin dependencia real de PostgreSQL.
- Ejecución rápida.

### Integración

- Repositorios Prisma.
- Restricciones y transacciones reales.
- PostgreSQL de pruebas aislado.

### End-to-end

- Arranque de la aplicación completa.
- Peticiones HTTP reales.
- Validación de autenticación, errores, health checks y seguridad básica.

Se evitará abusar de mocks para comportamientos que dependen realmente de PostgreSQL.

---

## 21. Integración continua

GitHub Actions ejecutará en cada pull request:

1. Instalación reproducible.
2. Validación de formato.
3. ESLint.
4. Comprobación de tipos.
5. Validación del esquema Prisma.
6. Pruebas unitarias.
7. Pruebas de integración/E2E con PostgreSQL de servicio.
8. Build productivo.
9. Reporte de cobertura.
10. Auditoría de dependencias según la política acordada.

Las actualizaciones automáticas de dependencias podrán gestionarse mediante Dependabot o Renovate, agrupando cambios para evitar ruido excesivo.

---

## 22. Preparación para SaaS y multitenancy

No se recomienda implementar todavía un modelo multitenant sin conocer las reglas reales de la plataforma.

Las alternativas posibles son:

| Estrategia                         | Ventajas                        | Costes                                      |
| ---------------------------------- | ------------------------------- | ------------------------------------------- |
| Tablas compartidas con `tenant_id` | Eficiencia y operación sencilla | Requiere disciplina estricta de aislamiento |
| Esquema por tenant                 | Mayor separación lógica         | Migraciones y operación más complejas       |
| Base de datos por tenant           | Máximo aislamiento              | Mayor coste y complejidad operativa         |

La arquitectura modular dejará un punto de extensión para resolver el contexto de tenant, pero no se creará una abstracción ficticia antes de definir:

- Si un usuario puede pertenecer a varias organizaciones.
- Cómo se facturan las organizaciones.
- Qué recursos pertenecen al tenant.
- Qué usuarios administrativos existen.
- Qué nivel de aislamiento contractual o legal se necesita.
- Qué volumen y patrones de acceso se esperan.

La decisión deberá tomarse al diseñar el primer módulo de negocio.

---

## 23. Escalabilidad a largo plazo

La arquitectura quedará preparada para evolucionar en las siguientes direcciones:

- Réplicas horizontales sin estado local de sesión.
- Redis para rate limiting, caché o coordinación distribuida.
- Colas de trabajo para procesamiento audiovisual y tareas extensas.
- Almacenamiento de objetos para medios y archivos.
- CDN para distribución de contenido.
- Outbox transaccional para publicación confiable de eventos.
- OpenTelemetry para trazas y métricas.
- Separación de módulos en servicios cuando exista una necesidad comprobada.
- Read replicas de PostgreSQL cuando los patrones de consulta lo justifiquen.

Estas capacidades no se implementarán en la primera fase si no son necesarias. La meta es habilitar su incorporación posterior, no pagar desde ahora su coste operativo.

---

## 24. Decisiones que se evitan deliberadamente

- No comenzar con microservicios.
- No introducir Kubernetes en el desarrollo inicial.
- No añadir Redis sin un caso de uso actual.
- No crear un bus de eventos antes de necesitar integración asíncrona.
- No definir módulos audiovisuales ficticios.
- No implementar multitenancy sin reglas verificadas.
- No acoplar el dominio a NestJS, Prisma o HTTP innecesariamente.
- No usar modelos Prisma como DTO públicos.
- No ejecutar cambios automáticos de esquema al arrancar producción.
- No almacenar refresh tokens en texto plano.
- No exponer Swagger ni errores internos indiscriminadamente.

---

## 25. Entregables de la implementación

Una vez aprobada esta propuesta, la primera entrega contendrá:

1. Repositorio NestJS completo y compilable.
2. Configuración ESM y TypeScript estricto.
3. PostgreSQL y Prisma ORM 7.
4. Migración inicial de infraestructura de identidad y sesiones.
5. Configuración tipada y validada.
6. Autenticación JWT y refresh tokens rotatorios.
7. Validación global.
8. Filtro global de errores.
9. Logging estructurado y request IDs.
10. Helmet, CORS y rate limiting.
11. Liveness y readiness.
12. Swagger/OpenAPI configurable.
13. Dockerfile productivo.
14. Docker Compose para desarrollo.
15. ESLint, Prettier, Husky, lint-staged y commitlint.
16. Pruebas unitarias, integración y E2E base.
17. GitHub Actions.
18. `.env.example` sin secretos.
19. README operativo.
20. Documentación de comandos, migraciones y decisiones técnicas.

No se modificará ni incorporará el frontend Angular.

---

## 26. Criterios de aceptación

La infraestructura se considerará completa cuando:

- El proyecto compile sin errores.
- ESLint y Prettier finalicen correctamente.
- Todas las pruebas pasen.
- Docker Compose permita levantar API y PostgreSQL.
- Las migraciones puedan aplicarse desde una base vacía.
- Los health checks reflejen correctamente el estado del servicio.
- Swagger documente los endpoints disponibles.
- El login, renovación y revocación de sesiones funcionen de extremo a extremo.
- Los refresh tokens se almacenen exclusivamente como hashes.
- Los errores tengan un formato consistente.
- Los logs no revelen secretos.
- CORS pueda configurarse sin modificar código.
- El rate limiting pueda verificarse mediante pruebas.
- La imagen productiva se ejecute sin privilegios.
- El pipeline CI valide automáticamente el proyecto.
- El README permita a otro desarrollador ejecutar el sistema desde cero.

---

## 27. Decisión solicitada

Se solicita aprobación para implementar la infraestructura con las siguientes decisiones principales:

1. Monolito modular como arquitectura inicial.
2. Node.js 24 LTS.
3. NestJS 11 en su última versión estable.
4. Prisma ORM 7 con ESM y adaptador PostgreSQL.
5. PostgreSQL 18.
6. pnpm y Corepack.
7. REST bajo `/api/v1`.
8. JWT asimétrico para access tokens.
9. Refresh tokens opacos, rotatorios y almacenados como hash.
10. Pino para logging estructurado.
11. RFC 9457 como formato base de errores.
12. GitHub Actions para integración continua.
13. Sin módulos de negocio ni multitenancy en esta fase.

La implementación no comenzará hasta recibir esta aprobación.

---

## 28. Referencias oficiales

- [Node.js Releases](https://nodejs.org/en/about/previous-releases)
- [NestJS Migration Guide](https://docs.nestjs.com/migration-guide)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma ORM Documentation](https://docs.prisma.io/docs/orm)
- [Prisma ORM System Requirements](https://docs.prisma.io/docs/orm/reference/system-requirements)
- [Prisma ORM v7 Upgrade Guide](https://docs.prisma.io/docs/orm/v6/more/upgrades/to-v7)
- [Databases Supported by Prisma ORM](https://docs.prisma.io/docs/orm/reference/supported-databases)
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
