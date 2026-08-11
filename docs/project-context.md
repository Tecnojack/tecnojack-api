# Contexto maestro del proyecto TECNOJACK

**Tipo de documento:** contexto integral de producto, dominio, arquitectura e implementación  
**Proyecto:** TECNOJACK API  
**Repositorio oficial:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Fecha de revisión:** 11 de agosto de 2026  
**Estado:** documento de orientación derivado de las especificaciones oficiales y del repositorio actual  
**Autoridad:** informativo; no reemplaza el Platform Blueprint, los ADR ni las especificaciones de dominio

---

## 1. Propósito

Este documento permite comprender TECNOJACK sin reconstruir su historia a partir de conversaciones, commits o archivos aislados. Consolida:

- La visión del producto y el problema empresarial.
- El lenguaje ubicuo y los límites de dominio.
- Las decisiones arquitectónicas oficiales.
- La arquitectura técnica y física del repositorio.
- El estado observable de la implementación.
- Los contratos HTTP y de persistencia existentes.
- Las reglas que cualquier implementación futura debe respetar.
- Los riesgos, diferencias y pendientes detectados durante la revisión.

Debe utilizarse como primer punto de lectura para incorporar personas o agentes al proyecto. Cuando se necesite precisión normativa, siempre se debe acudir al documento oficial correspondiente.

---

## 2. Cómo interpretar este documento

### 2.1 Categorías de certeza

La información se clasifica implícitamente en tres niveles:

1. **Oficial:** aprobada en el Platform Blueprint, un ADR o una especificación de dominio.
2. **Implementada:** confirmada mediante inspección del código, Prisma, configuración o historial Git.
3. **En desarrollo local:** visible en el árbol de trabajo, pero aún no consolidada en un commit del repositorio.

La existencia de código no convierte por sí sola una decisión en arquitectura oficial. De igual manera, una capacidad descrita en el Blueprint no debe considerarse implementada hasta verificarla en código y pruebas.

### 2.2 Jerarquía documental oficial

En caso de contradicción se aplica este orden:

1. ADR aceptado más reciente del capítulo **Decisiones arquitectónicas oficiales** del Platform Blueprint.
2. Platform Blueprint para límites, ownership e integración entre dominios.
3. Especificación oficial del dominio para su diseño interno.
4. Contrato API público versionado.
5. Código y esquema de persistencia.
6. Este documento de contexto y los informes históricos.

Una contradicción no debe resolverse silenciosamente desde el código. Debe documentarse y, si modifica una decisión importante, producir un nuevo ADR.

### 2.3 Documentos canónicos revisados

| Documento                                                                  | Función                                 | Estado declarado                                                                                |
| -------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `docs/architecture/platform-blueprint.md`                                  | Constitución arquitectónica y funcional | Especificación oficial inicial                                                                  |
| `docs/architecture/repository-architecture.md`                             | Arquitectura física del repositorio     | Propuesta para aprobación, aunque referenciada como oficial en el cierre arquitectónico         |
| `docs/architecture/infrastructure-proposal.md`                             | Fundamentos técnicos e infraestructura  | Pendiente de aprobación en su encabezado, aunque la infraestructura fue aprobada posteriormente |
| `docs/domains/events/events-domain-design.md`                              | Diseño exhaustivo de EVENTS             | Aprobado como especificación oficial                                                            |
| `docs/domains/people/people-domain-design.md`                              | Diseño de PEOPLE                        | Aprobado                                                                                        |
| `docs/domains/media/media-domain-design.md`                                | Diseño de MEDIA                         | Aprobado                                                                                        |
| Diseños de GALLERY, DELIVERABLES, CONTRACTS, PAYMENTS, CRM y CLIENT PORTAL | Límites y lenguaje de cada dominio      | Aprobados como especificaciones oficiales                                                       |
| `docs/reports/stage-0-implementation-report.md`                            | Evidencia histórica de la Etapa 0       | Informe, no norma arquitectónica                                                                |

> Observación documental: algunos encabezados conservan estados anteriores a las aprobaciones posteriores. Esto no invalida el contenido aprobado, pero conviene normalizar esos metadatos en una futura tarea documental controlada.

---

## 3. Identidad y visión del producto

TECNOJACK es la plataforma operativa central de una empresa audiovisual. No es simplemente el backend de una página web ni una API auxiliar del frontend Angular.

La plataforma debe coordinar durante los próximos años:

- Bodas.
- Quince años.
- Grados.
- Eventos corporativos.
- Fotografía.
- Video.
- Videos musicales.
- Producción audiovisual.
- Contenido para redes sociales.
- Sesiones de fotos.
- Personas, organizaciones, clientes y colaboradores.
- Contratos, pagos y actividad comercial.
- Producción, medios, galerías y entregables.
- Experiencias internas y externas con distintos niveles de acceso.

### 3.1 Resultado empresarial esperado

TECNOJACK debe convertirse en una fuente de verdad operativa que conecte el ciclo completo:

`interés comercial → identidad → Event → contrato → pago → producción → Media → Gallery → Deliverable → experiencia del cliente`

Cada etapa conserva su propio lenguaje, reglas y datos. Event coordina el expediente, pero no absorbe los otros dominios.

### 3.2 Objetivos del sistema

