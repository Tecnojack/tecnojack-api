# TECNOJACK Platform Blueprint v1

## Constitución arquitectónica y funcional de la plataforma

**Estado:** Especificación oficial inicial  
**Versión:** 1.0  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 10 de agosto de 2026

---

## 1. Propósito y autoridad

Este Blueprint define la arquitectura de producto, dominio y funciones de TECNOJACK. Es el documento padre de la plataforma y la referencia común para backend, frontend, Figma, APIs, base de datos, automatizaciones, CMS, BackOffice y Client Portal.

Su propósito es establecer:

- Qué dominios y módulos existen.
- Quién es propietario de cada dato.
- Qué módulo puede crear o modificar información.
- Qué dependencias están permitidas y prohibidas.
- Qué capacidades públicas ofrece cada módulo.
- Qué eventos de dominio publica y consume.
- Cómo fluye el negocio de extremo a extremo.
- En qué orden debe crecer la plataforma.
- Por qué se tomaron las decisiones importantes.

### 1.1 Jerarquía documental

1. Los ADR aceptados en este Blueprint gobiernan las decisiones transversales.
2. Este Blueprint gobierna los límites entre dominios y módulos.
3. Las especificaciones oficiales de cada dominio gobiernan su diseño interno.
4. Los contratos API gobiernan la interacción técnica pública.
5. El código implementa estas decisiones y no puede redefinirlas de forma implícita.

Ante una contradicción, prevalece el documento de mayor nivel o la decisión aceptada más reciente. La contradicción debe resolverse documentalmente antes de implementarse.

### 1.2 Mecanismo ADR obligatorio

Toda decisión arquitectónica significativa se añadirá al capítulo **Decisiones arquitectónicas oficiales** con:

- Identificador permanente `ADR-NNN`.
- Estado.
- Fecha.
- Contexto.
- Decisión.
- Consecuencias.

Los identificadores son consecutivos y nunca se reutilizan. Una decisión reemplazada conserva su registro y pasa a `Superseded`, indicando el ADR que la sustituye. Las decisiones futuras se incorporarán automáticamente al Blueprint cuando sean aprobadas.

---

## 2. Visión general

TECNOJACK es la plataforma operativa central de una empresa audiovisual. No es solamente un sitio web ni una API auxiliar.

Debe soportar durante muchos años:

- Bodas, quince años y grados.
- Eventos corporativos.
- Fotografía y video.
- Videos musicales.
- Producción audiovisual.
- Contenido para redes sociales.
- Miles de Events, personas, contratos, pagos, galerías y entregables.
- Grandes volúmenes de Media Assets.
- Experiencias internas y externas diferenciadas.

La plataforma se construirá como un **monolito modular**. Cada módulo tendrá límites, ownership y capacidades públicas claras. La modularidad permitirá crecer sin asumir desde ahora el coste operativo de microservicios.

---

## 3. Objetivos del sistema

1. Centralizar la operación audiovisual alrededor de Event.
2. Mantener una única fuente de verdad por tipo de información.
3. Coordinar el ciclo comercial, contractual, financiero, productivo y de entrega.
4. Permitir colaboración segura entre personal, colaboradores y participantes externos.
5. Gestionar medios a gran escala sin acoplar el negocio a un proveedor de almacenamiento.
6. Proporcionar trazabilidad de decisiones y acciones.
7. Automatizar tareas repetibles sin ocultar las reglas del negocio.
8. Ofrecer experiencias específicas mediante BackOffice, CMS y Client Portal.
9. Favorecer evolución gradual, bajo acoplamiento y alta cohesión.
10. Evitar sobreingeniería y dependencias circulares.

---

## 4. Principios arquitectónicos oficiales

### 4.1 Event-first

Event es el Aggregate Root principal del negocio audiovisual. Los módulos dependientes se relacionan con EventId, pero conservan sus datos y reglas.

### 4.2 Ownership único

Cada dato tiene un único módulo propietario. Otros módulos consultan capacidades públicas o proyecciones; no modifican tablas ajenas.

### 4.3 Monolito modular

Los módulos viven inicialmente en una aplicación desplegable, pero se comportan como límites de dominio reales.

### 4.4 Dependencias dirigidas

Las dependencias apuntan hacia módulos fundacionales o hacia contratos públicos. Las interfaces de experiencia nunca son propietarias del dominio.

### 4.5 Integración explícita

Una interacción entre módulos usa una capacidad pública, un evento de dominio o una proyección autorizada. No usa acceso lateral a persistencia.

### 4.6 Seguridad y privacidad por diseño

La autorización combina permiso y alcance. La información personal, financiera, contractual y audiovisual se expone solo según propósito y audiencia.

### 4.7 Evolución pragmática

Se introduce una abstracción cuando protege un límite real o resuelve una necesidad concreta. No se anticipan microservicios, brokers o workflows genéricos sin evidencia.

### 4.8 Historial y trazabilidad

Las transiciones importantes son explícitas, auditables y no se reemplazan por ediciones silenciosas.

### 4.9 Proyecciones para lectura

Las vistas transversales, como Timeline y Analytics, se derivan de fuentes propietarias y no se convierten en fuentes de verdad paralelas.

### 4.10 Contratos estables

Backend, Angular, Figma y automatizaciones comparten lenguaje y contratos versionados, sin depender de estructuras internas de persistencia.

---

## 5. Lenguaje ubicuo global de TECNOJACK

| Término | Definición oficial |
|---|---|
| Event | Expediente central de un proyecto audiovisual y Aggregate Root principal del negocio |
| Event Type | Clasificación y plantilla versionada para inicializar Events |
| Event Session | Etapa temporal importante de un Event |
| Person | Individuo cuya identidad y datos son propiedad de PEOPLE |
| Organization | Entidad colectiva representada y administrada por PEOPLE |
| Participant | Persona u organización relacionada con un Event mediante uno o varios roles contextuales |
| Client | Rol comercial contextual; no es el propietario ni la raíz de Event |
| Contact | Persona o canal usado para comunicación en un contexto determinado |
| Lead | Interés comercial todavía no calificado, propiedad de CRM |
| Opportunity | Posibilidad comercial calificada que puede originar un Event |
| Contract | Acuerdo formal que define alcance, obligaciones, derechos y aceptación |
| Payment | Obligación o movimiento financiero asociado a Event o Contract |
| Production | Ejecución coordinada del trabajo humano, técnico y operativo |
| Team Member | Persona interna o colaboradora asignada a una función productiva |
| Media Asset | Archivo audiovisual individual y sus metadatos administrados por MEDIA |
| Storage Object | Representación técnica de bytes persistidos mediante STORAGE |
| Gallery | Colección curada de Media Assets para selección, revisión o publicación |
| Deliverable | Resultado comprometido, producido, aprobado o entregado para un Event |
| Invitation | Experiencia de invitación vinculada a un Event y sus destinatarios |
| Checklist | Lista contextual de Items completables vinculada a un Event |
| Timeline | Proyección cronológica de hechos procedentes de varios módulos |
| Notification | Comunicación que el sistema intenta entregar a un destinatario mediante un canal |
| Automation | Regla que reacciona a un hecho y solicita una acción permitida |
| Content | Material editorial administrado por CMS para publicación |
| BackOffice | Experiencia interna de operación; no es propietario de datos de dominio |
| Client Portal | Experiencia externa con acceso limitado por participación y visibilidad |
| Setting | Configuración administrable que modifica comportamiento dentro de límites permitidos |
| Audit Record | Evidencia inmutable de una acción sensible o cambio relevante |
| Domain Event | Hecho pasado e inmutable publicado por el módulo propietario |
| Projection | Modelo de lectura derivado de fuentes de verdad propietarias |

