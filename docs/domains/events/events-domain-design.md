# Events Domain Design v2

## Especificación oficial del dominio EVENTS de TECNOJACK

**Estado:** Aprobado como especificación oficial  
**Versión:** 2.0  
**Dominio:** EVENTS  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 10 de agosto de 2026

---

## 1. Propósito del documento

Este documento define el lenguaje, los límites, las reglas y el modelo oficial del dominio EVENTS de TECNOJACK. Será la referencia para sus implementaciones posteriores en Prisma, NestJS, Angular, Figma y cualquier integración de la plataforma.

Todas las implementaciones deberán respetar las definiciones y límites aquí establecidos. Un cambio que contradiga esta especificación deberá tratarse primero como una nueva decisión de dominio y producir una versión posterior del documento.

Este documento especifica el dominio. No prescribe código, tablas, componentes visuales ni detalles internos de un framework.

---

## 2. Principio rector

### Event es el Aggregate Root principal del negocio

Toda la plataforma TECNOJACK gira alrededor de `Event`.

El centro del negocio no es Client, Contract, Gallery ni Payment. Es el Evento para el cual se coordinan personas, servicios, sesiones, producción, obligaciones, medios y entregas.

Un Event representa el expediente operativo completo de un trabajo audiovisual, no solamente una fecha del calendario.

Ejemplos:

- Una boda.
- Una fiesta de quince años.
- Un grado.
- Un evento corporativo.
- Una sesión fotográfica.
- Un video musical.
- Una producción de video.
- Una campaña de contenido para redes.
- Cualquier proyecto audiovisual delimitado.

Los módulos dependientes se conectarán con Event mediante su identidad estable, pero conservarán la propiedad de sus propios datos y reglas. Event coordina el contexto del negocio sin convertirse en una entidad gigante que almacene toda la plataforma.

---

## 3. TECNOJACK Ubiquitous Language

Este capítulo establece el lenguaje oficial que debe utilizarse de forma consistente en negocio, diseño, backend, frontend, base de datos, documentación y conversaciones del equipo.

### 3.1 Event

Expediente central de un proyecto audiovisual. Agrupa su identidad, clasificación, estado, fase productiva, prioridad, fechas generales, brief y sesiones. Es el Aggregate Root principal del dominio de TECNOJACK.

Un Event puede existir antes de conocer todas sus personas, fechas, contratos o pagos.

### 3.2 Event Type

Definición reutilizable de una clase de Evento, por ejemplo Wedding, Graduation, Music Video o Corporate. Además de clasificar, puede proporcionar plantillas iniciales de sesiones, checklists, workflow y configuración.

### 3.3 Event Session

Etapa temporal importante dentro de un Evento. Representa una sesión, jornada o bloque operativo con propósito propio, fecha, duración, estado y locaciones.

Ejemplos: Bride Preparation, Ceremony, Reception, Recording Day 1 o Photo Session.

El término oficial es exclusivamente `EventSession`.

### 3.4 Participant

Persona u organización relacionada con un Evento mediante un rol contextual. Una misma persona puede cumplir varios roles y participar en múltiples eventos.

Ejemplos de roles: contratante, novia, novio, padre, madre, wedding planner, responsable financiero, cantante, modelo, productor o contacto principal.

Participant será provisto posteriormente por la integración entre EVENTS y PEOPLE. No es una entidad implementada dentro de EVENTS.

### 3.5 Client

Rol comercial que una persona u organización puede desempeñar respecto de un Evento o de una relación con TECNOJACK. Client no es la raíz del Evento y Event no conserva una dependencia directa hacia una entidad Client.

La condición de cliente será resuelta en el futuro por PEOPLE y CRM, según el contexto comercial correspondiente.

### 3.6 Contact

Persona o canal utilizado para comunicarse en un contexto específico. Contact no equivale necesariamente a Client ni a Participant principal. Los datos y preferencias de contacto pertenecerán a PEOPLE o CRM.

### 3.7 Location

Lugar físico o virtual reutilizable donde ocurre una EventSession o una actividad relacionada. Una misma Location puede utilizarse en diferentes Events.

Ejemplos: iglesia, hotel, salón, hacienda, estudio, empresa o locación exterior.

### 3.8 Gallery

Colección curada de elementos visuales vinculada a un Event. Puede destinarse a selección, revisión, entrega, publicación privada o publicación autorizada. Pertenece al futuro módulo GALLERY.

### 3.9 Deliverable

Resultado comprometido o producido para un Event. Puede ser un álbum, video, conjunto de fotografías, enlace, archivo, pieza para redes o cualquier entrega verificable. Pertenece al futuro módulo DELIVERABLES.

### 3.10 Contract

Acuerdo formal relacionado con un Event que define alcance, obligaciones, derechos, condiciones y aceptación. Pertenece al futuro módulo CONTRACTS.

### 3.11 Payment

Registro de una obligación o movimiento financiero relacionado con un Event o Contract. Puede representar anticipo, abono, saldo, reembolso u otro movimiento. Pertenece al futuro módulo PAYMENTS.

### 3.12 Checklist

Lista contextual de verificaciones o tareas asociada a un Event. Un Event puede tener múltiples Checklists, y cada Checklist contiene Items completables.

Ejemplos: producción, postproducción, entrega y administrativo.

### 3.13 Timeline

Vista cronológica unificada de hechos relevantes de un Event. Puede derivarse de sesiones, cambios de estado, hitos, entregas, pagos y actividades, sin requerir una entidad persistente propia.

### 3.14 Invitation

Invitación física o digital vinculada a un Event, con contenido, destinatarios, publicación y seguimiento propios. Pertenece al futuro módulo INVITATIONS.

### 3.15 Team Member

Persona interna o colaboradora asignada a una responsabilidad de producción dentro de un Event o EventSession. Su identidad y asignación pertenecerán a PEOPLE o PRODUCTION.

### 3.16 Media Asset

Archivo audiovisual individual administrado por la plataforma: fotografía, video, audio, miniatura, proxy, original o versión procesada. Pertenece al futuro módulo MEDIA y se almacena mediante `StorageProvider`.

### 3.17 Tag

Etiqueta reutilizable que clasifica Events sin crear columnas específicas. Ejemplos: Drone, Premium, VIP, Instagram, Urgente, Internacional, Fotografía y Video.

### 3.18 Milestone