- Centralizar la operación audiovisual alrededor de Event.
- Mantener un único propietario para cada tipo de información.
- Evitar duplicación de identidades y estados.
- Coordinar los ciclos comercial, contractual, financiero, productivo y de entrega.
- Proteger información personal, contractual, financiera y audiovisual.
- Proporcionar historial, auditoría y trazabilidad.
- Automatizar procesos únicamente mediante capacidades públicas autorizadas.
- Permitir crecimiento modular sin asumir prematuramente microservicios.
- Mantener contratos estables para Angular, otras interfaces y automatizaciones.

---

## 4. Principios arquitectónicos innegociables

### 4.1 Event-first

Event es el Aggregate Root principal del negocio audiovisual y la referencia central de los módulos relacionados. Esto no significa que sea una entidad gigante.

### 4.2 Ownership único

Cada dato tiene un solo módulo propietario. Ningún módulo puede escribir directamente tablas de otro módulo ni replicar una fuente de verdad sin una proyección explícita.

### 4.3 Monolito modular

La plataforma comienza como una única aplicación NestJS desplegable. Los límites entre módulos son reales y deben poder evolucionar sin introducir dependencias laterales.

### 4.4 Dependencias dirigidas

Las dependencias apuntan a contratos públicos o capacidades fundacionales. No se permite acceder a repositorios, entidades internas o tablas de otro módulo.

### 4.5 Integración explícita

La comunicación entre módulos utiliza uno de estos mecanismos:

- Fachada o API pública del módulo propietario.
- Evento de dominio versionado.
- Proyección de lectura autorizada.

### 4.6 Seguridad por propósito y alcance

Un rol global no basta. La autorización debe combinar permiso, alcance y las invariantes del recurso propietario.

### 4.7 Historial antes que edición silenciosa

Las transiciones importantes deben ser explícitas, auditables e idempotentes cuando corresponda.

### 4.8 Proyecciones no propietarias

Timeline, Analytics, dashboards y Client Portal presentan datos derivados; nunca sustituyen la fuente operacional.

### 4.9 Evolución pragmática

No se introducen microservicios, Kubernetes, brokers, motores genéricos de workflow ni abstracciones especulativas sin evidencia operativa.

### 4.10 Contratos estables

Angular y otros consumidores dependen de contratos HTTP/OpenAPI, no del modelo Prisma ni de entidades internas.

---

## 5. Lenguaje ubicuo esencial

| Término        | Significado oficial                                                                |
| -------------- | ---------------------------------------------------------------------------------- |
| Event          | Expediente central de un proyecto audiovisual y Aggregate Root principal           |
| Event Type     | Clasificación y plantilla versionada para inicializar Events                       |
| Event Session  | Etapa temporal importante dentro de un Event                                       |
| Person         | Individuo cuya identidad pertenece a PEOPLE                                        |
| Organization   | Entidad colectiva cuya identidad pertenece a PEOPLE                                |
| Participant    | Person u Organization relacionada con un Event mediante roles contextuales         |
| Client         | Rol comercial contextual; no es una entidad raíz universal ni propietario de Event |
| Opportunity    | Posibilidad comercial calificada administrada por CRM                              |
| Contract       | Acuerdo formal sobre alcance, derechos, obligaciones y aceptación                  |
| Payment        | Obligación o movimiento financiero asociado a Event o Contract                     |
| Media Asset    | Archivo audiovisual individual y metadatos administrados por MEDIA                 |
| Storage Object | Representación técnica de bytes administrada mediante STORAGE                      |
| Gallery        | Colección curada de referencias a Media Assets                                     |
| Deliverable    | Resultado comprometido, preparado, aprobado o entregado para un Event              |
| Timeline       | Proyección cronológica derivada de hechos de varios dominios                       |
| Domain Event   | Hecho pasado e inmutable publicado por su módulo propietario                       |
| Projection     | Modelo de lectura regenerable derivado de fuentes propietarias                     |
| BackOffice     | Experiencia interna que compone capacidades; no posee el dominio                   |
| Client Portal  | Experiencia externa limitada por participación, permiso y visibilidad              |

Regla terminológica importante: `EventSession` es el término temporal oficial. No debe sustituirse por nombres ambiguos como agenda item, segment o activity para representar el mismo concepto.

---

## 6. Mapa de dominios

### 6.1 Core Domains

| Dominio      | Responsabilidad diferenciadora                             |
| ------------ | ---------------------------------------------------------- |
| EVENTS       | Expediente central, ciclo de vida, sesiones y programación |
| PRODUCTION   | Ejecución creativa, humana, técnica y temporal             |
| MEDIA        | Ciclo técnico-funcional de los activos audiovisuales       |
| GALLERY      | Curaduría, selección, revisión y publicación de medios     |
| DELIVERABLES | Compromisos, versiones, aprobación y entrega final         |

### 6.2 Supporting Domains