Las especificaciones de dominio pueden ampliar este lenguaje, pero no redefinir sus términos globales sin un nuevo ADR.

---

## 6. Mapa de dominios

### 6.1 Core Domains

| Dominio | Razón |
|---|---|
| EVENTS | Organiza el expediente central del trabajo audiovisual |
| PRODUCTION | Coordina la ejecución creativa, humana, técnica y temporal |
| MEDIA | Gestiona el activo audiovisual que constituye el producto principal |
| GALLERY | Convierte medios en experiencias de revisión, selección y presentación |
| DELIVERABLES | Controla compromisos, versiones, aprobación y entrega final |

Estos dominios representan la operación diferenciadora de TECNOJACK. Su lenguaje y reglas requieren diseño propio.

### 6.2 Supporting Domains

| Dominio | Razón |
|---|---|
| PEOPLE | Proporciona identidad de personas y organizaciones a todos los contextos |
| CRM | Gestiona la relación comercial antes y alrededor del Event |
| CONTRACTS | Formaliza alcance, derechos y obligaciones |
| PAYMENTS | Gestiona el estado financiero de la relación |
| INVITATIONS | Amplía la experiencia de determinados Events |
| CMS | Publica contenido editorial y material autorizado |
| NOTIFICATIONS | Ejecuta comunicaciones derivadas del negocio |
| AUTOMATION | Coordina acciones repetibles entre capacidades existentes |
| ANALYTICS | Produce métricas y proyecciones para decisiones |
| CLIENT PORTAL | Expone capacidades autorizadas a participantes externos |
| BACKOFFICE | Compone capacidades para la operación interna |

Son esenciales para la plataforma completa, pero soportan el núcleo audiovisual.

### 6.3 Generic Domains

| Dominio | Razón |
|---|---|
| AUTH | Autenticación y sesiones son capacidades transversales conocidas |
| USERS | Identidad de cuenta y acceso al sistema |
| ROLES | Agrupación administrativa de permisos |
| PERMISSIONS | Autorización granular y alcance |
| SYSTEM | Salud, versión, diagnóstico y capacidades operativas |
| SETTINGS | Configuración administrable |
| STORAGE | Abstracción de almacenamiento de objetos |
| AUDIT | Evidencia transversal de acciones sensibles |

Son capacidades genéricas necesarias, pero no diferenciadoras del negocio audiovisual.

---

## 7. Mapa de módulos

### 7.1 AUTH

- **Propósito:** autenticar cuentas y administrar sesiones.
- **Responsabilidades:** credenciales, login, access tokens, refresh tokens, revocación y recuperación futura.
- **Propietario de:** secretos de autenticación y sesiones.
- **Límite:** no es propietario de perfiles personales ni permisos de negocio.
- **Dependencias permitidas:** USERS, AUDIT, NOTIFICATIONS.
- **Dependencias prohibidas:** EVENTS, CRM, CONTRACTS, PAYMENTS y MEDIA.
- **Publica:** `UserAuthenticated`, `AuthenticationFailed`, `SessionCreated`, `SessionRevoked`.
- **Consume:** `UserDisabled`, `UserCredentialsResetRequested`.

### 7.2 USERS

- **Propósito:** administrar cuentas capaces de acceder a la plataforma.
- **Responsabilidades:** estado de cuenta, vínculo futuro con Person y preferencias básicas de acceso.
- **Propietario de:** UserAccount.
- **Límite:** una cuenta no sustituye a Person.
- **Dependencias permitidas:** PEOPLE, ROLES, PERMISSIONS, AUDIT.
- **Dependencias prohibidas:** ownership de Events o datos comerciales.
- **Publica:** `UserCreated`, `UserActivated`, `UserDisabled`, `UserLinkedToPerson`.
- **Consume:** `PersonMerged`, asignaciones administrativas autorizadas.

### 7.3 ROLES

- **Propósito:** agrupar permisos en perfiles administrables.
- **Propietario de:** Role y sus asignaciones administrativas.
- **Límite:** no decide reglas contextuales de un dominio.
- **Dependencias permitidas:** PERMISSIONS, USERS.
- **Dependencias prohibidas:** tablas de módulos de negocio.
- **Publica:** `RoleCreated`, `RolePermissionsChanged`, `RoleAssigned`.
- **Consume:** `PermissionRegistered`, `UserDisabled`.

### 7.4 PERMISSIONS

- **Propósito:** definir permisos y resolver autorización con alcance.
- **Propietario de:** Permission, grants y scopes.
- **Límite:** el módulo propietario del recurso sigue validando sus invariantes.
- **Dependencias permitidas:** USERS, ROLES.
- **Dependencias prohibidas:** modificación de recursos protegidos.
- **Publica:** `PermissionGranted`, `PermissionRevoked`.
- **Consume:** `RoleAssigned`, `UserDisabled`, registros de permisos de módulos.

### 7.5 SYSTEM

- **Propósito:** exponer salud, versión, diagnóstico, configuración efectiva segura y métricas operativas.
- **Propietario de:** metadatos operativos del servicio.
- **Límite:** no almacena datos de negocio ni secretos visibles.
- **Dependencias permitidas:** comprobaciones de disponibilidad de todos los módulos.
- **Dependencias prohibidas:** modificación del dominio.
- **Publica:** `SystemDegraded`, `SystemRecovered` cuando exista necesidad.
- **Consume:** señales operativas, no eventos de negocio para mutación.

### 7.6 PEOPLE