Hito significativo en la evolución de un Event que puede aparecer en Timeline, por ejemplo aprobación creativa, finalización del rodaje o entrega final.

### 3.19 Production Phase

Etapa operativa actual del Event dentro del proceso audiovisual: planificación, preproducción, producción, postproducción, revisión o entrega.

### 3.20 Lifecycle Status

Condición administrativa general del expediente Event: borrador, activo, completado, cancelado, cerrado o archivado.

---

## 4. Límites del dominio EVENTS

EVENTS es propietario de:

- Identidad y código del Event.
- Nombre y clasificación.
- Estado del ciclo de vida.
- Fase de producción.
- Estado de fechas.
- Prioridad.
- Brief integrado.
- Fechas generales.
- EventSessions.
- Historial funcional de estados.
- Asociación conceptual con Tags.
- Reglas de transición.
- Referencias a Locations utilizadas.
- Proyecciones básicas del Event.

EVENTS no es propietario de:

- Personas, organizaciones o datos de contacto.
- Clientes como entidad independiente.
- Contratos.
- Pagos.
- Archivos multimedia.
- Galerías.
- Entregables.
- Invitaciones.
- Notificaciones.
- Personal o equipos asignados.
- Procesamiento de fotografías o videos.
- Operaciones de CRM.
- Contenido público del CMS.

### Regla de dependencia

Los módulos dependientes pueden referenciar `eventId`. Event no incorporará sus modelos internos ni leerá directamente sus tablas. Cuando una regla de Event dependa de información externa, se consultará una capacidad pública del módulo propietario.

---

## 5. Aggregate Root y consistencia

`Event` es la raíz de consistencia del agregado.

```text
Event
├── Brief integrado
├── EventSession [0..*]
└── EventStatusHistory [0..*]
```

Las siguientes relaciones son externas al agregado:

```text
EventType ─────── Event
Tag ───────────── Event
Location ─────── EventSession
People ───────── Event Participation
Future Modules ─ Event
```

Las operaciones que modifican el estado de Event o una EventSession deberán validar las invariantes del Event. Location, Tag y EventType son conceptos reutilizables con ciclos de vida independientes.

No se cargarán dentro del agregado archivos, galerías, pagos, contratos, notificaciones, personal, equipos o una Timeline completa.

---

## 6. Modelo conceptual actualizado

### 6.1 Event

| Atributo conceptual              | Descripción                                             |
| -------------------------------- | ------------------------------------------------------- |
| `id`                             | Identidad técnica inmutable                             |
| `code`                           | Código empresarial único e inmutable                    |
| `name`                           | Nombre descriptivo                                      |
| `slug`                           | Identificador opcional para exposición futura           |
| `eventTypeId`                    | Event Type aplicado                                     |
| `lifecycleStatus`                | Estado administrativo                                   |
| `productionPhase`                | Fase operativa                                          |
| `dateStatus`                     | Estado global de programación                           |
| `priority`                       | Prioridad operativa                                     |
| `ownerUserId`                    | Responsable interno principal, cuando exista asignación |
| `timezone`                       | Zona horaria principal                                  |
| `estimatedStartAt`               | Inicio global estimado                                  |
| `estimatedEndAt`                 | Fin global estimado                                     |
| `confirmedStartAt`               | Inicio global confirmado                                |
| `confirmedEndAt`                 | Fin global confirmado                                   |
| `briefSummary`                   | Resumen del trabajo                                     |
| `briefObjectives`                | Objetivos                                               |
| `briefAudience`                  | Público objetivo                                        |
| `briefCreativeDirection`         | Dirección creativa                                      |
| `briefVisualReferences`          | Referencias descriptivas                                |
| `briefSpecialMoments`            | Momentos prioritarios                                   |
| `briefRestrictions`              | Restricciones                                           |
| `briefTechnicalRequirements`     | Requerimientos técnicos                                 |
| `briefAccessibilityRequirements` | Necesidades de accesibilidad                            |
| `briefPrivacyRequirements`       | Consideraciones de privacidad                           |
| `briefAdditionalNotes`           | Información adicional                                   |
| `cancellationReason`             | Motivo de cancelación                                   |
| `cancelledAt`                    | Momento de cancelación                                  |
| `completedAt`                    | Terminación operativa                                   |
| `closedAt`                       | Cierre administrativo                                   |
| `archivedAt`                     | Momento de archivo                                      |
| `createdBy`                      | Actor creador                                           |
| `updatedBy`                      | Último actor modificador                                |
| `createdAt`                      | Momento de creación                                     |
| `updatedAt`                      | Última modificación                                     |
| `version`                        | Versión de concurrencia optimista                       |

El brief forma parte de Event. No existe una entidad, tabla ni agregado independiente para él.

#### Código empresarial

Formato inicial recomendado:

```text
EV-2026-000001
```

El código es generado por el sistema, único, inmutable y no reutilizable. El nombre puede cambiar sin modificarlo.

### 6.2 EventSession

Etapa temporal importante del Event.

Ejemplos:

| Event Type     | EventSessions posibles                                    |
| -------------- | --------------------------------------------------------- |
| Wedding        | Bride Preparation, Groom Preparation, Ceremony, Reception |
| Music Video    | Recording Day 1, Recording Day 2                          |
| Graduation     | Ceremony, Photo Session                                   |
| Corporate      | Setup, Conference, Interviews, Closing                    |
| Social Content | Planning, Recording Batch, Product Session                |

| Atributo conceptual | Descripción                    |
| ------------------- | ------------------------------ |
| `id`                | Identidad de la sesión         |
| `eventId`           | Event propietario              |
| `type`              | Tipo de sesión                 |
| `name`              | Nombre operativo               |
| `description`       | Descripción                    |
| `status`            | Estado de la sesión            |
| `dateStatus`        | Tentativa o confirmada         |
| `startAt`           | Inicio                         |
| `endAt`             | Fin                            |
| `timezone`          | Zona horaria IANA              |
| `allDay`            | Indica jornada de día completo |
| `order`             | Orden de presentación          |
| `notes`             | Observaciones operativas       |
| `createdAt`         | Creación                       |
| `updatedAt`         | Modificación                   |
| `version`           | Control de concurrencia        |

Tipos iniciales orientativos:

- `MEETING`
- `PRE_PRODUCTION`
- `REHEARSAL`
- `PHOTO_SESSION`
- `RECORDING`
- `CEREMONY`
- `RECEPTION`
- `PRODUCTION`
- `POST_PRODUCTION`
- `DELIVERY`
- `OTHER`

Estados:

- `TENTATIVE`
- `SCHEDULED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `POSTPONED`

### 6.3 EventType

EventType clasifica y puede inicializar un Event mediante plantillas.

| Atributo conceptual | Descripción                   |
| ------------------- | ----------------------------- |
| `id`                | Identidad                     |
| `code`              | Código técnico estable        |
| `name`              | Nombre visible                |
| `description`       | Descripción                   |
| `color`             | Representación opcional       |
| `icon`              | Icono lógico opcional         |
| `isActive`          | Habilitado para nuevos Events |
| `sortOrder`         | Orden visible                 |
| `defaultTimezone`   | Zona horaria sugerida         |
| `defaultPriority`   | Prioridad sugerida            |
| `templateVersion`   | Versión de su plantilla       |
| `createdAt`         | Creación                      |
| `updatedAt`         | Modificación                  |

Tipos iniciales:

- `WEDDING`
- `QUINCEAÑERA`
- `GRADUATION`
- `CORPORATE`
- `PHOTO_SESSION`
- `VIDEO_PRODUCTION`
- `MUSIC_VIDEO`
- `SOCIAL_CONTENT`
- `OTHER`

#### Plantillas de EventType

Un EventType podrá definir:

- EventSessions sugeridas.
- Checklists sugeridos.
- Workflow inicial.
- Fase inicial.
- Configuración y valores predeterminados.
- Requisitos sugeridos del brief.
- Tags sugeridos.

Aplicar una plantilla crea una copia inicial de su configuración. Los cambios posteriores del EventType no alterarán retroactivamente Events existentes, salvo una migración o acción explícita.

Las plantillas deben versionarse para saber con qué definición fue inicializado cada Event.

### 6.4 Location

Entidad reutilizable e independiente de un Event específico.

| Atributo conceptual   | Descripción                         |
| --------------------- | ----------------------------------- |
| `id`                  | Identidad                           |
| `name`                | Nombre oficial o conocido           |
| `type`                | Tipo de lugar                       |
| `addressLine`         | Dirección                           |
| `city`                | Ciudad                              |
| `region`              | Departamento o región               |
| `countryCode`         | Código de país                      |
| `postalCode`          | Código postal                       |
| `latitude`            | Latitud opcional                    |
| `longitude`           | Longitud opcional                   |
| `timezone`            | Zona horaria del lugar              |
| `contactName`         | Contacto operativo opcional         |
| `contactPhone`        | Teléfono operativo opcional         |
| `accessInstructions`  | Instrucciones de acceso             |
| `parkingInstructions` | Información de estacionamiento      |
| `technicalNotes`      | Condiciones técnicas generales      |
| `isActive`            | Disponible para nuevas asignaciones |
| `createdAt`           | Creación                            |
| `updatedAt`           | Modificación                        |

Una EventSession puede utilizar una o varias Locations y una Location puede reutilizarse en múltiples EventSessions de distintos Events.

La relación entre EventSession y Location podrá conservar información contextual como orden, propósito, instrucciones específicas y condición de locación principal. Estos datos contextuales no deben modificar el registro reutilizable de Location.

### 6.5 Tag

Clasificación reutilizable y flexible.

| Atributo conceptual | Descripción                |
| ------------------- | -------------------------- |
| `id`                | Identidad                  |
| `name`              | Nombre visible             |
| `normalizedName`    | Nombre normalizado único   |
| `color`             | Color opcional             |
| `description`       | Significado                |
| `isActive`          | Disponible para asignación |

Event y Tag tienen una relación de muchos a muchos. Desactivar un Tag no lo elimina de Events históricos.

Los Tags no reemplazan EventType, Priority, Lifecycle Status ni Production Phase. No se crearán columnas como `isVip`, `hasDrone` o `isInternational` para clasificaciones que pertenecen a Tags.

### 6.6 EventStatusHistory

Registro funcional inmutable de transiciones relevantes.

| Atributo conceptual | Descripción                 |
| ------------------- | --------------------------- |
| `id`                | Identidad                   |
| `eventId`           | Event relacionado           |
| `statusType`        | Dimensión modificada        |
| `previousValue`     | Valor anterior              |
| `newValue`          | Valor nuevo                 |
| `reason`            | Motivo                      |
| `changedBy`         | Actor responsable           |
| `changedAt`         | Momento del cambio          |
| `metadata`          | Contexto adicional limitado |

No reemplaza la auditoría técnica global.

### 6.7 Checklist — diseño futuro

Un Event podrá tener múltiples Checklists.

```text
Event 1 ─── * Checklist 1 ─── * ChecklistItem
```

Checklist tendrá identidad, nombre, categoría, orden, estado y procedencia de plantilla. ChecklistItem tendrá descripción, orden, obligatoriedad, estado de cumplimiento, responsable opcional, vencimiento y evidencia futura.

Ejemplos:

- Producción.
- Postproducción.
- Entrega.
- Administrativo.

Checklist será un módulo o subdominio futuro. EVENTS solo define su relación y permite que EventType ofrezca plantillas iniciales.

### 6.8 Timeline — proyección derivada

Timeline no se define como Aggregate Root ni exige una tabla propia. Es una proyección cronológica construida con información autorizada de:

- EventSessions.
- Cambios de estado.
- Milestones.
- Deliverables.
- Payments.
- Activities.
- Contracts.
- Notifications relevantes.

Cada entrada de Timeline debe indicar fecha, tipo, título, origen, visibilidad y referencia al recurso fuente. El recurso original continúa siendo la fuente de verdad.

---

## 7. Objetos de valor

### EventId

Identidad técnica opaca e inmutable.

### EventCode

Referencia empresarial única, generada por el sistema y no reutilizable.

### EventName

Nombre normalizado y legible que puede cambiar durante la vida del Event.

### DateRange

Par ordenado de inicio y fin. El inicio debe ser anterior al final.

### TimeZone

Identificador válido de zona horaria IANA. No es un desplazamiento UTC fijo.

### EventPriority

Prioridad operativa controlada. No representa el estado ni la fase.

### EventBrief

Objeto de valor compuesto integrado en Event. Agrupa información creativa, operativa, técnica, de accesibilidad y privacidad. No tiene identidad propia ni ciclo de vida independiente.

### StatusTransitionReason

Motivo normalizado requerido para cancelaciones, reactivaciones y retrocesos críticos.

### Address

Dirección estructurada de una Location.

### GeoPoint

Coordenadas válidas de latitud y longitud.

### TagName

Nombre normalizado utilizado para evitar duplicados semánticos de Tags.

---

## 8. Relaciones oficiales

```text
EventType 1 ───────────── * Event
Event 1 ───────────────── * EventSession
Event 1 ───────────────── * EventStatusHistory
Event * ───────────────── * Tag
EventSession * ────────── * Location