| Dominio       | Responsabilidad                                             |
| ------------- | ----------------------------------------------------------- |
| PEOPLE        | Identidad de personas y organizaciones                      |
| CRM           | Leads, oportunidades, cotizaciones y actividad comercial    |
| CONTRACTS     | Acuerdos, versiones, partes, firmas y estados contractuales |
| PAYMENTS      | Obligaciones, cuotas, transacciones y estado financiero     |
| INVITATIONS   | Invitaciones y confirmaciones asociadas a Events            |
| CMS           | Contenido editorial autorizado                              |
| NOTIFICATIONS | Comunicaciones derivadas del negocio                        |
| AUTOMATION    | Reacción controlada a hechos mediante comandos públicos     |
| ANALYTICS     | Métricas y proyecciones regenerables                        |
| CLIENT PORTAL | Composición externa de capacidades autorizadas              |
| BACKOFFICE    | Composición interna para la operación                       |

### 6.3 Generic Domains

| Dominio     | Responsabilidad                                |
| ----------- | ---------------------------------------------- |
| AUTH        | Credenciales, autenticación, tokens y sesiones |
| USERS       | Cuentas con acceso al sistema                  |
| ROLES       | Agrupación administrativa de permisos          |
| PERMISSIONS | Autorización granular y scopes                 |
| SYSTEM      | Salud, versión y diagnóstico                   |
| SETTINGS    | Configuración administrable                    |
| STORAGE     | Persistencia agnóstica de objetos binarios     |
| AUDIT       | Evidencia transversal de acciones sensibles    |

---

## 7. Ownership y relaciones entre módulos

| Fuente               | Consumidor                               | Relación permitida                                              |
| -------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| PEOPLE               | EVENTS, CRM, CONTRACTS, PAYMENTS, PORTAL | Referencias a PersonId u OrganizationId; identidad no duplicada |
| CRM                  | EVENTS                                   | Una Opportunity ganada puede solicitar la creación de Event     |
| EVENTS               | todos los dominios audiovisuales         | EventId como referencia central estable                         |
| CONTRACTS            | PAYMENTS                                 | Un contrato firmado puede originar obligaciones financieras     |
| CONTRACTS            | DELIVERABLES                             | El alcance acordado puede originar compromisos                  |
| STORAGE              | MEDIA                                    | STORAGE conserva bytes; MEDIA conserva semántica audiovisual    |
| MEDIA                | GALLERY                                  | Gallery referencia activos sin modificarlos ni duplicarlos      |
| MEDIA/GALLERY        | DELIVERABLES                             | Composición de una entrega a partir de activos autorizados      |
| módulos propietarios | CLIENT PORTAL/BACKOFFICE                 | Consultas o comandos autorizados mediante superficies públicas  |
| todos                | TIMELINE/ANALYTICS/AUDIT                 | Consumo de eventos o proyecciones sin adquirir ownership        |

### 7.1 Prohibiciones clave

- EVENTS no debe almacenar contratos, pagos, medios, galerías ni entregables.
- PEOPLE no debe almacenar la participación contextual en Event.
- AUTH/USERS no sustituyen a Person.
- MEDIA no debe conocer detalles del proveedor físico de almacenamiento.
- GALLERY no debe modificar Media Assets originales ni acceder directamente a STORAGE.
- CLIENT PORTAL y BACKOFFICE no deben contener reglas de dominio propias.
- AUTOMATION no debe saltarse permisos o invariantes.
- Un módulo no debe importar repositorios, mappers o entidades internas de otro módulo.

---

## 8. Contexto del dominio EVENTS

EVENTS es el núcleo coordinador del producto.

### 8.1 Responsabilidades

- Crear y mantener la identidad del Event.
- Generar y proteger su código de negocio.
- Administrar EventType y la instantánea de plantilla aplicada.
- Mantener nombre, prioridad, zona horaria y brief.
- Administrar EventSessions y su programación.
- Controlar lifecycle status, production phase y date status.
- Registrar transiciones e historial funcional.
- Publicar hechos de dominio.

### 8.2 Elementos principales

- `Event`: Aggregate Root.
- `EventSession`: entidad temporal perteneciente al Event.
- `EventType`: catálogo y plantilla versionada.
- `Location`: ubicación reutilizable.
- `EventStatusHistory`: registro de cambios relevantes.
- `EventBrief`: objeto de valor integrado en Event.
- Tags, Checklist y Timeline: capacidades previstas con límites explícitos.

### 8.3 Estados independientes

El diseño separa tres dimensiones para evitar un estado único ambiguo:

- **Lifecycle status:** situación administrativa del expediente.
- **Production phase:** avance operativo de la producción.
- **Date status:** grado de confirmación temporal.

Estas dimensiones no deben colapsarse en un solo enum ni inferirse unas de otras sin una regla aprobada.

### 8.4 Reglas esenciales

- Event es la frontera de consistencia para sus datos internos.
- EventType se copia o versiona al crear Event; cambios posteriores no alteran Events históricos.
- El brief pertenece a Event.
- EventSession utiliza zona horaria explícita y rangos válidos.
- Las transiciones se ejecutan mediante casos de uso explícitos, no mediante actualización genérica.
- La cancelación requiere motivo y trazabilidad.
- El cierre debe validar las políticas externas necesarias sin absorber sus datos.
- Timeline es una proyección, no una tabla maestra editable.

### 8.5 Hechos principales publicados

- `EventCreated`
- `EventActivated`
- `EventSessionConfirmed`
- `EventProductionPhaseChanged`
- `EventCompleted`
- `EventCancelled`
- `EventClosed`

---

## 9. Contexto de los dominios implementados o preparados