- **Propósito:** fuente de verdad para personas, organizaciones y medios de contacto.
- **Responsabilidades:** identidad, nombres, datos de contacto, organizaciones, relaciones y deduplicación.
- **Propietario de:** Person, Organization, ContactPoint y relaciones entre ellos.
- **Límite:** no es propietario de la participación en Event ni de la condición comercial histórica de CRM.
- **Dependencias permitidas:** AUDIT, SETTINGS.
- **Dependencias prohibidas:** EVENTS como requisito para crear una Person.
- **Publica:** `PersonCreated`, `PersonUpdated`, `PersonMerged`, `OrganizationCreated`, `ContactPointChanged`.
- **Consume:** solicitudes explícitas de creación o vinculación desde CRM y operación autorizada.

### 7.7 EVENTS

- **Propósito:** gobernar el expediente central del proyecto audiovisual.
- **Responsabilidades:** Event, EventType, EventSession, brief integrado, estado, fase, programación e historial funcional.
- **Propietario de:** identidad, código y ciclo de vida de Event.
- **Límite:** no contiene Client, contratos, pagos, medios ni entregas.
- **Dependencias permitidas:** USERS/PERMISSIONS para actor y autorización; PEOPLE mediante participación futura; catálogos autorizados.
- **Dependencias prohibidas:** lectura o escritura directa en tablas de módulos dependientes.
- **Publica:** `EventCreated`, `EventActivated`, `EventSessionConfirmed`, `EventProductionPhaseChanged`, `EventCompleted`, `EventCancelled`, `EventClosed`.
- **Consume:** resultados de políticas explícitas como contrato válido, estado de entregables o asignación productiva cuando una transición lo requiera.

### 7.8 CONTRACTS

- **Propósito:** formalizar acuerdos vinculados a Events.
- **Propietario de:** Contract, versión, partes contractuales, firma, alcance y estado.
- **Límite:** no modifica Event ni procesa dinero.
- **Dependencias permitidas:** EVENTS, PEOPLE, DELIVERABLES, AUDIT, NOTIFICATIONS.
- **Dependencias prohibidas:** persistencia interna de PAYMENTS.
- **Publica:** `ContractCreated`, `ContractSent`, `ContractSigned`, `ContractCancelled`, `ContractExpired`.
- **Consume:** `EventCreated`, cambios de Participants, `DeliverableDefined` cuando corresponda.

### 7.9 PAYMENTS

- **Propósito:** administrar obligaciones y movimientos financieros.
- **Propietario de:** PaymentObligation, PaymentTransaction, Refund y estado financiero.
- **Límite:** no firma contratos ni cambia Event.
- **Dependencias permitidas:** EVENTS, CONTRACTS, PEOPLE, AUDIT, NOTIFICATIONS.
- **Dependencias prohibidas:** modificación directa de CONTRACTS o EVENTS.
- **Publica:** `PaymentRequested`, `PaymentReceived`, `PaymentFailed`, `PaymentRefunded`, `BalanceSettled`.
- **Consume:** `ContractSigned`, `ContractCancelled`, cambios explícitos de obligación.

### 7.10 MEDIA

- **Propósito:** administrar Media Assets y su ciclo técnico-funcional.
- **Propietario de:** MediaAsset, metadatos, variantes, checksums y estado de procesamiento.
- **Límite:** no es propietario de bytes físicos ni de la curaduría de Gallery.
- **Dependencias permitidas:** EVENTS, STORAGE, PRODUCTION, AUDIT.
- **Dependencias prohibidas:** acceso directo a proveedor físico o modificación de Gallery.
- **Publica:** `MediaAssetRegistered`, `MediaAssetUploaded`, `MediaProcessingCompleted`, `MediaAssetRejected`, `MediaAssetDeleted`.
- **Consume:** `StorageObjectCreated`, `EventSessionCompleted`, solicitudes de procesamiento de PRODUCTION.

### 7.11 GALLERY

- **Propósito:** crear experiencias curadas de visualización, selección y publicación.
- **Propietario de:** Gallery, GalleryItem, selección, acceso y publicación.
- **Límite:** no altera Media Assets originales.
- **Dependencias permitidas:** EVENTS, MEDIA, PEOPLE/PERMISSIONS, NOTIFICATIONS.
- **Dependencias prohibidas:** STORAGE directo y modificación de MEDIA.
- **Publica:** `GalleryCreated`, `GalleryPublished`, `GallerySelectionSubmitted`, `GalleryExpired`.
- **Consume:** `MediaAssetRegistered`, `EventCompleted`, cambios de acceso autorizados.

### 7.12 DELIVERABLES

- **Propósito:** administrar compromisos y entregas finales.
- **Propietario de:** Deliverable, versión, fecha prometida, aprobación y entrega.
- **Límite:** no procesa medios ni transacciones.
- **Dependencias permitidas:** EVENTS, CONTRACTS, MEDIA, GALLERY, PEOPLE, NOTIFICATIONS.
- **Dependencias prohibidas:** escritura directa en fuentes dependientes.
- **Publica:** `DeliverableDefined`, `DeliverableReady`, `DeliverableDelivered`, `DeliverableApproved`, `DeliverableRejected`.
- **Consume:** `ContractSigned`, `MediaProcessingCompleted`, `GallerySelectionSubmitted`.

### 7.13 INVITATIONS

- **Propósito:** administrar invitaciones vinculadas a Events.
- **Propietario de:** Invitation, publicación, destinatarios y confirmaciones.
- **Límite:** no es propietario de Person ni Event.
- **Dependencias permitidas:** EVENTS, PEOPLE, MEDIA, NOTIFICATIONS, CMS.
- **Dependencias prohibidas:** modificación directa de participantes.
- **Publica:** `InvitationPublished`, `InvitationSent`, `InvitationConfirmed`, `InvitationDeclined`.
- **Consume:** `EventActivated`, `EventSessionRescheduled`, cambios autorizados de Participants.

### 7.14 PRODUCTION

- **Propósito:** coordinar la ejecución humana, técnica y operativa.
- **Propietario de:** ProductionPlan, TeamAssignment, tareas operativas, recursos y milestones productivos.
- **Límite:** EVENTS conserva la fase general; MEDIA conserva los activos.
- **Dependencias permitidas:** EVENTS, PEOPLE, MEDIA, CHECKLIST futuro, NOTIFICATIONS.
- **Dependencias prohibidas:** modificación directa de contratos o pagos.
- **Publica:** `ProductionPlanCreated`, `TeamMemberAssigned`, `ProductionStarted`, `ProductionMilestoneReached`, `ProductionCompleted`.
- **Consume:** `EventActivated`, `EventSessionConfirmed`, `EventSessionRescheduled`, `ContractSigned` cuando sea política.

### 7.15 CRM