Event 1 ── future ─────── * Participation ─────── 1 Person/Organization
Event 1 ── future ─────── * Checklist
Event 1 ── future ─────── * Contract
Event 1 ── future ─────── * Payment
Event 1 ── future ─────── * Gallery
Event 1 ── future ─────── * Deliverable
Event 1 ── future ─────── * MediaAsset
Event 1 ── future ─────── * Invitation
Event 1 ── future ─────── * ProductionAssignment
```

No existe una relación directa `Event → Client`.

La relación futura con personas se realizará mediante una asociación contextual de participación, capaz de expresar múltiples participantes y múltiples roles sin convertir uno de ellos en propietario del Event.

---

## 9. Estados del Event

Un único campo de estado no representa correctamente el dominio. Se mantienen tres dimensiones independientes.

### 9.1 Lifecycle Status

| Estado      | Significado                           |
| ----------- | ------------------------------------- |
| `DRAFT`     | Expediente incompleto y editable      |
| `ACTIVE`    | Evento válido y operativo             |
| `COMPLETED` | Trabajo operativo terminado           |
| `CANCELLED` | Evento cancelado                      |
| `CLOSED`    | Operación y administración terminadas |
| `ARCHIVED`  | Retirado de la operación diaria       |

No existe `DELETED` como estado funcional.

### 9.2 Production Phase

| Fase              | Significado                     |
| ----------------- | ------------------------------- |
| `INQUIRY`         | Solicitud u oportunidad inicial |
| `PLANNING`        | Definición de alcance y fechas  |
| `PRE_PRODUCTION`  | Preparación técnica y creativa  |
| `PRODUCTION`      | Fotografía, grabación o rodaje  |
| `POST_PRODUCTION` | Edición y procesamiento         |
| `REVIEW`          | Revisión interna o externa      |
| `DELIVERY`        | Preparación y entrega           |
| `FINISHED`        | Producción finalizada           |

No todos los EventTypes deben recorrer obligatoriamente todas las fases.

### 9.3 Date Status

| Estado                | Significado                                        |
| --------------------- | -------------------------------------------------- |
| `UNSCHEDULED`         | Sin fechas                                         |
| `TENTATIVE`           | Fechas propuestas                                  |
| `PARTIALLY_CONFIRMED` | Algunas EventSessions confirmadas                  |
| `CONFIRMED`           | EventSessions principales confirmadas              |
| `POSTPONED`           | Programación suspendida pendiente de nuevas fechas |

---

## 10. Ciclo de vida

```text
DRAFT
  │
  ▼
ACTIVE
  │
  ├── INQUIRY
  ├── PLANNING
  ├── PRE_PRODUCTION
  ├── PRODUCTION
  ├── POST_PRODUCTION
  ├── REVIEW
  ├── DELIVERY
  └── FINISHED
         │
         ▼
     COMPLETED
         │
         ▼
       CLOSED
         │
         ▼
      ARCHIVED