### 9.1 PEOPLE

Único propietario de identidad de negocio. Modela Person y Organization con nombres, documentos, datos de contacto, direcciones, estado de negocio y archivado lógico. Client, empleado, proveedor, invitado o colaborador son roles contextuales en otros dominios.

### 9.2 STORAGE

Abstracción técnica agnóstica del proveedor. Ofrece validación, generación de rutas y un proveedor local inicial. No contiene semántica de Event, Media, Gallery o Deliverable.

### 9.3 MEDIA

Propietario de MediaAsset, metadatos, checksums, dimensiones, duración, estado y referencia al objeto almacenado. Separa el archivo lógico audiovisual de los bytes físicos.

### 9.4 GALLERY

Propietario de Gallery, álbumes, referencias curadas, visibilidad y publicación. Una Gallery apunta a Media Assets existentes; no crea copias de su identidad ni los transforma en propiedad de GALLERY.

### 9.5 DELIVERABLES

Propietario de compromisos de entrega y sus items. Controla preparación, estado, método y evidencia de entrega; no es propietario de Media Assets ni del contrato que originó el compromiso.

### 9.6 CONTRACTS

Propietario de Contract, versiones, partes, firmas, cláusulas y estado. Referencia Event y People; no procesa dinero ni modifica el ciclo de vida de Event directamente.

### 9.7 PAYMENTS

Propietario de Payment, cuotas y transacciones. Mantiene estado financiero y referencias a Event/Contract. El dinero no debe representarse con tipos flotantes ni inferirse desde Contract.

### 9.8 CRM

Propietario de Opportunity, pipeline, cotizaciones, actividades, tareas y customer journey. Puede originar un Event mediante un comando público; no se convierte en propietario de Event o Person.

### 9.9 CLIENT PORTAL

Módulo de experiencia y lectura. Compone dashboard, resumen, galerías, entregables y timeline para un Event autorizado. No posee datos de negocio ni debe consultar tablas cruzadas de manera informal.

### 9.10 AUTH y SYSTEM

AUTH está preparado como límite técnico para autenticación y sesiones, pero el contexto revisado no demuestra todavía un flujo empresarial completo de usuarios, roles y permisos. SYSTEM expone health checks y versión.

### 9.11 Dominios oficiales aún no observados como módulos completos

PRODUCTION, USERS, ROLES, PERMISSIONS, SETTINGS, AUDIT, NOTIFICATIONS, INVITATIONS, CMS, AUTOMATION, ANALYTICS y BACKOFFICE forman parte del Blueprint, pero no aparecen como módulos completos en el árbol inspeccionado.

---

## 10. Arquitectura técnica

### 10.1 Stack fijado en el repositorio

| Tecnología | Versión o rango observable                                                 |
| ---------- | -------------------------------------------------------------------------- |
| Node.js    | `>=24.0.0 <25`                                                             |
| pnpm       | `>=10.15.0 <11`; package manager fijado en `10.15.1`                       |
| NestJS     | `11.1.29`                                                                  |
| TypeScript | `5.9.3`                                                                    |
| Prisma ORM | `7.9.1`                                                                    |
| PostgreSQL | Base de datos relacional oficial; imagen/configuración definida en Compose |
| Jest       | `29.7.0`                                                                   |
| ESLint     | `9.39.1`                                                                   |
| Prettier   | `3.6.2`                                                                    |

El proyecto utiliza ESM (`type: module`) y resolución NodeNext. Las dependencias están fijadas a versiones exactas para reproducibilidad.

### 10.2 Infraestructura transversal existente

- Configuración tipada y validada con Zod.
- Variables de entorno y arranque fail-fast.
- CORS configurable.
- Helmet y compression.
- Rate limiting global.
- Logging estructurado con Pino.
- Request ID por solicitud.
- Filtro global de excepciones.
- ValidationPipe global.
- Swagger/OpenAPI configurable.
- Health checks de liveness y readiness.
- PrismaModule y PrismaService.
- Dockerfile multi-stage y variantes de Compose.
- ESLint, Prettier, Husky, lint-staged y Commitlint.
- Pruebas unitarias, de integración y E2E organizadas.

### 10.3 Configuración por entorno

Las familias configurables observadas son:

- Aplicación y versión de API.
- Base de datos.
- JWT y refresh token.
- CORS.
- Logging.
- Swagger.
- Rate limiting.
- Storage.
- Mail.
- Uploads.
- Imágenes.
- FFmpeg.

Los secretos reales nunca deben almacenarse en Git. `.env.example` documenta el contrato, no valores aptos para producción.

---

## 11. Arquitectura física del código

### 11.1 Capas por módulo

La estructura objetivo de cada módulo es proporcional y puede contener:

```text
module/
├── domain/
├── application/
├── infrastructure/
├── presentation/
├── public/
└── module-name.module.ts
```

- `domain/`: entidades, value objects, reglas, eventos y errores puros.
- `application/`: casos de uso y puertos.
- `infrastructure/`: adaptadores como Prisma o proveedores externos.
- `presentation/`: controladores y DTO HTTP.
- `public/`: única superficie autorizada para consumidores de otros módulos.

No todas las carpetas son obligatorias si el módulo aún no las necesita. La proporcionalidad evita esqueletos vacíos.