- **Propósito:** administrar leads, oportunidades y relación comercial.
- **Propietario de:** Lead, Opportunity, actividad comercial, fuente y pipeline.
- **Límite:** Client es un rol comercial; CRM no es propietario de Person ni Event.
- **Dependencias permitidas:** PEOPLE, EVENTS mediante creación/vinculación explícita, NOTIFICATIONS.
- **Dependencias prohibidas:** crear contratos o pagos mediante escritura directa.
- **Publica:** `LeadCreated`, `LeadQualified`, `OpportunityCreated`, `OpportunityWon`, `OpportunityLost`.
- **Consume:** `PersonCreated`, `EventCreated`, `ContractSigned`, `PaymentReceived` como señales de contexto.

### 7.16 CMS

- **Propósito:** administrar contenido editorial y publicación pública autorizada.
- **Propietario de:** Content, Page, publicación, taxonomía editorial y SEO.
- **Límite:** no convierte automáticamente Events o Media en contenido público.
- **Dependencias permitidas:** MEDIA, EVENTS mediante proyecciones autorizadas, PEOPLE para autoría.
- **Dependencias prohibidas:** acceso a medios privados sin autorización.
- **Publica:** `ContentPublished`, `ContentUnpublished`, `ContentScheduled`.
- **Consume:** `MediaAssetRegistered` y señales explícitas de autorización de publicación.

### 7.17 NOTIFICATIONS

- **Propósito:** entregar comunicaciones por canales configurados.
- **Propietario de:** Notification, DeliveryAttempt, template de comunicación y resultado.
- **Límite:** no decide por sí mismo cuándo una regla de negocio debe ocurrir.
- **Dependencias permitidas:** PEOPLE, SETTINGS y proveedores externos encapsulados.
- **Dependencias prohibidas:** modificación del módulo que originó el mensaje.
- **Publica:** `NotificationQueued`, `NotificationDelivered`, `NotificationFailed`.
- **Consume:** eventos autorizados de todos los dominios que requieran comunicación.

### 7.18 CLIENT PORTAL

- **Propósito:** componer una experiencia externa segura para Participants.
- **Propietario de:** preferencias específicas de experiencia y sesiones de portal cuando corresponda.
- **Límite:** no es propietario de Event, Gallery, Contract, Payment ni Deliverable.
- **Dependencias permitidas:** AUTH, PEOPLE, PERMISSIONS, EVENTS, CONTRACTS, PAYMENTS, GALLERY, DELIVERABLES, INVITATIONS.
- **Dependencias prohibidas:** acceso directo a bases de datos de dominio.
- **Publica:** acciones del usuario como solicitudes o aprobaciones dirigidas al módulo propietario.
- **Consume:** proyecciones y eventos de publicación/visibilidad.

### 7.19 BACKOFFICE

- **Propósito:** componer la operación interna de TECNOJACK.
- **Propietario de:** configuración de interfaz, no datos del negocio.
- **Límite:** es una capa de experiencia.
- **Dependencias permitidas:** APIs públicas de todos los módulos autorizados.
- **Dependencias prohibidas:** acceso directo a persistencia o reglas duplicadas.
- **Publica:** comandos dirigidos a módulos propietarios.
- **Consume:** proyecciones, permisos y eventos necesarios para actualizar la experiencia.

### 7.20 SETTINGS

- **Propósito:** administrar configuración funcional permitida.
- **Propietario de:** SettingDefinition, valor, alcance y versión.
- **Límite:** secretos e invariantes estructurales no son settings editables.
- **Dependencias permitidas:** AUDIT, PERMISSIONS.
- **Dependencias prohibidas:** modificación directa del dominio al cambiar un valor.
- **Publica:** `SettingChanged`.
- **Consume:** registro de definiciones de módulos.

### 7.21 AUTOMATION

- **Propósito:** reaccionar a eventos y solicitar acciones repetibles.
- **Propietario de:** AutomationRule, Trigger, ActionRequest y ejecución.
- **Límite:** no evita autorización ni modifica tablas ajenas.
- **Dependencias permitidas:** eventos públicos y comandos autorizados de módulos.
- **Dependencias prohibidas:** acceso directo a persistencia y lógica duplicada.
- **Publica:** `AutomationTriggered`, `AutomationCompleted`, `AutomationFailed`.
- **Consume:** Domain Events registrados explícitamente.

### 7.22 ANALYTICS

- **Propósito:** producir métricas, tendencias y modelos de lectura.
- **Propietario de:** definiciones de métricas y proyecciones analíticas regenerables.
- **Límite:** no es fuente de verdad operacional.
- **Dependencias permitidas:** eventos y APIs de lectura autorizadas.
- **Dependencias prohibidas:** modificación de dominios fuente.
- **Publica:** resultados programados o alertas analíticas futuras.
- **Consume:** eventos relevantes de todos los dominios.

### 7.23 STORAGE

- **Propósito:** abstraer persistencia y recuperación de objetos binarios.
- **Propietario de:** StorageObjectKey, ubicación técnica, integridad y operaciones de almacenamiento.
- **Límite:** no conoce Event, Gallery, Contract ni significado de negocio del archivo.
- **Dependencias permitidas:** proveedor configurado mediante `StorageProvider`.
- **Dependencias prohibidas:** lógica de dominio y dependencia expuesta hacia R2, S3, Azure Blob o MinIO.
- **Publica:** `StorageObjectCreated`, `StorageObjectDeleted`, `StorageOperationFailed`.
- **Consume:** solicitudes autorizadas principalmente de MEDIA y módulos documentales.

### 7.24 AUDIT

- **Propósito:** conservar evidencia de acciones sensibles.
- **Propietario de:** AuditRecord inmutable.
- **Límite:** no sustituye el historial funcional de cada dominio.
- **Dependencias permitidas:** identidad de actor y eventos auditables.
- **Dependencias prohibidas:** mutación de recursos auditados.
- **Publica:** alertas futuras de integridad o seguridad.
- **Consume:** acciones y Domain Events clasificados como auditables.

---

## 8. Mapa de dependencias

```text
                       ┌──────────── EXPERIENCE ────────────┐
                       │ BACKOFFICE · CLIENT PORTAL · CMS   │
                       └────────────────┬───────────────────┘
                                        │ APIs / projections
                                        ▼
┌──────── COMMERCIAL ────────┐    ┌──────── CORE ─────────────────────┐
│ CRM ──► EVENTS             │    │ EVENTS ──► PRODUCTION             │
│      └─► PEOPLE            │    │    ├────► MEDIA ───► STORAGE      │
│ CONTRACTS ─► EVENTS/PEOPLE │    │    ├────► GALLERY                 │
│ PAYMENTS ─► CONTRACTS      │    │    └────► DELIVERABLES            │
└────────────────────────────┘    └───────────────────────────────────┘
                │                            │
                └──────────────┬─────────────┘
                               ▼
               NOTIFICATIONS · AUTOMATION · ANALYTICS
                               │
                               ▼
       AUTH · USERS · ROLES · PERMISSIONS · SETTINGS · AUDIT · SYSTEM
```