```

`DRAFT` y `ACTIVE` pueden pasar a `CANCELLED` cuando se cumplan las reglas aplicables.

### Creación

Event puede crearse sin participantes, contratos, pagos, medios o fechas confirmadas. Como mínimo necesita nombre, EventType, zona horaria y actor creador.

Al crearse desde un EventType, puede recibir copias de sus plantillas vigentes.

### Activación

Requiere nombre válido, EventType activo, zona horaria, responsable interno cuando la política lo exija y brief mínimo. La activación no equivale a confirmación contractual.

La participación de personas se validará cuando PEOPLE exista, sin introducir una dependencia Client.

### Confirmación de fechas

Ocurre cuando las EventSessions principales tienen fechas y duraciones válidas. Políticas futuras podrán exigir contrato, anticipo, disponibilidad de equipo o aprobación administrativa.

### Producción

Requiere Event activo, EventSession operativa aplicable y autorización. Un Event cancelado no puede entrar en producción.

### Terminación

`COMPLETED` indica que terminó el trabajo operativo. No implica necesariamente pago total, entrega aceptada o cierre contractual.

### Cierre

`CLOSED` representa finalización empresarial. Las políticas futuras podrán consultar Deliverables, Payments, Contracts y pendientes administrativos.

### Cancelación

Requiere motivo, actor autorizado y registro histórico. No elimina información ni dependencias. Reactivar es una acción explícita y restringida.

### Archivo

Retira el Event de la operación diaria sin eliminarlo. Es reversible con autorización.

---

## 11. Reglas de negocio

### Identidad

1. Todo Event tiene EventId inmutable.
2. Todo Event tiene EventCode único, inmutable y no reutilizable.
3. El nombre puede cambiar sin alterar la identidad.
4. Los identificadores externos no sustituyen EventId.

### Aggregate Root

5. Toda operación sobre EventSessions valida las invariantes del Event propietario.
6. Los módulos externos se relacionan mediante EventId y no modifican directamente el agregado.
7. Event no incorpora datos internos de módulos dependientes.

### Personas

8. Event no contiene `clientId` ni depende directamente de Client.
9. Un Event podrá relacionarse con múltiples Participants.
10. Un Participant podrá cumplir múltiples roles.
11. Los roles de participación pertenecen al contexto del Event.
12. La identidad y los datos personales pertenecerán a PEOPLE.

### EventType y plantillas

13. Todo Event tiene un EventType.
14. Solo EventTypes activos pueden utilizarse en Events nuevos.
15. Desactivar un EventType no modifica Events históricos.
16. Aplicar una plantilla copia su definición vigente.
17. Cambios posteriores de plantilla no modifican automáticamente Events existentes.
18. La versión aplicada debe conservarse para trazabilidad.

### Brief

19. El brief forma parte de Event y no tiene identidad independiente.
20. Sus campos estructurados se usarán para información que necesite reglas o consulta.
21. La flexibilidad adicional no sustituirá datos estructurados esenciales.

### EventSessions

22. Un Event puede existir sin EventSessions durante borrador.
23. El inicio de una EventSession debe ser anterior al final.
24. Los instantes se almacenan en UTC y conservan zona horaria IANA.
25. Una EventSession puede utilizar varias Locations.
26. Posponer o reprogramar debe conservar trazabilidad.
27. Una EventSession completada no se modifica silenciosamente.
28. Los solapamientos relevantes generan advertencia o requieren autorización.

### Locations

29. Location es reutilizable entre Events.
30. Los datos específicos de una sesión no modifican la definición global de Location.
31. Una Location inactiva permanece visible en el historial.
32. No se elimina una Location con usos históricos mediante una operación ordinaria.

### Tags

33. Un Event puede tener múltiples Tags.
34. Un Tag puede clasificar múltiples Events.
35. Los Tags no reemplazan estados, fases, prioridad ni EventType.
36. Los nombres normalizados no se duplican.
37. Desactivar un Tag no elimina asignaciones históricas.

### Estados

38. No se permiten transiciones arbitrarias.
39. Los cambios relevantes registran actor, momento y motivo cuando aplique.
40. Un Event cancelado no entra en producción.
41. Un Event cerrado no admite edición ordinaria.
42. Archivar no equivale a eliminar.

### Integridad

43. Un Event con dependencias no se elimina físicamente.
44. Solo un borrador sin actividad ni dependencias puede eliminarse de forma restringida.
45. Las operaciones sensibles usan concurrencia optimista.
46. Una escritura basada en una versión anterior se rechaza como conflicto.
47. Cada transición de estado es atómica.

---

## 12. Casos de uso oficiales

### Event

- Crear Event.
- Crear Event desde una plantilla de EventType.
- Consultar Event.
- Listar y buscar Events.
- Actualizar información general y brief.
- Cambiar EventType bajo autorización.
- Asignar responsable interno.
- Duplicar Event como borrador.
- Activar Event.
- Cambiar Production Phase.
- Completar Event.
- Cerrar Event.
- Cancelar Event.
- Reactivar Event.
- Archivar y desarchivar Event.
- Eliminar borrador permitido.
- Consultar historial funcional.

### EventSession

- Crear EventSession.
- Crear EventSessions desde plantilla.
- Consultar y listar EventSessions.
- Actualizar EventSession.
- Confirmar EventSession.
- Reprogramar EventSession.
- Posponer EventSession.
- Iniciar y completar EventSession.
- Cancelar EventSession.
- Reordenar EventSessions.
- Asignar o retirar Locations.
- Detectar conflictos temporales.

### EventType

- Crear y actualizar EventType.
- Activar o desactivar EventType.
- Definir una nueva versión de plantilla.
- Consultar contenido de plantilla.
- Previsualizar la inicialización de un Event.

### Location

- Crear Location reutilizable.
- Buscar y consultar Locations.
- Actualizar Location.
- Activar o desactivar Location.
- Asociar Location con EventSession.
- Registrar información contextual de uso.

### Tag

- Diseñar catálogo de Tags.
- Asignar o retirar Tags de Event.
- Buscar Events por Tags.
- Activar o desactivar Tags.

### Proyecciones

- Consultar resumen operativo del Event.
- Consultar próximas EventSessions.
- Consultar Events sin programación.
- Consultar Timeline unificada.
- Consultar acciones permitidas para el actor actual.

---

## 13. API oficial prevista

La API seguirá contratos versionados bajo `/api/v1`.

### Events

| Método   | Ruta                         | Propósito                              |
| -------- | ---------------------------- | -------------------------------------- |
| `POST`   | `/events`                    | Crear Event                            |
| `GET`    | `/events`                    | Listar, buscar y filtrar               |
| `GET`    | `/events/:eventId`           | Consultar detalle                      |
| `PATCH`  | `/events/:eventId`           | Actualizar información general y brief |
| `DELETE` | `/events/:eventId`           | Eliminar borrador permitido            |
| `POST`   | `/events/:eventId/duplicate` | Duplicar como borrador                 |

### Transiciones explícitas

| Método | Ruta                              | Propósito                |
| ------ | --------------------------------- | ------------------------ |
| `POST` | `/events/:eventId/activate`       | Activar                  |
| `POST` | `/events/:eventId/phase`          | Cambiar Production Phase |
| `POST` | `/events/:eventId/complete`       | Completar                |
| `POST` | `/events/:eventId/close`          | Cerrar                   |
| `POST` | `/events/:eventId/cancel`         | Cancelar                 |
| `POST` | `/events/:eventId/reactivate`     | Reactivar                |
| `POST` | `/events/:eventId/archive`        | Archivar                 |
| `POST` | `/events/:eventId/unarchive`      | Desarchivar              |
| `GET`  | `/events/:eventId/status-history` | Consultar historial      |

Los estados no se modificarán directamente mediante un `PATCH` genérico.

### EventSessions

| Método   | Ruta                                              | Propósito                     |
| -------- | ------------------------------------------------- | ----------------------------- |
| `POST`   | `/events/:eventId/sessions`                       | Crear EventSession            |
| `GET`    | `/events/:eventId/sessions`                       | Listar EventSessions          |
| `GET`    | `/events/:eventId/sessions/:sessionId`            | Consultar detalle             |
| `PATCH`  | `/events/:eventId/sessions/:sessionId`            | Actualizar                    |
| `DELETE` | `/events/:eventId/sessions/:sessionId`            | Eliminar cuando sea permitido |
| `POST`   | `/events/:eventId/sessions/:sessionId/confirm`    | Confirmar                     |
| `POST`   | `/events/:eventId/sessions/:sessionId/reschedule` | Reprogramar                   |
| `POST`   | `/events/:eventId/sessions/:sessionId/postpone`   | Posponer                      |
| `POST`   | `/events/:eventId/sessions/:sessionId/start`      | Iniciar                       |
| `POST`   | `/events/:eventId/sessions/:sessionId/complete`   | Completar                     |
| `POST`   | `/events/:eventId/sessions/:sessionId/cancel`     | Cancelar                      |
| `POST`   | `/events/:eventId/sessions/reorder`               | Reordenar                     |

### Session Locations

| Método   | Ruta                                                         | Propósito           |
| -------- | ------------------------------------------------------------ | ------------------- |
| `POST`   | `/events/:eventId/sessions/:sessionId/locations`             | Asociar Location    |
| `GET`    | `/events/:eventId/sessions/:sessionId/locations`             | Listar Locations    |
| `PATCH`  | `/events/:eventId/sessions/:sessionId/locations/:locationId` | Actualizar contexto |
| `DELETE` | `/events/:eventId/sessions/:sessionId/locations/:locationId` | Retirar asociación  |

### EventTypes y plantillas

| Método  | Ruta                                   | Propósito                           |
| ------- | -------------------------------------- | ----------------------------------- |
| `GET`   | `/event-types`                         | Listar EventTypes                   |
| `POST`  | `/event-types`                         | Crear EventType                     |
| `PATCH` | `/event-types/:eventTypeId`            | Actualizar                          |
| `POST`  | `/event-types/:eventTypeId/activate`   | Activar                             |
| `POST`  | `/event-types/:eventTypeId/deactivate` | Desactivar                          |
| `GET`   | `/event-types/:eventTypeId/template`   | Consultar plantilla vigente         |
| `PUT`   | `/event-types/:eventTypeId/template`   | Publicar nueva versión de plantilla |

### Locations

| Método  | Ruta                                | Propósito       |
| ------- | ----------------------------------- | --------------- |
| `POST`  | `/locations`                        | Crear Location  |
| `GET`   | `/locations`                        | Buscar y listar |
| `GET`   | `/locations/:locationId`            | Consultar       |
| `PATCH` | `/locations/:locationId`            | Actualizar      |
| `POST`  | `/locations/:locationId/activate`   | Activar         |
| `POST`  | `/locations/:locationId/deactivate` | Desactivar      |

### Tags — capacidad futura

| Método   | Ruta                           | Propósito   |
| -------- | ------------------------------ | ----------- |
| `GET`    | `/tags`                        | Buscar Tags |
| `POST`   | `/events/:eventId/tags`        | Asignar Tag |
| `DELETE` | `/events/:eventId/tags/:tagId` | Retirar Tag |

### Timeline — proyección futura

| Método | Ruta                        | Propósito                      |
| ------ | --------------------------- | ------------------------------ |
| `GET`  | `/events/:eventId/timeline` | Obtener proyección cronológica |

---

## 14. DTOs conceptuales

Los DTOs describen contratos de entrada y no son entidades del dominio.

### CreateEvent

- Nombre.
- EventType.
- Zona horaria.
- Prioridad opcional.
- Responsable interno opcional durante borrador.
- Fechas estimadas opcionales.
- Campos iniciales del brief.
- Opción explícita de aplicar plantilla.

No acepta EventCode manual, estado arbitrario, actor creador, participantes, contratos ni pagos.

### UpdateEvent

- Nombre.
- EventType bajo autorización.
- Zona horaria.
- Prioridad.
- Responsable.
- Fechas estimadas.
- Campos del brief.
- Versión vigente.

No modifica directamente EventCode, estados, fase, cancelación, cierre ni auditoría.

### CreateEventSession

- Nombre.
- Tipo.
- Descripción.
- Date Status.
- Inicio y fin opcionales según el estado.
- Zona horaria.
- Indicador de día completo.
- Notas.
- Locations opcionales.

### RescheduleEventSession

- Nuevo rango temporal.
- Zona horaria.
- Motivo.
- Date Status resultante.
- Versión vigente.

### ChangeProductionPhase

- Fase destino.
- Motivo cuando aplique.
- Versión vigente.

### CancelEvent

- Motivo obligatorio.
- Detalle opcional.
- Fecha efectiva restringida.
- Versión vigente.

### CreateLocation

- Nombre.
- Tipo.
- Dirección estructurada.
- País.
- Zona horaria.
- Coordenadas opcionales.
- Contacto operativo opcional.
- Instrucciones.
- Notas técnicas.

### EventListQuery

- Búsqueda por texto o código.
- EventTypes.
- Lifecycle Statuses.
- Production Phases.
- Date Statuses.
- Prioridades.
- Tags futuros.
- Responsables.
- Rango de fechas.
- Inclusión de archivados.
- Paginación y ordenamiento.

No incluye un filtro directo por Client. La búsqueda futura por personas o roles se resolverá mediante PEOPLE o CRM.

---

## 15. Permisos

### Event

- `events.read`
- `events.read.all`
- `events.read.assigned`
- `events.create`
- `events.update`
- `events.delete-draft`
- `events.assign-owner`
- `events.change-type`
- `events.duplicate`
- `events.activate`
- `events.change-phase`
- `events.complete`
- `events.close`
- `events.cancel`
- `events.reactivate`
- `events.archive`
- `events.unarchive`
- `events.history.read`

### EventSession

- `events.sessions.read`
- `events.sessions.manage`
- `events.sessions.confirm`
- `events.sessions.transition`

### Catálogos

- `event-types.read`
- `event-types.manage`
- `event-types.templates.manage`
- `locations.read`
- `locations.manage`
- `tags.read`
- `tags.manage`

Los permisos se combinarán con alcance: todos los Events, Events asignados, Events del equipo o acceso externo otorgado por una relación futura de participación.

EVENTS no codificará roles. AUTH, ROLES y PERMISSIONS resolverán la autorización.

---

## 16. Validaciones

### Event

- Nombre obligatorio y normalizado.
- EventType existente y activo para creación.
- Zona horaria IANA válida.
- Prioridad permitida.
- Responsable activo cuando se proporcione.
- EventCode generado exclusivamente por el sistema.
- Brief limitado y sanitizado según su uso.
- Versión vigente para operaciones concurrentes.

### EventSession

- Pertenece al Event indicado.
- Inicio anterior al fin.
- Fechas ISO 8601 válidas.
- Zona horaria requerida para una sesión programada.
- Fechas completas para confirmación.
- Motivo al reprogramar, posponer o cancelar.
- Transición compatible con Event.
- Advertencia o política ante solapamientos.

### Location

- Nombre obligatorio.
- País mediante código estándar cuando se proporcione.
- Zona horaria válida.
- Latitud entre −90 y 90.
- Longitud entre −180 y 180.
- Location activa para nuevas asociaciones.
- No eliminación ordinaria con uso histórico.

### Tags

- Nombre normalizado no duplicado.
- Tag activo para nuevas asignaciones.
- Prohibición de usar Tags para reemplazar campos estructurales.

### Transiciones

- Transición permitida por la máquina de estados.
- Precondiciones satisfechas.
- Motivo cuando sea obligatorio.
- Actor autorizado.
- Registro histórico atómico.
- No edición ordinaria de Event cerrado o archivado.

---

## 17. Timeline

Timeline será una proyección ordenada cronológicamente, no la fuente de verdad.

Fuentes previstas:

- EventSessions.
- EventStatusHistory.
- Milestones.
- Contracts.
- Payments.
- Deliverables.
- Activities.
- Notifications relevantes.

Cada entrada debe incluir:

- Momento efectivo.
- Tipo.
- Título y descripción resumida.
- Módulo de origen.
- Referencia al recurso original.
- Visibilidad interna o externa.
- Actor cuando sea apropiado.

Timeline no duplicará el contenido completo de los módulos. Si una fuente cambia o se elimina conforme a sus reglas, la proyección deberá reflejar la fuente vigente o su registro histórico autorizado.

---

## 18. Checklist

Checklist queda diseñado como capacidad futura conectada a Event.

Un Event podrá tener varias listas, por ejemplo:

- Producción.
- Postproducción.
- Entrega.
- Administrativo.

Cada Checklist contendrá Items con:

- Identidad.
- Descripción.
- Orden.
- Estado de cumplimiento.
- Obligatoriedad.
- Responsable futuro.
- Fecha límite opcional.
- Momento y actor de cumplimiento.
- Evidencia opcional futura.

EventType podrá ofrecer plantillas de Checklist. La instancia creada para un Event será independiente de la plantilla original y conservará su versión de procedencia.

Checklist no se implementará en la primera fase de EVENTS.

---

## 19. Future Domain Integration

### 19.1 People

PEOPLE será propietario de personas, organizaciones, identidades de contacto y datos personales.

La integración futura utilizará una relación contextual equivalente a Event Participation:

- Un Event puede tener múltiples Participants.
- Una persona u organización puede participar en múltiples Events.
- Cada participación puede tener uno o varios roles.
- Los roles pueden incluir contratante, protagonista, contacto principal, responsable financiero, planner, representante, artista, modelo o productor.
- Una participación puede tener vigencia, prioridad de contacto y visibilidad.

Event no tendrá `clientId`. PEOPLE será la fuente de verdad de la identidad; la participación será la fuente de verdad de su papel dentro del Event.

### 19.2 Contracts

CONTRACTS será propietario de acuerdos, versiones, firmas, alcance, derechos y condiciones. Cada Contract se relacionará con EventId y con Participants contractuales cuando PEOPLE exista.

EVENTS solo consultará resultados necesarios para sus políticas, como la existencia de un contrato válido.

### 19.3 Payments

PAYMENTS será propietario de obligaciones, anticipos, abonos, saldos, reembolsos y disputas. Se relacionará con EventId y, cuando corresponda, ContractId.

EVENTS podrá consumir estados financieros resumidos, pero no calculará ni modificará transacciones.

### 19.4 Gallery

GALLERY administrará colecciones de selección, revisión, entrega, publicación privada o pública. Cada Gallery estará asociada a EventId y referenciará Media Assets.

EVENTS mostrará resúmenes, no almacenará elementos de galería.

### 19.5 Deliverables

DELIVERABLES administrará resultados comprometidos, fechas, estados, versiones, aprobaciones y entrega. Cada Deliverable pertenecerá a un Event y podrá relacionarse con Contracts, Galleries y Media Assets.

El estado de Deliverables podrá formar parte de la política de cierre del Event.

### 19.6 Media

MEDIA administrará Media Assets, metadatos, variantes, procesamiento y referencias de almacenamiento. Cada Media Asset podrá relacionarse con EventId y EventSessionId.

El acceso físico utilizará `StorageProvider`; Event nunca dependerá directamente de un proveedor de almacenamiento.

### 19.7 Invitations

INVITATIONS administrará diseño, contenido, publicación, destinatarios, confirmaciones y métricas. Cada Invitation pertenecerá a un Event y podrá consultar Participants autorizados.

### 19.8 Notifications

NOTIFICATIONS reaccionará a hechos como Event creado, sesión confirmada, reprogramación, proximidad, cancelación, entrega o cambio de fase. Será propietario de canales, plantillas, destinatarios, intentos y resultados.

EVENTS emitirá hechos; no enviará comunicaciones directamente.

### 19.9 Production

PRODUCTION administrará Team Members, asignaciones, recursos, equipos, tareas operativas y posiblemente workflows especializados. Las asignaciones podrán apuntar a Event o EventSession.

EVENTS conservará la fase general, mientras PRODUCTION gobernará la ejecución detallada.

### 19.10 CRM

CRM administrará oportunidades, relaciones comerciales, seguimiento, fuentes, embudos y condición comercial de cliente.

Una oportunidad podrá originar un Event, pero CRM no será propietario de Event. La condición Client se resolverá en CRM y PEOPLE, sin una dependencia directa dentro de Event.

### 19.11 BackOffice

BackOffice será una interfaz de gestión, no un dominio propietario. Consumirá APIs de EVENTS y demás módulos respetando permisos, estados y reglas. No escribirá directamente en la base de datos.

### 19.12 Client Portal

Client Portal será una experiencia externa con acceso limitado. Su autorización se basará en Participants, roles y permisos de visibilidad.

No asumirá que existe un único Client por Event. Podrá mostrar información diferente a distintos participantes del mismo Event.

---

## 20. Eventos internos del dominio

Hechos previstos:

- `EventCreated`
- `EventInitializedFromType`
- `EventActivated`
- `EventUpdated`
- `EventTypeChanged`
- `EventOwnerAssigned`
- `EventTagAssigned`
- `EventTagRemoved`
- `EventSessionCreated`
- `EventSessionConfirmed`
- `EventSessionRescheduled`
- `EventSessionPostponed`
- `EventSessionStarted`
- `EventSessionCompleted`
- `EventSessionCancelled`
- `EventSessionLocationAssigned`
- `EventProductionPhaseChanged`
- `EventCompleted`
- `EventClosed`
- `EventCancelled`
- `EventReactivated`
- `EventArchived`

Inicialmente serán eventos internos del monolito modular. No requieren microservicios ni un broker distribuido. Las integraciones externas críticas podrán adoptar posteriormente un patrón outbox.

---

## 21. Concurrencia, idempotencia y trazabilidad

Event y EventSession usarán concurrencia optimista. Una modificación basada en una versión obsoleta se rechazará como conflicto para evitar sobrescribir cambios de otro usuario.

Las operaciones sensibles, especialmente crear, cancelar, confirmar o reprogramar, podrán aceptar claves de idempotencia para evitar duplicados por reintentos.

Se diferencian:

- Historial funcional visible según permisos.
- Auditoría técnica restringida con actor, petición, IP, valores modificados, fecha y correlation ID.

---

## 22. Eliminación y retención

Solo podrá eliminarse físicamente un Event que:

- Permanezca en `DRAFT`.
- No tenga actividad relevante.
- No tenga dependencias externas.
- Sea eliminado por un actor autorizado.

Events activos, cancelados, completados, cerrados o archivados se conservarán conforme a obligaciones contractuales, contables, de privacidad y derechos de imagen.

Locations, Tags y EventTypes utilizados históricamente se desactivarán en lugar de eliminarse mediante operaciones ordinarias.

La anonimización se diseñará separadamente de la eliminación.

---

## 23. Búsqueda y proyecciones

EVENTS deberá soportar búsquedas por:

- EventCode.
- Nombre.
- EventType.
- Lifecycle Status.
- Production Phase.
- Date Status.
- Prioridad.
- Responsable.
- Tags.
- Rango de fechas.
- EventSessions próximas.
- Location.
- Eventos activos o archivados.

La búsqueda futura por personas, Client, Contact o rol de Participant será resuelta mediante integración con PEOPLE o CRM, no mediante una dependencia directa dentro de Event.

Las respuestas de listado serán proyecciones resumidas y no cargarán pagos, medios, galerías, contratos o Timeline completa.

---

## 24. Riesgos del dominio

### Event convertido en entidad gigante

Riesgo: incorporar dentro de Event toda la información de pagos, medios, contratos o producción.

Mitigación: mantener límites de propiedad y referencias por EventId.

### Client reaparece como dependencia directa

Riesgo: simplificar formularios añadiendo `clientId` a Event.

Mitigación: representar personas mediante Participation y roles contextuales cuando PEOPLE sea diseñado.

### EventType usado como workflow rígido

Riesgo: que una plantilla impida adaptar un Event real.

Mitigación: copiar y versionar plantillas; las instancias pueden evolucionar independientemente.

### Tags reemplazan datos estructurados

Riesgo: usar Tags para estados, fases o información crítica.

Mitigación: reservar Tags para clasificación flexible.

### Timeline duplica fuentes de verdad

Riesgo: persistir copias divergentes de pagos, entregas o actividades.

Mitigación: Timeline será una proyección que referencia recursos fuente.

### Location acumula información contextual

Riesgo: sobrescribir datos globales de una Location con instrucciones particulares de una sesión.

Mitigación: separar definición reutilizable y contexto de asociación.

### Máquina de estados demasiado rígida

Riesgo: impedir flujos legítimos de distintos EventTypes.

Mitigación: separar Lifecycle Status, Production Phase y Date Status, y permitir políticas configurables sin eliminar invariantes esenciales.

### Plantillas modifican Events históricos

Riesgo: cambios de EventType alteran trabajo ya planificado.

Mitigación: aplicación por copia y versión, sin propagación automática.

---

## 25. Decisiones arquitectónicas oficiales

1. Event es el Aggregate Root principal del negocio.
2. Event representa un proyecto audiovisual, no una cita de calendario.
3. Event no depende directamente de Client.
4. Las personas se integrarán mediante PEOPLE y roles de Participation.
5. El término oficial para una etapa temporal es EventSession.
6. El brief es un objeto de valor integrado en Event.
7. Location es reutilizable entre múltiples Events.
8. Tags proporcionan clasificación flexible y no reemplazan campos estructurados.
9. Checklist será una capacidad futura con múltiples listas e Items.
10. Timeline será preferentemente una proyección derivada.
11. EventType puede definir plantillas versionadas.
12. Una plantilla se copia al Event y no lo modifica retroactivamente.
13. Los módulos futuros conservan la propiedad de sus datos.
14. Las transiciones del ciclo de vida usan operaciones explícitas.
15. Estados administrativos, fases productivas y estados de fecha permanecen separados.
16. El dominio seguirá dentro de un monolito modular, sin microservicios iniciales.
17. La especificación evita abstracciones sin una necesidad funcional demostrada.

---

## 26. Alcance de implementación posterior

Cuando se autorice la implementación de EVENTS, el primer alcance deberá considerar:

- Event.
- Brief integrado.
- EventSession.
- EventType.
- Plantillas iniciales de EventType con alcance controlado.
- Location reutilizable.
- EventStatusHistory.
- Máquina de estados.
- APIs y permisos principales.
- Búsqueda, paginación y proyecciones básicas.
- Eventos internos.

Permanecerán diseñados pero fuera del primer alcance, salvo nueva aprobación:

- People y Participation.
- Tags.
- Checklist.
- Timeline multi-módulo.
- Contracts.
- Payments.
- Gallery.
- Deliverables.
- Media.
- Invitations.
- Production detallada.
- CRM.
- Client Portal.

---

## 27. Criterios de conformidad

Una implementación futura será conforme con Events Domain Design v2 cuando:

- Event sea la raíz del flujo del negocio.
- No exista una dependencia directa hacia Client.
- Las etapas temporales se denominen EventSession.
- El brief permanezca dentro de Event.
- Locations sean reutilizables.
- Las plantillas de EventType sean versionadas y no retroactivas.
- Tags no se conviertan en columnas específicas.
- Timeline no duplique fuentes de verdad.
- Los módulos externos se relacionen por EventId y conserven su propiedad.
- Los estados y transiciones respeten las reglas oficiales.
- Backend, frontend, base de datos y diseños utilicen el Ubiquitous Language definido.

---

## 28. Autoridad del documento

Events Domain Design v2 reemplaza completamente la versión anterior del diseño de EVENTS.

Este documento es la referencia oficial para el diseño y la implementación futura del dominio. Cualquier excepción deberá documentarse y aprobarse como una evolución explícita de la especificación.