### 11.2 Platform y shared

- `platform/` contiene capacidades técnicas y primitivas arquitectónicas dependientes de la plataforma.
- `shared/` se reserva para conceptos de dominio genuinamente compartidos, pequeños y estables.

No deben aparecer carpetas globales ambiguas como `common`, `core`, `utils`, `helpers` o `misc`.

### 11.3 Reglas de imports

- Un módulo expone una superficie pública controlada.
- Los consumidores no importan rutas internas de otro módulo.
- El dominio no depende de NestJS, Prisma, HTTP o proveedores concretos.
- Los casos de uso dependen de puertos; infraestructura implementa esos puertos.
- Los mappers separan persistencia y dominio.

---

## 12. Persistencia y datos

### 12.1 Estrategia Prisma

Prisma utiliza un esquema multiarchivo con configuración central. Cada dominio conserva sus modelos en `prisma/schema/<domain>.prisma`, mientras las migraciones permanecen centralizadas y ordenadas.

### 12.2 Modelos observados

| Dominio      | Modelos principales                                                                    |
| ------------ | -------------------------------------------------------------------------------------- |
| PEOPLE       | Person, PersonContactInfo, Organization, OrganizationContactInfo                       |
| EVENTS       | EventTypeModel, LocationModel, EventModel, EventSessionModel, EventStatusHistoryModel  |
| MEDIA        | MediaAsset                                                                             |
| GALLERY      | GalleryModel, GalleryAlbumModel, GalleryAssetReferenceModel                            |
| DELIVERABLES | DeliverableModel, DeliverableItemModel                                                 |
| CONTRACTS    | ContractModel, ContractVersionModel, ContractPartyModel, ContractSignatureModel        |
| PAYMENTS     | PaymentModel, PaymentInstallmentModel, PaymentTransactionModel                         |
| CRM          | OpportunityModel, QuotationModel, CustomerJourneyModel, CRMActivityModel, CRMTaskModel |

### 12.3 Convenciones de integridad

- UUID como identidad técnica.
- Código de negocio separado cuando el dominio lo necesita.
- Timestamps y auditoría coherentes.
- Soft delete separado del estado de negocio.
- Índices y restricciones en campos de búsqueda o unicidad.
- Relaciones internas fuertes dentro del agregado o módulo.
- Referencias entre módulos mediante identificadores estables, sin navegación que viole ownership.
- Migraciones inmutables después de ser aplicadas en entornos compartidos.

### 12.4 Migraciones observadas

El árbol contiene migraciones secuenciales para:

1. PEOPLE.
2. Fundación de plataforma.
3. MEDIA.
4. EVENTS.
5. GALLERY.
6. DELIVERABLES.
7. CONTRACTS.
8. PAYMENTS.
9. CRM.

Varias de estas migraciones forman parte del trabajo local no consolidado y deben validarse contra una base PostgreSQL limpia antes de considerarse entregadas.

---

## 13. API HTTP observable

La aplicación usa prefijo y versión configurables, previstos por defecto como `/api/v1`.

### 13.1 SYSTEM

- `GET /health/live`
- `GET /health/ready`
- `GET /version`

### 13.2 PEOPLE

- CRUD y restauración para `/persons`.
- CRUD y restauración para `/organizations`.
- Lectura por identificador técnico o de negocio según el contrato del controlador.

### 13.3 EVENTS

- Crear, listar, consultar y actualizar Events.
- Activar Event.
- Cambiar production phase.
- Completar o cancelar Event.
- Archivar y restaurar.
- Añadir EventSessions.

### 13.4 MEDIA

- Registrar, listar, consultar y actualizar Media Assets.
- Archivar y restaurar.

### 13.5 GALLERY

- Crear, listar, consultar y actualizar Galleries.
- Publicar y despublicar.
- Archivar y restaurar.
- Añadir álbumes.
- Añadir o retirar referencias a Media Assets.

### 13.6 DELIVERABLES

- Crear, listar, consultar y actualizar Deliverables.
- Marcar como listo y entregar.
- Archivar y restaurar.
- Añadir o retirar items.

### 13.7 CONTRACTS

- Crear, listar, consultar y actualizar Contracts.
- Publicar y ejecutar.
- Archivar y restaurar.
- Añadir versiones y partes.

### 13.8 PAYMENTS

- Crear, listar y consultar Payments.
- Registrar transacciones y cuotas.
- Marcar vencimiento.
- Archivar y restaurar.

### 13.9 CRM

- Crear, listar, consultar y actualizar Opportunities.
- Cambiar pipeline stage y convertir Opportunity.
- Archivar y restaurar.
- Añadir, aprobar o rechazar Quotations.
- Registrar actividades y tareas.
- Completar tareas.

### 13.10 CLIENT PORTAL

- Dashboard y resumen de Event.
- Galleries visibles.
- Deliverables visibles.
- Timeline derivado.

Este inventario describe rutas observadas, no sustituye un contrato OpenAPI generado ni certifica que todas estén listas para producción.

---

## 14. Eventos de dominio y consistencia

### 14.1 Reglas globales