Las flechas significan uso de una capacidad pública, no ownership ni acceso a tablas.

### 8.1 Reglas anticiclo

1. Un módulo no accede a repositorios privados de otro.
2. Una dependencia inversa se resuelve mediante eventos, proyecciones o un contrato público neutral.
3. BACKOFFICE y CLIENT PORTAL solo componen APIs.
4. ANALYTICS y AUDIT consumen; no gobiernan dominios fuente.
5. STORAGE no conoce el significado del objeto almacenado.
6. NOTIFICATIONS no llama al módulo origen para cambiar su estado.
7. AUTOMATION solicita comandos públicos y se somete a las mismas reglas.

---

## 9. Ownership Matrix

Leyenda: **O** propietario/crea/modifica, **C** consulta mediante capacidad pública, **P** proyecta, **—** sin acceso ordinario.

| Dato | Propietario | Puede modificar | Consulta autorizada | Nunca accede directamente |
|---|---|---|---|---|
| Credenciales y sesiones | AUTH | AUTH | SYSTEM/AUDIT de forma limitada | Dominios de negocio |
| Cuenta de usuario | USERS | USERS | AUTH, ROLES, PERMISSIONS | Módulos mediante tablas |
| Persona/organización | PEOPLE | PEOPLE | CRM, EVENTS, contratos, portal | STORAGE |
| Lead/Opportunity | CRM | CRM | BACKOFFICE, ANALYTICS | MEDIA/GALLERY |
| Event | EVENTS | EVENTS | Módulos dependientes y experiencias | Otros repositorios |
| EventSession | EVENTS | EVENTS | PRODUCTION, MEDIA, portal autorizado | PAYMENTS |
| Contract | CONTRACTS | CONTRACTS | EVENTS, PAYMENTS, portal | GALLERY/MEDIA |
| Payment | PAYMENTS | PAYMENTS | CONTRACTS, EVENTS, portal limitado | MEDIA/CMS |
| ProductionPlan/Assignment | PRODUCTION | PRODUCTION | EVENTS, BACKOFFICE | PAYMENTS |
| MediaAsset | MEDIA | MEDIA | GALLERY, DELIVERABLES, CMS autorizado | CRM |
| Bytes/StorageObject | STORAGE | STORAGE | MEDIA mediante proveedor abstracto | UI y dominios comerciales |
| Gallery | GALLERY | GALLERY | EVENTS, portal, DELIVERABLES | PAYMENTS |
| Deliverable | DELIVERABLES | DELIVERABLES | EVENTS, contratos, portal | AUTH |
| Invitation | INVITATIONS | INVITATIONS | EVENTS, portal | PAYMENTS |
| Notification | NOTIFICATIONS | NOTIFICATIONS | módulo origen y AUDIT limitado | MEDIA bruto |
| Content editorial | CMS | CMS | sitio público/BackOffice | PAYMENTS |
| Setting | SETTINGS | SETTINGS | módulos autorizados | cliente externo sin permiso |
| AutomationRule | AUTOMATION | AUTOMATION | BackOffice/AUDIT | tablas de dominio |
| Projection analítica | ANALYTICS | ANALYTICS | BackOffice autorizado | flujo operacional como fuente |
| AuditRecord | AUDIT | AUDIT por append | seguridad/administración | usuarios ordinarios |

---

## 10. Flujo completo del negocio

```text
Contacto inicial
      │
      ▼
PEOPLE identifica persona/organización
      │
      ▼
CRM registra Lead y seguimiento
      │
      ▼
Lead calificado → Opportunity
      │
      ▼
EVENTS crea el expediente Event
      │
      ├── Participants y roles mediante PEOPLE
      ├── EventSessions y planificación
      └── Brief y alcance inicial
      │
      ▼
CONTRACTS formaliza alcance y obligaciones
      │
      ▼
PAYMENTS registra anticipo u obligación inicial
      │
      ▼
PRODUCTION planifica equipo, recursos y ejecución
      │
      ▼
EventSessions se ejecutan
      │
      ▼
MEDIA registra, valida y procesa Media Assets
      │
      ├── GALLERY permite revisión/selección
      └── DELIVERABLES compone resultados comprometidos
      │
      ▼
Participantes revisan o aprueban mediante CLIENT PORTAL
      │
      ▼
DELIVERABLES registra entrega y aceptación
      │
      ▼
PAYMENTS confirma saldo y CONTRACTS resuelve obligaciones
      │
      ▼
EVENTS completa, cierra y posteriormente archiva
```

NOTIFICATIONS acompaña los puntos de comunicación. AUTOMATION puede coordinar acciones repetibles. AUDIT registra operaciones sensibles. ANALYTICS deriva métricas sin intervenir en el flujo.

El flujo admite excepciones: un Event puede crearse antes de una Opportunity formal, un Contract puede tener adendas, una Production puede requerir nuevas EventSessions y una entrega puede regresar a revisión. Cada excepción se resuelve en el módulo propietario.

---

## 11. Mapa de integraciones

| Origen | Destino | Interacción |
|---|---|---|
| CRM | PEOPLE | Crear o vincular identidad |
| CRM | EVENTS | Solicitar creación o vincular Event a Opportunity |
| EVENTS | PEOPLE | Resolver Participants y roles, cuando exista esa capacidad |
| CONTRACTS | EVENTS | Referenciar Event y consultar contexto permitido |
| CONTRACTS | PEOPLE | Resolver partes contractuales |
| PAYMENTS | CONTRACTS | Crear obligaciones derivadas |
| PRODUCTION | EVENTS | Planificar desde EventSessions confirmadas |
| MEDIA | EVENTS | Asociar activos con Event y EventSession |
| MEDIA | STORAGE | Persistir y recuperar bytes mediante StorageProvider |
| GALLERY | MEDIA | Curar referencias a Media Assets |
| DELIVERABLES | CONTRACTS | Derivar compromisos acordados |
| DELIVERABLES | MEDIA/GALLERY | Componer y publicar entrega |
| CLIENT PORTAL | módulos propietarios | Consultar o emitir comandos autorizados |
| NOTIFICATIONS | PEOPLE | Resolver destinatarios y preferencias |
| AUTOMATION | módulos propietarios | Solicitar comandos públicos después de un trigger |
| ANALYTICS | eventos/proyecciones | Construir métricas regenerables |
| AUDIT | todos | Registrar acciones clasificadas como sensibles |

---

## 12. Eventos de dominio globales

Los nombres expresan hechos pasados. El payload público debe ser mínimo, versionado y no contener secretos ni datos personales innecesarios.

| Dominio | Eventos principales |
|---|---|
| AUTH/USERS | `UserCreated`, `UserAuthenticated`, `SessionRevoked`, `UserDisabled` |
| PEOPLE | `PersonCreated`, `PersonUpdated`, `PersonMerged`, `OrganizationCreated` |
| CRM | `LeadCreated`, `LeadQualified`, `OpportunityWon`, `OpportunityLost` |
| EVENTS | `EventCreated`, `EventActivated`, `EventSessionConfirmed`, `EventProductionPhaseChanged`, `EventCompleted`, `EventCancelled`, `EventClosed` |
| CONTRACTS | `ContractCreated`, `ContractSent`, `ContractSigned`, `ContractCancelled` |
| PAYMENTS | `PaymentRequested`, `PaymentReceived`, `PaymentFailed`, `PaymentRefunded`, `BalanceSettled` |
| PRODUCTION | `ProductionPlanCreated`, `TeamMemberAssigned`, `ProductionStarted`, `ProductionCompleted` |
| MEDIA | `MediaAssetRegistered`, `MediaAssetUploaded`, `MediaProcessingCompleted`, `MediaAssetRejected` |
| GALLERY | `GalleryCreated`, `GalleryPublished`, `GallerySelectionSubmitted` |
| DELIVERABLES | `DeliverableDefined`, `DeliverableReady`, `DeliverableDelivered`, `DeliverableApproved` |
| INVITATIONS | `InvitationPublished`, `InvitationSent`, `InvitationConfirmed`, `InvitationDeclined` |
| CMS | `ContentPublished`, `ContentUnpublished` |
| NOTIFICATIONS | `NotificationQueued`, `NotificationDelivered`, `NotificationFailed` |
| AUTOMATION | `AutomationTriggered`, `AutomationCompleted`, `AutomationFailed` |
| STORAGE | `StorageObjectCreated`, `StorageObjectDeleted`, `StorageOperationFailed` |

### Reglas globales

- Un evento describe algo que ya ocurrió.
- Solo el módulo propietario lo publica.
- Consumidores no dependen de campos internos no contractuales.
- La evolución incompatible requiere nueva versión de contrato.
- El procesamiento repetido debe ser idempotente.
- Un evento no concede permiso para violar invariantes del consumidor.
- Timeline, Analytics y Audit pueden consumir eventos sin adquirir ownership.

---

## 13. APIs públicas por módulo

Esta sección define familias de capacidades, no rutas técnicas definitivas.

| Módulo | Capacidades públicas |
|---|---|
| AUTH | iniciar, renovar y revocar sesión; validar identidad autenticada |
| USERS | crear, activar, desactivar y consultar cuentas |
| ROLES/PERMISSIONS | administrar roles, grants y resolver autorización |
| PEOPLE | crear, buscar, actualizar y vincular personas/organizaciones |
| CRM | administrar Leads, Opportunities y actividades comerciales |
| EVENTS | administrar Events, EventSessions, estados, tipos y proyecciones |
| CONTRACTS | crear, versionar, enviar, firmar, cancelar y consultar Contracts |
| PAYMENTS | crear obligaciones, registrar movimientos y consultar estado financiero |
| PRODUCTION | planificar, asignar, ejecutar y completar producción |
| MEDIA | registrar, cargar, procesar y consultar Media Assets |
| GALLERY | crear, curar, publicar y recibir selecciones |
| DELIVERABLES | definir, preparar, entregar y aprobar entregables |
| INVITATIONS | diseñar, publicar, distribuir y registrar confirmaciones |
| CMS | administrar y publicar contenido autorizado |
| NOTIFICATIONS | solicitar, consultar y reintentar comunicaciones |
| SETTINGS | consultar y cambiar configuración permitida |
| AUTOMATION | definir, activar y observar reglas automáticas |
| ANALYTICS | consultar métricas y reportes autorizados |
| STORAGE | operaciones internas de objetos mediante StorageProvider |
| AUDIT | consultar evidencia bajo permiso restringido |
| SYSTEM | salud, versión, diagnóstico y configuración efectiva segura |

BACKOFFICE y CLIENT PORTAL consumen estas capacidades; no ofrecen APIs de dominio alternativas.

---

## 14. Roadmap arquitectónico

### Etapa 0 — Fundación técnica

**Módulos:** SYSTEM, AUTH, USERS, ROLES, PERMISSIONS, SETTINGS, AUDIT y STORAGE contractualmente.

**Justificación:** toda capacidad posterior necesita identidad, autorización, configuración, observabilidad y trazabilidad. STORAGE comienza como contrato porque MEDIA no debe acoplarse a un proveedor.

### Etapa 1 — Identidad del negocio y núcleo

**Módulos:** PEOPLE y EVENTS.

**Justificación:** People evita duplicar identidades en CRM, Contracts y Portal. Events establece el expediente central y el lenguaje alrededor del cual se conectan los demás módulos.

### Etapa 2 — Operación interna mínima

**Módulos:** PRODUCTION básico, NOTIFICATIONS y BACKOFFICE inicial.

**Justificación:** permite planificar y operar Events reales. BackOffice aparece como composición después de que existan capacidades, no antes.

### Etapa 3 — Formalización comercial y financiera

**Módulos:** CRM, CONTRACTS y PAYMENTS.

**Justificación:** CRM se apoya en PEOPLE y puede originar Events; Contracts necesita Event y partes; Payments necesita obligaciones contractuales claras.

### Etapa 4 — Cadena audiovisual

**Módulos:** MEDIA, implementación de STORAGE, GALLERY y DELIVERABLES.

**Justificación:** MEDIA requiere Events y sesiones; Gallery requiere Media; Deliverables requiere alcance contractual y activos disponibles.

### Etapa 5 — Experiencia externa

**Módulos:** CLIENT PORTAL e INVITATIONS.

**Justificación:** el portal solo aporta valor cuando existen Events, People, Contracts, Payments, Galleries o Deliverables que exponer con seguridad.

### Etapa 6 — Publicación y crecimiento

**Módulos:** CMS, AUTOMATION y ANALYTICS.

**Justificación:** se automatizan procesos ya comprendidos y se analizan datos confiables. Implementarlos antes produciría reglas y métricas sobre dominios inestables.

### Regla de avance

Una etapa no exige finalizar todo el alcance imaginable de la anterior. Exige que sus contratos, ownership e invariantes necesarios estén estables.

---

## 15. Riesgos arquitectónicos