- Un evento expresa un hecho que ya ocurrió.
- Solo el propietario del dato publica el evento.
- El payload debe ser mínimo, versionado y libre de secretos o PII innecesaria.
- Los consumidores deben ser idempotentes.
- Reprocesar un evento no puede duplicar efectos.
- Consumir un evento no autoriza a violar invariantes del consumidor.
- Timeline, Analytics y Audit pueden observar hechos sin adquirir ownership.

### 14.2 Infraestructura actual

La plataforma contiene AggregateRoot, contratos de DomainEvent, publisher y una implementación in-memory. Este mecanismo es apropiado para el monolito inicial; no implica todavía garantías de entrega distribuida.

### 14.3 Evolución futura

Si aparecen integraciones externas críticas o entrega asíncrona durable, se deberá evaluar Outbox/Inbox mediante ADR. No debe introducirse un broker únicamente por anticipación.

---

## 15. Seguridad y acceso

### 15.1 Modelo objetivo

La seguridad combina:

- Cuenta autenticada.
- Sesión válida.
- Permiso explícito.
- Scope o alcance contextual.
- Validación final del módulo propietario.

### 15.2 Tokens

- Access token corto.
- Refresh token de mayor duración.
- Rotación y revocación previstas.
- Secretos configurados por entorno.

### 15.3 Datos especialmente sensibles

- Identidad y contacto de People.
- Contratos, partes y firmas.
- Obligaciones y transacciones financieras.
- Media Assets privados.
- Enlaces de Gallery y Deliverable.
- Acciones administrativas y auditoría.

### 15.4 Restricciones de exposición

- URLs de medios deben ser temporales cuando corresponda.
- Client Portal solo expone recursos visibles para la participación autorizada.
- Logs no deben contener secretos, tokens, contraseñas o payloads personales completos.
- Swagger debe poder desactivarse en producción.
- CORS debe usar allowlist configurable.

### 15.5 Estado observado

La infraestructura de seguridad HTTP, JWT y configuración existe. La revisión del árbol no permite afirmar que USERS, ROLES, PERMISSIONS, scopes, rotación completa de refresh tokens y autorización contextual estén terminados. Deben tratarse como capacidades pendientes hasta validación específica.

---

## 16. Calidad, pruebas y operación

### 16.1 Comandos principales

```bash
pnpm build
pnpm start:dev
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm check
pnpm prisma:generate
pnpm prisma:validate
pnpm prisma:migrate:deploy
```

### 16.2 Estrategia de pruebas

- Unitarias co-localizadas con la unidad probada.
- Integración centralizada bajo `tests/integration`.
- E2E centralizada bajo `tests/e2e`.
- Soporte común bajo `tests/support`.
- Pruebas de contrato deberán añadirse cuando existan consumidores que requieran estabilidad explícita.

### 16.3 Automatización

El repositorio dispone de controles de formato, lint, tipos, tests, build, Prisma, Conventional Commits y hooks. El informe de Etapa 0 registra fallos históricos de GitHub Actions antes de asignar runner y ausencia local de Docker en aquel momento; esas observaciones son históricas y deben revalidarse antes de emitir un estado actual de CI.

### 16.4 Definición mínima de terminado

Una capacidad no está terminada solo porque compile. Debe demostrar, según su riesgo:

- Conformidad con Blueprint y ADR.
- Invariantes de dominio cubiertas.
- DTOs y validaciones correctos.
- Persistencia y mappers verificados.
- Autorización y alcance.
- Unit tests.
- Integración con PostgreSQL cuando persiste datos.
- E2E del contrato HTTP crítico.
- OpenAPI actualizado.
- Migración reproducible.
- Logging y errores sin fuga de datos.

---

## 17. Estado actual del repositorio al realizar esta revisión

### 17.1 Estado consolidado en Git

- Rama activa observada: `master`.
- `origin/master` y `origin/main` apuntan al commit `fead796`.
- Último commit: `feat(people): complete implementation of PEOPLE domain (WO-002)`.
- El historial contiene la fundación de Etapa 0, Docker, CI, README, el informe integral y PEOPLE.

### 17.2 Trabajo local no consolidado

Se observaron 47 entradas modificadas, eliminadas o nuevas. Incluyen:

- Incorporación local de MEDIA, EVENTS, GALLERY, DELIVERABLES, CLIENT PORTAL, CONTRACTS, CRM y PAYMENTS.
- Implementación de STORAGE y primitives de plataforma.
- Nuevos diseños de dominio.
- Nuevos fragmentos Prisma y migraciones.
- Cambios en `AppModule`, configuración y PEOPLE.
- Movimiento de conceptos desde `shared/domain` hacia `platform/domain`.

Este trabajo se describe en este documento porque forma parte del estado real del workspace, pero no debe presentarse como publicado, revisado o aprobado por CI hasta ser consolidado explícitamente.

### 17.3 Precaución de ramas

La documentación histórica menciona publicación en `main`, mientras la rama activa actual es `master` y ambos remotos apuntan al mismo commit. Antes de nuevos flujos de PR o automatización debe definirse y configurar una única rama por defecto para evitar divergencias. Esta normalización puede ser operativa, pero cualquier cambio de política persistente debe documentarse.

---

## 18. Decisiones arquitectónicas oficiales vigentes

El registro canónico vive únicamente en el Platform Blueprint. Resumen:

| ADR     | Decisión                                                    |
| ------- | ----------------------------------------------------------- |
| ADR-001 | Event es el Aggregate Root principal                        |
| ADR-002 | La plataforma comienza como monolito modular                |
| ADR-003 | PEOPLE es propietario de la identidad de negocio            |
| ADR-004 | Client es un rol y no una dependencia directa de Event      |
| ADR-005 | Cada dato tiene un único módulo propietario                 |
| ADR-006 | MEDIA es propietario de los activos digitales               |
| ADR-007 | STORAGE es infraestructura agnóstica del proveedor          |
| ADR-008 | Timeline es una proyección derivada                         |
| ADR-009 | EventSession es el término temporal oficial                 |
| ADR-010 | El brief forma parte de Event                               |
| ADR-011 | Location es reutilizable                                    |
| ADR-012 | EventType usa plantillas versionadas no retroactivas        |
| ADR-013 | Timeline y Analytics no son fuentes operacionales           |
| ADR-014 | Las interfaces de experiencia no poseen el dominio          |
| ADR-015 | Las automatizaciones usan comandos públicos                 |
| ADR-016 | Las decisiones arquitectónicas se registran como ADR        |
| ADR-017 | El repositorio comienza como una aplicación NestJS única    |
| ADR-018 | La organización física principal es por módulo de dominio   |
| ADR-019 | Cada módulo expone una única superficie pública             |
| ADR-020 | `shared/` y `platform/` tienen significados distintos       |
| ADR-021 | Prisma usa esquema multiarchivo y migraciones centralizadas |
| ADR-022 | La estructura interna de módulos es proporcional            |
| ADR-023 | Unit tests co-localizados; pruebas de sistema centralizadas |

El siguiente identificador disponible indicado por el Blueprint es `ADR-024`. Este documento no crea ese ADR porque no adopta una decisión nueva.

---

## 19. Roadmap arquitectónico oficial

| Etapa                         | Capacidades                                                                 |
| ----------------------------- | --------------------------------------------------------------------------- |
| 0 — Fundación técnica         | SYSTEM, AUTH, USERS, ROLES, PERMISSIONS, SETTINGS, AUDIT y contrato STORAGE |
| 1 — Identidad y núcleo        | PEOPLE y EVENTS                                                             |
| 2 — Operación interna         | PRODUCTION básico, NOTIFICATIONS y BACKOFFICE inicial                       |
| 3 — Comercial y financiero    | CRM, CONTRACTS y PAYMENTS                                                   |
| 4 — Cadena audiovisual        | MEDIA, STORAGE, GALLERY y DELIVERABLES                                      |
| 5 — Experiencia externa       | CLIENT PORTAL e INVITATIONS                                                 |
| 6 — Publicación y crecimiento | CMS, AUTOMATION y ANALYTICS                                                 |

La secuencia representa dependencias arquitectónicas, no una prohibición absoluta de preparar esqueletos. Una etapa puede avanzar cuando los contratos e invariantes necesarios de las anteriores son estables.

### 19.1 Diferencia detectada entre roadmap y workspace

El trabajo local incluye módulos de las etapas 3, 4 y 5 mientras algunos módulos fundacionales y PRODUCTION aún no aparecen completos. Esto puede ser válido si se trata de preparación incremental, pero requiere comprobar que:

- No se simulan permisos o identidades con soluciones temporales que luego se vuelvan permanentes.
- CLIENT PORTAL no adquiera ownership.
- CONTRACTS y PAYMENTS no queden acoplados a detalles incompletos de Event o People.
- GALLERY y DELIVERABLES respeten MEDIA/STORAGE.
- La ausencia de PRODUCTION no deforme estados de Event o Deliverable.

---

## 20. Riesgos y hallazgos de la revisión

### 20.1 Metadatos documentales desactualizados

`infrastructure-proposal.md` y `repository-architecture.md` mantienen estados de propuesta, aunque conversaciones y documentos posteriores los tratan como aprobados. Se recomienda corregir solo los encabezados mediante una tarea documental explícita.

### 20.2 Diferencia entre informe histórico y estado actual

El informe de Etapa 0 afirma deliberadamente que los módulos de negocio no estaban implementados. Es correcto para la fecha de ese informe, pero ya no describe todo el workspace actual. Debe conservarse como evidencia histórica, no actualizarse para reescribir el pasado.

### 20.3 Muchos módulos en un único cambio local

El volumen de trabajo no consolidado aumenta el riesgo de revisar superficialmente migraciones, límites públicos y reglas. Conviene dividir la entrega por dominio o work order, validando cada módulo de extremo a extremo.

### 20.4 Rama por defecto ambigua

La convivencia nominal de `main` y `master` puede romper CI, PR, documentación y automatizaciones. Debe resolverse antes de crecer el equipo.

### 20.5 Autorización aún no demostrada

Exponer controladores de negocio antes de completar permisos y scopes puede producir una API funcional pero insegura. Los endpoints no deben considerarse production-ready sin guards y políticas contextuales.

### 20.6 Integración in-memory de eventos

Es adecuada en la fase inicial, pero no ofrece por sí sola durabilidad para integraciones críticas. Debe evaluarse cuando existan side effects externos reales.

### 20.7 Consistencia entre documentación, Prisma y dominio