| Riesgo | Consecuencia | Prevención |
|---|---|---|
| Event se convierte en objeto gigante | Alto acoplamiento y cambios peligrosos | Ownership por módulo y referencias por EventId |
| Duplicación de personas | Contratos, pagos y portal inconsistentes | PEOPLE como fuente única de identidad |
| Acceso cruzado a tablas | Dependencias invisibles y ciclos | APIs internas, eventos y revisiones arquitectónicas |
| BackOffice contiene reglas | Backend y UI divergen | Reglas exclusivamente en módulos propietarios |
| Client tratado como entidad universal | Modelo incapaz de representar múltiples roles | Client como rol contextual de People/CRM |
| Storage acoplado a proveedor | Migración costosa y vendor lock-in | StorageProvider y STORAGE sin semántica de negocio |
| Media y Gallery confundidos | Duplicación de archivos y estados | MEDIA posee activos; GALLERY posee curaduría |
| Timeline como fuente de verdad | Datos duplicados y divergentes | Proyección derivada con referencias de origen |
| Automatizaciones con acceso privilegiado | Saltos de reglas y daños masivos | Comandos públicos, permisos e idempotencia |
| Eventos de dominio sin gobierno | Contratos frágiles y consumidores rotos | Catálogo, versionado y ownership de publicación |
| Analítica sobre base operacional | Degradación y acoplamiento | Proyecciones regenerables y consultas controladas |
| Permisos solo por rol | Fugas entre Events o participantes | Permiso más scope y validación del propietario |
| Exposición de medios privados | Riesgo legal y reputacional | Visibilidad explícita, URLs temporales y auditoría |
| Plantillas retroactivas | Events históricos cambian inesperadamente | Copia y versión al instanciar |
| Borrado indiscriminado | Pérdida de evidencia | Retención, archivo y eliminación restringida |
| Roadmap guiado por pantallas | Dominios incoherentes | Construir ownership y capacidades antes de experiencias |

---

## 16. Decisiones arquitectónicas oficiales

### Gobierno del registro

- Formato de identificador: `ADR-NNN`.
- Estados: `Proposed`, `Accepted`, `Superseded`, `Deprecated`, `Rejected`.
- Un ADR aceptado no se edita para cambiar su significado; se crea otro que lo reemplace.
- El siguiente identificador disponible después de esta versión es **ADR-024**.

### ADR-001 — Event es el Aggregate Root principal

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** El negocio coordina personas, contratos, pagos, producción, medios y entregas alrededor de un trabajo audiovisual identificable.
- **Decisión:** Event será el Aggregate Root principal y la referencia central de los módulos audiovisuales.
- **Consecuencias:** Los módulos dependientes referencian EventId; Event debe permanecer enfocado y no absorber sus datos internos.

### ADR-002 — La plataforma comienza como monolito modular

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** TECNOJACK necesita crecer con un equipo pequeño sin asumir la operación distribuida de microservicios.
- **Decisión:** La plataforma se implementará como monolito modular, sin microservicios ni Kubernetes iniciales.
- **Consecuencias:** Despliegue y transacciones más simples; los límites deberán protegerse mediante disciplina, contratos y pruebas.

### ADR-003 — PEOPLE es propietario de la identidad de negocio

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Una persona u organización puede ser lead, contratante, participante, contacto, responsable financiero o colaborador en diferentes contextos.
- **Decisión:** PEOPLE será la fuente de verdad para Person, Organization y ContactPoint.
- **Consecuencias:** Otros módulos referencian identidades de PEOPLE y conservan únicamente roles o relaciones contextuales; será necesaria deduplicación y fusión controlada.

### ADR-004 — Client es un rol, no una dependencia directa de Event

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Un Event involucra múltiples personas con responsabilidades diferentes y no existe siempre un único cliente.
- **Decisión:** Event no tendrá una relación directa con Client. La condición comercial se resolverá mediante PEOPLE, CRM y Participation.
- **Consecuencias:** El modelo representa múltiples participantes correctamente; las consultas por cliente requerirán integración o proyecciones.

### ADR-005 — Ownership único por módulo

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** La modificación cruzada de datos genera acoplamiento, ciclos y reglas contradictorias.
- **Decisión:** Cada dato tendrá un único módulo propietario; ningún otro módulo escribirá directamente en su persistencia.
- **Consecuencias:** Las integraciones usan capacidades públicas o eventos; algunas operaciones requerirán coordinación y consistencia eventual controlada.

### ADR-006 — MEDIA es propietario de los activos digitales

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Fotografías, videos y variantes necesitan identidad, metadatos y ciclo de procesamiento independientes de su presentación.
- **Decisión:** MEDIA será propietario de MediaAsset; GALLERY y DELIVERABLES referenciarán activos sin poseerlos.
- **Consecuencias:** Se evita duplicación de archivos y metadatos; MEDIA deberá ofrecer contratos eficientes de consulta y autorización.

### ADR-007 — STORAGE es infraestructura genérica y agnóstica del proveedor

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Los bytes pueden residir en R2, S3, Azure Blob, MinIO u otro proveedor, y esa elección puede cambiar.
- **Decisión:** STORAGE expondrá `StorageProvider` y no conocerá significado de negocio.
- **Consecuencias:** Se reduce vendor lock-in; MEDIA debe conservar la semántica y STORAGE la operación física.

### ADR-008 — Timeline es una proyección derivada

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** La cronología combina sesiones, estados, pagos, entregas y actividades pertenecientes a distintas fuentes.
- **Decisión:** Timeline será una proyección y no una fuente de verdad autónoma.
- **Consecuencias:** Puede regenerarse y respetar ownership; requiere ordenamiento, visibilidad y contratos de proyección consistentes.

### ADR-009 — EventSession es el término temporal oficial

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Un Event puede tener varias etapas operativas con propósito, fecha y lugar propios.
- **Decisión:** `EventSession` será el término global para esas etapas.
- **Consecuencias:** Backend, frontend, Figma, API y documentación usarán el mismo nombre; términos anteriores quedan retirados.

### ADR-010 — El brief forma parte de Event

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** El brief no tiene identidad ni ciclo de vida independiente del Event.
- **Decisión:** El brief será un objeto de valor integrado en Event.
- **Consecuencias:** Menor ceremonia y consistencia directa; si surge colaboración o versionado complejo, una ADR futura podrá revisar el límite.

### ADR-011 — Location es reutilizable

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Iglesias, hoteles, estudios y empresas aparecen en múltiples Events.
- **Decisión:** Location tendrá identidad reutilizable y su contexto específico se almacenará en la asociación con EventSession.
- **Consecuencias:** Se evita duplicación; deben separarse cuidadosamente datos globales e instrucciones contextuales.

### ADR-012 — EventType provee plantillas versionadas no retroactivas

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Tipos como Wedding o Music Video comparten sesiones, checklists y workflow inicial, pero cada Event debe poder adaptarse.
- **Decisión:** EventType podrá ofrecer plantillas que se copian y versionan al crear Event.
- **Consecuencias:** Los Events históricos no cambian automáticamente; se necesita trazabilidad de la versión aplicada.