Los diseños breves de algunos dominios establecen límites, pero no tienen el detalle exhaustivo de EVENTS. Antes de ampliar reglas complejas conviene profundizar sus especificaciones para que el código no se convierta en la única fuente de diseño.

### 20.8 Nombres Prisma heterogéneos

Algunos modelos usan sufijo `Model` y otros no. Esto no implica un fallo funcional, pero debe contrastarse con las convenciones oficiales antes de extender el esquema para evitar una taxonomía inconsistente.

---

## 21. Reglas para continuar el desarrollo

Antes de implementar una capacidad:

1. Identificar el módulo propietario del dato.
2. Leer el ADR aplicable, el Blueprint y la especificación del dominio.
3. Confirmar que la capacidad pertenece al roadmap y que sus dependencias están disponibles.
4. Diseñar invariantes y casos de uso antes del controlador.
5. Exponer integración únicamente por `public/`, eventos o proyecciones.
6. Evitar imports internos entre módulos.
7. Diseñar el DTO HTTP independientemente del modelo Prisma.
8. Añadir autorización por permiso y alcance.
9. Implementar migración, mapper, repositorio y pruebas proporcionales.
10. Validar OpenAPI, logging, errores e idempotencia.
11. Crear un ADR si se adopta o cambia una decisión significativa.

### 21.1 Preguntas obligatorias de revisión

- ¿Quién es propietario de este dato?
- ¿Se está duplicando una identidad o un estado?
- ¿Event está absorbiendo una responsabilidad ajena?
- ¿Existe acceso lateral a persistencia?
- ¿La UI o el portal están definiendo reglas?
- ¿La transición es explícita y auditable?
- ¿El consumidor puede repetir la operación sin duplicar efectos?
- ¿El endpoint verifica scope además de rol?
- ¿La migración es reversible operacionalmente y reproducible?
- ¿La documentación sigue describiendo la realidad?

---

## 22. Guía rápida para nuevos colaboradores o agentes

### Lectura mínima obligatoria

1. Este documento.
2. `docs/architecture/platform-blueprint.md`.
3. La especificación del dominio que se modificará.
4. `docs/architecture/repository-architecture.md`.
5. README raíz, `.env.example`, `package.json` y esquema Prisma correspondiente.

### Conducta esperada

- No modificar el frontend Angular desde este repositorio.
- No reescribir ADR aceptados; crear uno nuevo si la decisión cambia.
- No afirmar que algo está entregado sin pruebas y estado Git verificables.
- No mezclar cambios ajenos ya presentes en el workspace.
- No editar migraciones aplicadas en entornos compartidos.
- No introducir una nueva infraestructura distribuida sin necesidad y ADR.
- No crear carpetas genéricas para evitar decidir ownership.
- Mantener código, documentación y OpenAPI sincronizados.

---

## 23. Fuentes de verdad por tema

| Tema                                 | Fuente primaria                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| Visión, mapa de dominios y ownership | `docs/architecture/platform-blueprint.md`                                          |
| ADR                                  | Capítulo 16 del Platform Blueprint                                                 |
| Arquitectura física                  | `docs/architecture/repository-architecture.md`                                     |
| Infraestructura                      | `docs/architecture/infrastructure-proposal.md` y código de bootstrap/configuración |
| EVENTS                               | `docs/domains/events/events-domain-design.md`                                      |
| PEOPLE                               | `docs/domains/people/people-domain-design.md`                                      |
| Otros dominios                       | `docs/domains/<domain>/<domain>-domain-design.md`                                  |
| API ejecutable                       | Controladores y documento OpenAPI generado                                         |
| Persistencia                         | `prisma/schema/` y `prisma/migrations/`                                            |
| Dependencias y comandos              | `package.json` y `pnpm-lock.yaml`                                                  |
| Configuración                        | `.env.example` y `src/config/`                                                     |
| Estado histórico de Etapa 0          | `docs/reports/stage-0-implementation-report.md`                                    |
| Estado efectivo del trabajo          | Git, pruebas y código actual                                                       |

---

## 24. Síntesis final

TECNOJACK está diseñado como una plataforma SaaS audiovisual event-first, construida mediante un monolito modular con ownership estricto. PEOPLE posee la identidad; EVENTS gobierna el expediente central; MEDIA posee los activos; STORAGE conserva bytes; GALLERY cura; DELIVERABLES entrega; CONTRACTS formaliza; PAYMENTS administra dinero; CRM gestiona la oportunidad; las interfaces solo componen capacidades.

La fundación técnica es moderna y está preparada para crecer: NestJS, TypeScript, PostgreSQL, Prisma multiarchivo, Docker, configuración validada, seguridad HTTP, observabilidad, Swagger, calidad automatizada y una arquitectura por capas. El repositorio consolidado contiene la Etapa 0 y PEOPLE; el workspace revisado incluye una expansión local considerable hacia varios dominios adicionales.

La prioridad inmediata no es añadir más módulos indiscriminadamente. Es consolidar los cambios por dominio, verificar migraciones y contratos, completar autorización contextual, resolver la política de rama principal y mantener alineados Blueprint, ADR, especificaciones, OpenAPI, Prisma y código.

Este documento debe actualizarse cuando cambie materialmente el estado global del producto, pero nunca debe usarse para reemplazar o modificar implícitamente una decisión oficial.