### ADR-013 — Timeline y Analytics no son fuentes operacionales

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Las vistas agregadas pueden divergir si adquieren ownership de datos operativos.
- **Decisión:** Timeline y ANALYTICS producirán proyecciones regenerables y de solo lectura respecto de los dominios fuente.
- **Consecuencias:** La lectura transversal es flexible; la latencia o consistencia eventual debe comunicarse cuando exista.

### ADR-014 — Interfaces de experiencia no poseen el dominio

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** BackOffice, Client Portal y CMS-facing UI necesitan componer múltiples capacidades.
- **Decisión:** BACKOFFICE y CLIENT PORTAL serán capas de experiencia y no modificarán persistencia ni duplicarán reglas.
- **Consecuencias:** Las reglas permanecen consistentes entre canales; los módulos deberán proporcionar APIs adecuadas para composición.

### ADR-015 — Las automatizaciones usan comandos públicos

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Una automatización con acceso directo podría omitir autorización, validaciones e invariantes.
- **Decisión:** AUTOMATION reaccionará a eventos y solicitará acciones mediante las mismas capacidades públicas gobernadas.
- **Consecuencias:** Mayor seguridad y trazabilidad; las acciones deberán ser idempotentes y expresar claramente el actor automático.

### ADR-016 — Las decisiones arquitectónicas se registran como ADR

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Las listas de decisiones no explican por qué se eligió una alternativa ni qué compromisos generó.
- **Decisión:** Toda decisión importante se registrará automáticamente en este capítulo con identificador, contexto, decisión y consecuencias.
- **Consecuencias:** El Blueprint crecerá como memoria arquitectónica; cada cambio deberá mantener numeración, estado y relación de reemplazo.

### ADR-017 — El repositorio comienza como una aplicación única en modo estándar

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** El producto tiene un único backend desplegable y crear `apps/`, `packages/` o un workspace introduciría estructura sin un segundo consumidor real.
- **Decisión:** `tecnojack-api` utilizará una aplicación NestJS en la raíz con `src/`, sin monorepo inicial.
- **Consecuencias:** La navegación y el tooling permanecen simples; si aparece otra aplicación o paquete independiente, la migración a workspace requerirá un ADR.

### ADR-018 — La organización física principal será por módulo de dominio

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Agrupar globalmente controllers, services o repositories dispersaría cada dominio y ocultaría su ownership.
- **Decisión:** El código de negocio se organizará bajo `src/modules/<module>/`, manteniendo juntas sus responsabilidades.
- **Consecuencias:** Los cambios de una capacidad se localizan con facilidad; los elementos técnicos globales deberán demostrar que pertenecen a `platform/` o `shared/`.

### ADR-019 — Los módulos exponen una única superficie pública

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Los imports profundos entre módulos crean acoplamiento con entidades, repositorios e implementaciones internas.
- **Decisión:** Otro módulo solo podrá importar `modules/<module>/public`; las demás carpetas son privadas.
- **Consecuencias:** Los contratos entre módulos serán explícitos y comprobables; será necesario diseñar facades, eventos y read models mínimos.

### ADR-020 — `shared/` y `platform/` tienen significados distintos

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Carpetas como `common`, `core` y `utils` suelen mezclar primitivas, frameworks y lógica sin owner.
- **Decisión:** `shared/` contendrá primitivas estables agnósticas de frameworks; `platform/` contendrá infraestructura técnica reutilizable. No existirán carpetas globales ambiguas.
- **Consecuencias:** Las dependencias permanecen dirigidas y navegables; extraer algo a shared exigirá múltiples consumidores reales y semántica idéntica.

### ADR-021 — Prisma utilizará esquema multiarchivo y migraciones centralizadas

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Un único archivo de esquema crecería con todos los dominios, mientras separar historiales de migración rompería el orden real de una base compartida.
- **Decisión:** Los modelos Prisma se agruparán por módulo propietario dentro de `prisma/schema/`, con una sola historia cronológica en `prisma/migrations/`.
- **Consecuencias:** El ownership será visible sin simular bases independientes; las relaciones cruzadas exigirán coordinación y las migraciones conservarán orden global.

### ADR-022 — La estructura interna de módulos será proporcional

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Una Clean Architecture completamente ceremonial produciría carpetas y abstracciones vacías en módulos sencillos.
- **Decisión:** Los módulos dispondrán de ubicaciones oficiales para public, domain, application, infrastructure y presentation, pero solo crearán carpetas cuando exista contenido real.
- **Consecuencias:** Se conserva una dirección de dependencias común sin imponer archivos inútiles; las revisiones deberán vigilar que simplicidad no se convierta en mezcla de responsabilidades.

### ADR-023 — Las pruebas unitarias se co-localizan y las pruebas de sistema se centralizan

- **Estado:** Accepted
- **Fecha:** 2026-08-10
- **Contexto:** Duplicar todo `src/` en `tests/unit/` dificulta navegación, mientras integración y E2E necesitan infraestructura compartida y límites claros.
- **Decisión:** Las pruebas unitarias vivirán junto al código; integración, contratos y E2E vivirán bajo `tests/`.
- **Consecuencias:** Las unidades son fáciles de localizar y mover; el soporte transversal de pruebas queda aislado de producción.

---

## 17. Conformidad y evolución

Un nuevo módulo o especificación será conforme cuando:

- Declare ownership, límites y capacidades públicas.
- Respete el mapa de dependencias.
- No lea ni escriba persistencia ajena.
- Use el lenguaje ubicuo global.
- Catalogue los eventos que publica y consume.
- Defina permisos y alcance de acceso.
- Identifique riesgos de privacidad y retención.
- Añada un ADR al Blueprint si introduce una decisión transversal.

Las revisiones del Blueprint incrementarán su versión. Los ADR conservan identidad permanente entre versiones.

---

## 18. Documentos relacionados

- `DISENO_DOMINIO_EVENTS.md` — Events Domain Design v2, especificación detallada y oficial de EVENTS.
- `PROPUESTA_ARQUITECTURA.md` — propuesta de infraestructura aprobada como antecedente técnico; no gobierna el dominio por encima de este Blueprint.

---

## 19. Autoridad final

TECNOJACK Platform Blueprint v1 es la referencia arquitectónica principal de la plataforma.

Los futuros documentos de PEOPLE, CONTRACTS, PAYMENTS, MEDIA, GALLERY, DELIVERABLES y demás dominios deberán alinearse con este Blueprint. Toda excepción o cambio transversal requerirá una decisión explícita registrada mediante ADR.
