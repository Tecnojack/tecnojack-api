# DESIGN CONTEXT — TECNOJACK

**Documento oficial de contexto funcional para UX/UI y Figma AI**  
**Producto:** TECNOJACK SaaS para estudios audiovisuales  
**Backend auditado:** `tecnojack-api`  
**Frontend auditado:** `D:\TECNOJACK`  
**Fecha de auditoría:** 11 de agosto de 2026  
**Alcance:** producto, dominios, arquitectura funcional, backend, frontend y diseño  
**Naturaleza:** auditoría de lectura; no se modificó código ni se corrigieron defectos

---

## 1. Cómo usar este documento

Este archivo es el contexto de diseño que debe entregarse a diseñadores, product designers y Figma AI antes de crear pantallas. Su misión es evitar tres errores:

1. Diseñar TECNOJACK como un CRM genérico.
2. Diseñarlo como un gestor exclusivo de bodas.
3. Copiar literalmente el frontend actual, que nació como sitio comercial, invitación y herramientas administrativas separadas, no como el ERP definitivo.

### 1.1 Niveles de realidad

Cada capacidad debe interpretarse según uno de estos estados:

- **Implementada en backend:** existe dominio, caso de uso, persistencia y/o endpoint observable.
- **Implementada en frontend actual:** existe ruta, pantalla o componente Angular observable.
- **Diseñada/documentada:** pertenece al Blueprint o a un Domain Design, pero no necesariamente tiene UI.
- **Faltante para el producto:** necesaria para completar la experiencia ERP aunque no exista todavía.

### 1.2 Jerarquía de fuentes

1. ADR aceptados del Platform Blueprint.
2. Platform Blueprint para ownership y límites entre dominios.
3. Domain Designs para reglas internas.
4. Architecture Reports y Module Overviews para estado técnico.
5. Controladores, casos de uso, DTOs y Prisma para comportamiento observable.
6. Angular actual para patrones visuales y superficies ya construidas.
7. Este documento para traducir todo lo anterior a contexto de diseño.

Este documento no cambia el dominio. Cuando una propuesta visual contradiga ownership, permisos o estados, prevalece la arquitectura.

---

# Visión general del producto

## 2. Qué es TECNOJACK

TECNOJACK es un ERP SaaS vertical para estudios audiovisuales. Centraliza el ciclo completo de captación, formalización, producción, manejo de activos, publicación y entrega de servicios audiovisuales.

Debe servir a estudios que realizan:

- Bodas.
- Quince años.
- Grados individuales e institucionales.
- Eventos corporativos.
- Fotografía y video.
- Videos musicales.
- Contenido para redes sociales.
- Sesiones de fotos.
- Producciones audiovisuales con múltiples jornadas y equipos.

No es solamente un CRM: CRM termina cuando la operación apenas comienza. Tampoco es solo un DAM o gestor de archivos: los archivos existen dentro de compromisos comerciales, eventos, contratos y entregas.

## 2.1 Promesa central

Una empresa audiovisual debe poder pasar de un lead a una entrega final sin perder contexto, duplicar datos ni cambiar de herramientas desconectadas.

```text
Lead
  → Opportunity
  → Quotation
  → Contract
  → Payment plan
  → Event
  → Event Sessions
  → Invitation / RSVP
  → Production
  → Media upload and processing
  → Gallery / selection
  → Deliverable
  → Client Portal / closure
```

## 2.2 Principio rector del producto

`Event` es el expediente central del trabajo audiovisual. Los demás módulos se conectan mediante `EventId`, conservando sus propios datos, estados y reglas.

Event no debe convertirse visualmente en un formulario gigante. En UX debe actuar como un workspace compuesto por vistas de módulos propietarios.

## 2.3 Propuesta de valor por audiencia

| Audiencia             | Valor principal                                            |
| --------------------- | ---------------------------------------------------------- |
| Dueño del estudio     | Control integral del negocio, salud operativa y financiera |
| Administrador         | Parametrización, usuarios, permisos, catálogos y auditoría |
| Vendedor              | Pipeline, seguimiento, cotizaciones y conversión           |
| Productor/coordinador | Agenda, sesiones, equipo, hitos y bloqueos                 |
| Fotógrafo/videógrafo  | Asignaciones, agenda, brief, carga y estado del material   |
| Editor                | Cola de trabajo, assets, versiones y entregables           |
| Finanzas              | Contratos, cuotas, transacciones, vencimientos y saldos    |
| Cliente/anfitrión     | Estado del Event, documentos, pagos, galerías y entregas   |
| Invitado              | Invitación, itinerario, ubicación y RSVP                   |

---

# Arquitectura funcional

## 3. Principios que condicionan el diseño

### 3.1 Ownership único

Cada información tiene un dueño. Una pantalla puede componer información de varios dominios, pero las acciones deben conservar el origen:

- PEOPLE edita identidad.
- CRM edita oportunidad y actividad comercial.
- EVENTS edita expediente, sesiones y estados del Event.
- CONTRACTS edita acuerdos y versiones.
- PAYMENTS edita obligaciones y movimientos.
- MEDIA edita metadata del asset.
- GALLERY edita curaduría y publicación.
- DELIVERABLES edita compromisos y entrega.

### 3.2 Monolito modular

El backend se despliega como una aplicación NestJS, pero sus módulos funcionan como bounded contexts. La navegación puede sentirse unificada; las acciones no deben ocultar los límites.

### 3.3 Superficies públicas

Los módulos se consumen por fachadas, eventos o proyecciones. En UX esto implica:

- No diseñar editores universales que modifiquen cualquier dato.
- Usar enlaces contextuales: “Abrir contrato”, “Ver pago”, “Gestionar galería”.
- Mostrar procedencia en timeline, alertas y widgets.
- Mantener permisos por acción y recurso.

### 3.4 Proyecciones

Dashboard, Timeline y Analytics son lecturas derivadas. Deben mostrar enlaces hacia la fuente y no ofrecer edición directa del hecho proyectado.

### 3.5 Estados explícitos

Las transiciones críticas son comandos, no simples cambios de select. Activar, publicar, firmar, completar, cancelar, entregar, revocar o restaurar requieren intención, validación y feedback.

---

# Mapa completo de módulos

## 4. Inventario funcional

| Módulo            | Tipo             | Aggregate Roots / elementos                          | Capacidades principales                                 | Estado observable                                       |
| ----------------- | ---------------- | ---------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| Identity & Access | Genérico         | User, Role, Permission, Policy, Session, APIKey      | Login, JWT, refresh, sesiones, API keys, RBAC+ABAC      | Backend implementado                                    |
| Administration    | Genérico/soporte | SystemSetting, FeatureFlag, Catalog, DashboardWidget | Configuración, flags, catálogos, widgets, health        | Backend implementado; CMS frontend separado             |
| PEOPLE            | Soporte          | Person, Organization                                 | Identidad, contacto, organizaciones, archivado          | Backend implementado                                    |
| CRM               | Soporte          | Opportunity                                          | Pipeline, cotizaciones, actividades, tareas, conversión | Backend implementado                                    |
| EVENTS            | Core             | Event                                                | Expediente, estados, fases, sesiones, ubicación, brief  | Backend implementado                                    |
| CONTRACTS         | Soporte          | Contract                                             | Versiones, partes, publicación, firma/ejecución         | Backend y UI parcial                                    |
| PAYMENTS          | Soporte          | Payment                                              | Plan, cuotas, transacciones, vencimiento, saldo         | Backend implementado; UI ERP faltante                   |
| INVITATIONS       | Soporte          | Invitation                                           | Layout, secciones, agenda, invitados, publicación, RSVP | Backend y experiencias públicas existentes              |
| PRODUCTION        | Core             | ProductionPlan futuro                                | Equipo, recursos, agenda operativa, ejecución           | Documentado; módulo completo no observado               |
| STORAGE           | Genérico         | Infraestructura                                      | Bytes, rutas, validación, proveedor local/S3 futuro     | Puerto y proveedor local                                |
| MEDIA             | Core             | MediaAsset                                           | Registro, metadata, estado, archivo/restauración        | Backend y media admin parcial                           |
| GALLERY           | Core             | Gallery                                              | Álbumes, assets referenciados, visibilidad, publicación | Backend; UI cliente parcial no integrada                |
| DELIVERABLES      | Core             | Deliverable                                          | Items, estado, listo, entrega                           | Backend; UI ERP faltante                                |
| NOTIFICATIONS     | Soporte          | Notification, NotificationTemplate                   | Envío, programación, cancelación, retry, plantillas     | Backend; transporte real pendiente                      |
| CLIENT PORTAL     | Experiencia      | Sin agregados                                        | Dashboard, resumen, galleries, deliverables, timeline   | Backend de lectura; frontend ERP faltante               |
| CMS               | Soporte          | Contenido editorial                                  | Sitio, páginas, servicios, paquetes, media editorial    | Frontend/Firebase existente; backend ERP no equivalente |
| BACKOFFICE        | Experiencia      | Sin ownership                                        | Composición interna de módulos                          | Diseño integral faltante                                |
| ANALYTICS         | Soporte          | Proyecciones                                         | Métricas y reportes regenerables                        | Futuro                                                  |
| AUTOMATION        | Soporte          | Reglas futuras                                       | Reacción a eventos mediante comandos públicos           | Futuro                                                  |
| AUDIT             | Genérico         | AuditRecord futuro                                   | Evidencia inmutable de acciones sensibles               | Campos de auditoría; UI/módulo completo no observado    |

## 4.1 Módulos administrativos

- Identity & Access.
- Administration.
- USERS/roles/permissions dentro de IAM.
- SETTINGS, feature flags y catálogos.
- AUDIT.
- CMS editorial.
- SYSTEM/health, solo para administradores técnicos.

## 4.2 Módulos visibles para cliente

- Client Portal.
- Event summary y timeline autorizado.
- Contracts y firma.
- Payments y saldo.
- Invitations como anfitrión.
- Galleries, selección y descarga según permiso.
- Deliverables.
- Perfil y preferencias de contacto.
- Notifications/preferences.

## 4.3 Módulos visibles para fotógrafo o equipo creativo

- Dashboard personal.
- Agenda y Event Sessions asignadas.
- Events autorizados con brief y ubicaciones.
- Production assignments cuando exista el módulo.
- Media upload, clasificación y procesamiento.
- Galleries según responsabilidad.
- Deliverables/tareas asignadas.
- Notifications.

No debería ver CRM, pagos completos, contratos sensibles o administración salvo permiso explícito.

## 4.4 Módulos visibles para administrador

- Dashboard ejecutivo/operativo.
- Todos los módulos de negocio según política.
- Usuarios, roles, permisos, políticas, sesiones y API keys.
- Settings, feature flags, catalogs y widgets.
- Auditoría, salud e integraciones.
- CMS y branding.

## 4.5 Módulos visibles para vendedor

- Dashboard comercial.
- CRM y agenda de seguimiento.
- PEOPLE para prospectos y clientes.
- Cotizaciones.
- Contracts en preparación y firma.
- Events originados por oportunidades ganadas, en vista resumida.
- Payments en forma de estado/saldo autorizado.
- Notifications y tareas.

---

# Relaciones entre módulos

## 5. Dependencias funcionales

| Módulo         | Consume                                                              | Motivo                                               |
| -------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| Identity       | PEOPLE                                                               | Vincular cuenta con identidad de negocio             |
| CRM            | PEOPLE                                                               | Prospecto/contacto sin duplicar identidad            |
| EVENTS         | PEOPLE                                                               | Participantes y contactos contextuales               |
| CONTRACTS      | PEOPLE, CRM, EVENTS                                                  | Partes, origen comercial y Event formalizado         |
| PAYMENTS       | CONTRACTS, EVENTS, PEOPLE                                            | Obligación contractual y pagador                     |
| INVITATIONS    | EVENTS, PEOPLE, NOTIFICATIONS                                        | Evento, anfitriones/invitados y comunicación         |
| MEDIA          | EVENTS, STORAGE                                                      | Contexto audiovisual y almacenamiento físico         |
| GALLERY        | EVENTS, MEDIA                                                        | Event y selección de assets existentes               |
| DELIVERABLES   | GALLERY, MEDIA, CONTRACTS, EVENTS                                    | Material, compromiso y destino                       |
| CLIENT PORTAL  | EVENTS, GALLERY, DELIVERABLES y futuras vistas de Contracts/Payments | Experiencia compuesta de lectura/acción autorizada   |
| Administration | Todos mediante configuración                                         | Flags, catálogos y widgets; no ownership del dominio |

## 5.1 Fachadas públicas observadas

- `PeopleFacade`: consumida por IAM, CRM, Contracts, Events e Invitations.
- `EventsFacade`: consumida por Invitations, Gallery y Client Portal.
- `NotificationsFacade`: consumida por Invitations y futuros productores.
- `MediaFacade`: consumida por Gallery.
- `GalleryFacade`: consumida por Deliverables y Client Portal.
- `ContractsFacade`: consumida por Payments.
- `CRMFacade`: consumida por Contracts.
- `DeliverablesFacade`: consumida por Client Portal.
- `AdministrationFacade`: configuración y flags para contextos autorizados.

## 5.2 Relaciones que deben verse en UI

- Opportunity → Person/Organization → Quotation → Contract → Event.
- Event → Participants y Event Sessions.
- Event → Contracts, Payments, Invitations, Media, Galleries y Deliverables como pestañas enlazadas.
- Contract → Parties, Versions, Signatures y Payment plan.
- Gallery → Albums → Media references.
- Deliverable → Items → Media/Gallery source.
- Invitation → Sections, Schedule y Guests/RSVP.

## 5.3 Relaciones que no deben representarse como edición embebida

- Editar una Person desde un formulario de Payment.
- Alterar Media metadata desde Gallery.
- Cambiar Contract desde Event con un select genérico.
- Cambiar Event desde Client Portal sin comando autorizado.
- Editar hechos de Timeline.
- Configurar permisos desde la ficha de un recurso de negocio.

---

# Entidades y Aggregate Roots

## 6. Catálogo conceptual

### 6.1 Identity & Access

- **User AR:** email, password hash, status, email verification, role IDs, claims y providers.
- **Role AR:** nombre, descripción y permission IDs.
- **Permission AR:** recurso + acción atómica.
- **Policy AR:** reglas ABAC evaluadas sobre claims y atributos.
- **Session AR:** dispositivo, IP, user agent, expiración, refresh hash y revocación.
- **APIKey AR:** nombre, scopes, hash, expiración y estado.

### 6.2 Administration

- **SystemSetting:** clave, valor, categoría y sensibilidad.
- **FeatureFlag:** key, activación y segmentación futura.
- **Catalog:** tipo, código, label y metadata.
- **DashboardWidget:** tipo, tamaño, posición, configuración y audiencia.

### 6.3 PEOPLE

- **Person AR:** code, nombre internacional, documento, contactos, dirección, estado y auditoría.
- **Organization AR:** code, razón/nombre, identificación tributaria, contactos, dirección y estado.

Client, fotógrafo, vendedor o invitado son roles contextuales; no reemplazan Person.

### 6.4 CRM

- **Opportunity AR:** contacto, origen, pipeline stage, valor, probabilidad y fechas.
- Entidades internas: Quotation, CRMActivity, CRMTask y CustomerJourney.

### 6.5 EVENTS

- **Event AR:** code, name, type, lifecycle status, production phase, date status, priority, timezone y brief.
- Entidades: EventSession y status history.
- Catálogos/referencias: EventType y Location.

### 6.6 CONTRACTS

- **Contract AR:** code, Event, estado, plantilla, vigencia y términos.
- Entidades: ContractVersion, ContractParty y ContractSignature.
- VO: ContractClause.

### 6.7 PAYMENTS

- **Payment AR:** code, Event/Contract, moneda, total, saldo, plan y estado.
- Entidades: PaymentInstallment y PaymentTransaction.

### 6.8 INVITATIONS

- **Invitation AR:** slug, Event, status, visibility, theme y expiración.
- Entidades: InvitationSection, InvitationSchedule e InvitationGuest.
- RSVP incluye respuesta, acompañantes, notas y preferencias relevantes.

### 6.9 MEDIA

- **MediaAsset AR:** code, Event, storage key, filename, MIME, type, status, checksum, size, dimensiones, duración y metadata.

### 6.10 GALLERY

- **Gallery AR:** Event, title, status, visibility, settings y publicación.
- Entidades: GalleryAlbum y GalleryAssetReference.

### 6.11 DELIVERABLES

- **Deliverable AR:** Event, type, status, delivery method, promised/delivered dates.
- Entidad: DeliverableItem.

### 6.12 NOTIFICATIONS

- **Notification AR:** channel, template/content, priority, schedule y status.
- **NotificationTemplate AR:** contenido reutilizable por canal.
- Entidades: NotificationRecipient y NotificationHistory.

### 6.13 CLIENT PORTAL y STORAGE

No tienen agregados de negocio propios. Client Portal compone modelos de lectura. Storage abstrae bytes y proveedor.

---

# Funcionalidades disponibles y faltantes

## 7. Funcionalidad disponible en backend

### Identity

- Registro, login, logout y refresh con rotación.
- Verificación de email y reset de contraseña.
- Creación de roles y permisos.
- Grants de permiso y asignación/revocación de rol.
- Policies ABAC.
- API keys con scopes.
- Listado y revocación de sesiones.

### Administration

- Settings.
- Feature flags.
- Catalogs.
- Dashboard widgets.
- Health administrativo.

### Dominios operativos

- CRUD, consulta y archivado/restauración de People, Events, CRM, Contracts, Payments, Media, Gallery, Deliverables, Invitations y Notifications.
- Comandos explícitos de transición propios de cada módulo.
- Client Portal con dashboard, summary, galleries, deliverables y timeline.

## 7.1 Funcionalidad faltante o no demostrada

- BackOffice Angular integrado con el backend NestJS.
- Client Portal Angular integrado con los endpoints del backend.
- Production planning completo: recursos, crew, asignaciones y ejecución.
- Dashboard ejecutivo real y analytics.
- Audit UI y búsqueda de acciones sensibles.
- Calendario unificado de Events, sesiones, tareas, pagos y entregas.
- Preferencias de notificación y centro de notificaciones en UI.
- Transporte de email/SMS/WhatsApp real.
- Adaptador S3/R2 de producción.
- Gateway de pagos y webhooks.
- Generación PDF contractual backend.
- Consumo durable del bus de eventos.
- Automatizaciones configurables.
- Multi-tenancy visible y aislamiento de estudio demostrado de extremo a extremo.
- UI accesible para roles/permisos/policies/API keys/sesiones.
- UI ERP para Payments, Events, CRM, Gallery y Deliverables.
- Flujos de selección/aprobación de Gallery completos.
- Gestión de equipo y disponibilidad.
- Búsqueda global y command palette.
- Centro de importación/exportación.
- Estados offline o reanudación de cargas grandes.

---

# Tipos de usuarios

## 8. Personas de producto

### 8.1 Superadministrador de plataforma

Gestiona tenants futuros, seguridad global, salud, flags e integraciones. Necesita vistas densas, trazabilidad y confirmaciones fuertes.

### 8.2 Dueño/administrador del estudio

Ve toda la salud del negocio. Alterna entre visión ejecutiva y operación. Requiere indicadores accionables, no métricas decorativas.

### 8.3 Vendedor/asesor comercial

Trabaja desde pipeline y agenda. Su unidad primaria es Opportunity, no Event. Necesita velocidad, seguimiento y próxima acción.

### 8.4 Coordinador/productor

Su unidad primaria es Event. Coordina sesiones, ubicaciones, brief, equipo, dependencias y fechas.

### 8.5 Fotógrafo/videógrafo

Necesita experiencia mobile-first para agenda, brief, contactos autorizados, ubicación, checklist y carga de material.

### 8.6 Editor/retocador

Trabaja con colas, Media Assets, versiones, estados de procesamiento, selección y Deliverables.

### 8.7 Finanzas

Trabaja con contratos ejecutados, obligaciones, vencimientos, transacciones, saldos y conciliación futura.

### 8.8 Cliente/anfitrión

No debe ver complejidad interna. Necesita próximos pasos, fechas, saldo, documentos, galería y entrega.

### 8.9 Invitado

Accede sin aprender el ERP. Consume una experiencia pública o restringida y responde RSVP.

### 8.10 Integración/API client

Usa API key y scopes. Su interfaz administrativa muestra emisión única de secreto, expiración, último uso y revocación.

---

# Permisos

## 9. Modelo de autorización traducido a UX

TECNOJACK usa RBAC + ABAC:

- **Role:** agrupa permisos.
- **Permission:** `resource:action`, por ejemplo `galleries:write`.
- **Policy:** condición contextual.
- **Claim:** atributo del usuario, como `tenantId` o `studioId`.
- **Scope:** límite de API key o acceso contextual.

### 9.1 Matriz orientativa por rol

| Área         | Admin | Vendedor               | Productor           | Fotógrafo             | Finanzas           | Cliente                 |
| ------------ | ----- | ---------------------- | ------------------- | --------------------- | ------------------ | ----------------------- |
| CRM          | Total | Operar asignadas       | Lectura relacionada | No                    | Lectura mínima     | No                      |
| People       | Total | Crear/editar contactos | Lectura/relación    | Contactos autorizados | Lectura de pagador | Perfil propio           |
| Events       | Total | Resumen/comercial      | Total operativo     | Asignados             | Resumen            | Event propio limitado   |
| Contracts    | Total | Crear/seguir           | Lectura             | No                    | Lectura            | Leer/firmar propios     |
| Payments     | Total | Estado limitado        | Estado limitado     | No                    | Total              | Ver/pagar propios       |
| Media        | Total | No                     | Supervisar          | Cargar/ver asignados  | No                 | Solo publicados         |
| Galleries    | Total | No                     | Supervisar          | Curar si asignado     | Bloqueo por pago   | Ver/seleccionar propias |
| Deliverables | Total | No                     | Coordinar           | Preparar asignados    | Liberación         | Ver/descargar propios   |
| IAM/Admin    | Total | No                     | No                  | No                    | No                 | Sesiones propias        |

Esta matriz es guía de diseño, no definición técnica definitiva. Las acciones visibles deben provenir de permisos efectivos; una acción deshabilitada debe explicar por qué cuando conocerla sea útil.

---

# Flujos completos

## 10. Journey comercial a entrega

1. Vendedor crea o vincula Person/Organization.
2. Registra Opportunity y fuente.
3. Añade actividades, tareas y próxima acción.
4. Prepara una o varias Quotations.
5. Cliente acepta; Opportunity se marca ganada.
6. Se prepara Contract con parties y versión congelada.
7. Contract se publica y el cliente revisa/acepta/firma.
8. Se crea Payment plan y sus installments.
9. Se crea/activa Event con EventType, brief, timezone y sesiones.
10. Productor confirma fechas, ubicaciones y equipo.
11. Si aplica, configura Invitation, invitados y RSVP.
12. El equipo ejecuta sesiones y carga Media Assets.
13. Gallery organiza activos y se publica al cliente.
14. Cliente selecciona o aprueba.
15. Deliverables se preparan, marcan listos y entregan.
16. Payment se completa y las políticas liberan descargas finales.
17. Event se completa/cierra y Timeline conserva el historial.

## 10.1 Journey del vendedor

- Dashboard comercial → pipeline → oportunidad → contacto → actividad → cotización → aceptación → preparar contrato → handoff a producción.
- Estados vacíos: sin oportunidades, etapa vacía, sin actividad, sin cotización.
- Alertas: seguimiento vencido, cotización expirada, contrato sin firma.

## 10.2 Journey del productor

- Dashboard operativo → calendario → Event workspace → brief → sesiones → ubicaciones → equipo → readiness → ejecución → handoff a postproducción.
- Alertas: fecha tentativa, conflicto, brief incompleto, ubicación sin confirmar, pago/contrato bloqueante.

## 10.3 Journey del fotógrafo

- Inicio personal → “Hoy” → detalle de sesión → navegación/mapa → brief y contactos → checklist → carga → confirmación de respaldo.
- Debe funcionar prioritariamente en móvil y con conectividad irregular.

## 10.4 Journey del editor

- Cola de Media → Event → filtros/selección → procesamiento → Gallery/Deliverable → revisión → listo.

## 10.5 Journey financiero

- Dashboard de cartera → vencimientos → Payment → installments → registrar transaction → comprobante → saldo → conciliación futura.

## 10.6 Journey del cliente

- Invitación/link/login → dashboard del Event → próximo paso → contrato → pago → cronograma → galería → selección → entregables → descarga/confirmación.

## 10.7 Journey del invitado

- Link personalizado → portada → detalles → itinerario → ubicación → dress code/regalos → RSVP → confirmación.

## 10.8 Journey administrativo

- Usuarios → roles → permisos → policies → sesiones/API keys.
- Settings → catalogs → feature flags → widgets → health.
- Audit → filtrar actor/recurso/acción → detalle inmutable.

---

# Catálogo completo de pantallas

## 11. Pantallas existentes en Angular

### 11.1 Sitio comercial y portafolio

- Brand landing.
- Portfolio home.
- Categorías: bodas, quinces, grados, preboda, corporativos y videos.
- Detalle de paquete por categoría.
- Grados para instituciones y estudiantes.
- Sobre mí.
- Otros servicios y modal de servicio.
- Soluciones.
- Clientes: grid y detalle con galería.
- Términos y condiciones.
- Video page, accordions, cards, grid y modal.

### 11.2 Invitaciones existentes

- Wedding page dinámica por slug e invitado.
- Diana/Juan–Marcela/Sebastián invitation especializada.
- Componentes Invitation, Passport y fondo temático.
- RSVP, acompañantes, agenda, galería, regalos, dress code, ubicación, audio y animaciones.

### 11.3 Contratos existentes

- Firma pública por token.
- Lista administrativa de contratos.
- Crear/editar contrato.
- Detalle administrativo.
- PDF viewer modal.
- Policy modal.
- Signature pad.

### 11.4 Media Admin existente

- Login.
- Gate de acceso.
- Explorador de archivos con sidebar y árbol.
- Breadcrumbs de storage.
- Upload zone.
- Grid de archivos.
- Modal de crear cliente y subir imágenes.
- Gestión de clientes.
- Solicitudes en lista y calendario.
- Acceso a contratos.

### 11.5 CMS Admin existente

Existen componentes de login, shell, dashboard, páginas y colecciones con Firebase/mock repositories, pero las rutas `/admin` actuales redirigen a `/media-admin`; por tanto, este CMS no constituye hoy una navegación pública activa equivalente al BackOffice ERP.

## 11.2 Pantallas necesarias del ERP

### Globales

1. Login.
2. Registro/invitación de usuario.
3. Recuperación y reset.
4. Verificación de email.
5. Selector de estudio/tenant futuro.
6. Dashboard por rol.
7. Centro de notificaciones.
8. Búsqueda global/command palette.
9. Perfil y seguridad.
10. Preferencias.
11. 403, 404, mantenimiento y sesión expirada.

### CRM

12. Pipeline kanban.
13. Lista de oportunidades.
14. Detalle de oportunidad.
15. Crear/editar oportunidad.
16. Cotización: editor, preview y estado.
17. Actividades y tareas.
18. Agenda comercial.
19. Motivo de pérdida/conversión.

### PEOPLE

20. Lista de personas.
21. Detalle de persona.
22. Formulario de persona.
23. Lista de organizaciones.
24. Detalle de organización.
25. Formulario de organización.
26. Detección/resolución futura de duplicados.

### EVENTS

27. Lista de Events.
28. Calendario de Events/Sessions.
29. Crear Event mediante wizard.
30. Event workspace/overview.
31. Brief.
32. Sessions list/timeline.
33. Session detail/form.
34. Locations catalog/form.
35. Participants.
36. Status history.
37. Cancel/complete/archive dialogs.

### CONTRACTS

38. Lista y filtros.
39. Create/edit wizard.
40. Detalle y timeline.
41. Version comparison.
42. Parties/signatures.
43. Public signing.
44. PDF/document preview.

### PAYMENTS

45. Cartera dashboard.
46. Lista de payments.
47. Payment detail/statement.
48. Plan de cuotas.
49. Registrar transacción.
50. Vencimientos.
51. Comprobante/receipt futuro.

### INVITATIONS

52. Lista de invitaciones.
53. Crear desde Event/template.
54. Editor de theme y secciones.
55. Preview desktop/mobile.
56. Schedule editor.
57. Guest list/import.
58. RSVP dashboard.
59. Portal público de invitado.

### PRODUCTION

60. Production board.
61. Team assignments.
62. Resource/equipment planner.
63. Crew calendar.
64. Daily call sheet.
65. Checklists y bloqueos.

### MEDIA

66. Media library.
67. Upload manager.
68. Asset detail/metadata.
69. Processing queue.
70. Duplicates/checksum report.
71. Bulk actions.

### GALLERY

72. Lista de galleries.
73. Gallery builder.
74. Albums/reordering.
75. Visibility/access settings.
76. Client gallery.
77. Selection review.

### DELIVERABLES

78. Lista/board.
79. Deliverable detail.
80. Items editor.
81. Ready/delivery workflow.
82. Client downloads.

### NOTIFICATIONS

83. Outbox/history.
84. Notification detail.
85. Template list/editor/preview.
86. Retry/cancel confirmation.
87. User preferences.

### ADMINISTRATION/IAM

88. Users.
89. User detail/roles/sessions.
90. Roles.
91. Permission matrix.
92. Policies editor.
93. API keys.
94. Settings.
95. Feature flags.
96. Catalogs.
97. Widget configuration.
98. System health.
99. Audit log.
100.  CMS content administration.

### CLIENT PORTAL

101. Client dashboard.
102. Event summary.
103. Timeline.
104. Contracts.
105. Payments.
106. Galleries.
107. Deliverables.
108. Invitation management.
109. Support/contact.

---

# Catálogo completo de componentes

## 12. Componentes existentes reutilizables conceptualmente

### Navegación y estructura

- Portfolio shell y navegación responsive.
- Admin shell con sidebar, contadores y sesión.
- Media Admin sidebar.
- Breadcrumbs del explorador.
- Layout de lista + editor lateral del CMS.

### Media

- Upload zone.
- Folder tree.
- File grid.
- Lazy image y fallback image.
- Gallery section/clients gallery.
- PhotoSwipe gallery.
- Progress bar de inicialización/carga.

### Formularios y overlays

- Modal base conceptual.
- Signature pad.
- PDF viewer.
- Policy modal.
- Formularios reactivos del CMS.
- Chips, selects relacionales y multiselect.
- File picker con preview.
- Toast/status.

### Contenido visual

- Hero, services, packages, video y contact sections.
- Cards de servicio/paquete/video.
- Accordions.
- Comparison table.
- Empty editor panel.
- RSVP y guest controls.
- Audio toggle.

## 12.1 Componentes necesarios para el nuevo producto

- App shell ERP.
- Collapsible sidebar con permisos.
- Topbar con search, context, notifications y profile.
- Breadcrumbs normalizados.
- Page header y action bar.
- Tabs y subnavigation.
- Data table enterprise.
- Filter bar y saved views.
- Pagination.
- Kanban board.
- Calendar/day/week/month.
- Timeline/activity feed.
- KPI card y chart container.
- Status badge y state stepper.
- Entity link/chip.
- User/avatar stack.
- Command confirmation dialog.
- Drawer de creación rápida.
- Wizard/stepper.
- Form section, field help y error summary.
- Currency, phone, address, date/timezone y file fields.
- Permission-aware action menu.
- Skeleton, spinner y progress.
- Empty state.
- Inline alert y banner.
- Toast.
- Error/retry state.
- Audit metadata.
- Media grid/list toggle.
- Upload queue con retry.
- Gallery lightbox/selection toolbar.
- Document viewer/signature flow.
- Responsive bottom navigation para roles de campo.

## 12.2 Qué puede reutilizarse

- Identidad visual cian/dorada y superficies oscuras.
- Montserrat para display e Inter para cuerpo.
- Tokens CSS existentes como referencia inicial.
- Upload zone, file grid, folder tree y previews, tras rediseñarlos dentro del sistema unificado.
- Patrones de cards, modales, toast, breadcrumbs y responsive.
- PhotoSwipe para visualización.
- Signature pad y vista de contrato como patrones funcionales.
- Componentes de invitación como laboratorio de themes.
- Respeto por `prefers-reduced-motion`.

## 12.3 Qué no debe trasladarse como base del ERP

- El shell de portafolio como navegación interna.
- Emojis como iconografía operativa.
- Estilos inline extensos y tokens locales incompatibles.
- Duplicación de botones, inputs y modales por feature.
- Rutas catch-all de wedding para navegación autenticada.
- Firebase/mock stores como modelo conceptual del nuevo backend.
- Nombre y framing “Wedding Engine” para el producto SaaS completo.
- CMS antiguo como arquitectura de BackOffice.
- Sidebar Media Admin rígido de 280 px como único shell.
- Tablas construidas como cards cuando se requiere comparación masiva.

“Descartar” significa no usar como fundamento del nuevo ERP; no implica borrar código existente.

---

# Catálogo completo de tablas

## 13. Tablas y vistas de datos necesarias

| Tabla         | Columnas esenciales                                                  | Acciones                               |
| ------------- | -------------------------------------------------------------------- | -------------------------------------- |
| Opportunities | code, contact, source, stage, value, probability, owner, next action | abrir, mover etapa, actividad, cotizar |
| People        | code, name, document, contacts, status                               | abrir, editar, archivar                |
| Organizations | code, legal name, tax ID, contact, status                            | abrir, editar, archivar                |
| Events        | code, name, type, next session, lifecycle, phase, date status, owner | abrir, activar, cancelar               |
| Sessions      | date/time, timezone, type, Event, location, status, crew             | abrir, reprogramar, confirmar          |
| Contracts     | code, Event, parties, version, status, expiration                    | abrir, publicar, enviar, archivar      |
| Payments      | code, client, Event, total, paid, balance, due date, status          | abrir, registrar pago                  |
| Installments  | number, due date, amount, paid, status                               | pagar, marcar vencida                  |
| Invitations   | code, Event, slug, visibility, guests, RSVP, status                  | editar, preview, publicar              |
| Guests        | name, party size, RSVP, dietary, sent status                         | editar, reenviar, exportar             |
| Media Assets  | preview, filename, type, Event, session, size, processing, owner     | ver, editar, descargar, archivar       |
| Galleries     | code, Event, assets, visibility, selections, status                  | editar, publicar                       |
| Deliverables  | code, Event, type, promised date, status, method                     | abrir, ready, deliver                  |
| Notifications | channel, recipient, template, scheduled, status, attempts            | ver, cancel, retry                     |
| Users         | code, email, person, status, roles, last access                      | abrir, suspend, sessions               |
| Roles         | name, users, permissions                                             | editar, clonar                         |
| Sessions      | user, device, IP, created, expires, status                           | revoke                                 |
| API Keys      | name, owner, scopes, created, last used, expires                     | revoke/rotate                          |
| Audit         | date, actor, action, resource, result, request ID                    | detalle                                |

Todas requieren estados de loading, empty, error, permisos insuficientes, filtros sin resultados y paginación.

---

# Catálogo completo de formularios

## 14. Formularios por dominio

- Auth: login, register, verify email, forgot/reset password.
- User: identity link, status, roles, claims y sessions.
- Role: name, description y permission matrix.
- Policy: effect, resource/action y condition builder.
- API key: name, scopes y expiration.
- Person: names, document, phones, emails, address y status.
- Organization: legal name, tax document, contacts y address.
- Opportunity: contact, source, owner, stage, value, probability y dates.
- Quotation: services, quantities, discounts, taxes, validity y notes.
- Activity/task: type, outcome, due date, assignee y notes.
- Event wizard: type → identity → participants → dates/timezone → brief → review.
- Event Session: type, range, timezone, location, status y notes.
- Location: name, address, map coordinates e instructions.
- Contract: template, parties, clauses, amounts, dates y version.
- Contract signature: acceptances, identity confirmation y signature.
- Payment: Event/Contract, total, currency, plan y installments.
- Transaction: amount, method, date, reference y evidence.
- Invitation: Event, slug, visibility, theme, expiration y music.
- Invitation section/schedule/guest/RSVP.
- Media registration/upload/metadata.
- Gallery: Event, title, visibility, settings, albums y assets.
- Deliverable: type, promised date, method e items.
- Notification: channel, template, recipients, variables y schedule.
- Notification template: subject/body/channel/variables.
- Setting, feature flag, catalog y dashboard widget.

### 14.1 Reglas comunes de formularios

- Autosave solo donde sea seguro; transiciones nunca implícitas.
- Resumen de errores al enviar y error por campo.
- Diferenciar required, optional y read-only.
- Confirmar pérdida de cambios.
- Timezone visible en fechas operativas.
- Moneda y formato regional explícitos.
- Acciones destructivas con impacto y entidad nombrada.
- Mobile: teclado/tipo de input correcto, secciones cortas y CTA fijo cuando sea útil.

---

# Catálogo completo de dashboards

## 15. Dashboards requeridos

### 15.1 Ejecutivo

- Ventas del periodo.
- Pipeline y conversión.
- Ingresos, cartera y vencimientos.
- Events próximos/en riesgo.
- Capacidad de equipo.
- Producción y entregables atrasados.
- Alertas críticas.

### 15.2 Comercial

- Opportunities por etapa.
- Forecast.
- Tareas y seguimientos vencidos.
- Cotizaciones pendientes.
- Contratos por firmar.

### 15.3 Operativo

- Agenda de hoy/semana.
- Events por fase.
- Sesiones sin confirmar.
- Bloqueos de contrato/pago/brief.
- Cargas pendientes y entregas próximas.

### 15.4 Fotógrafo

- Próxima sesión.
- Agenda personal.
- Briefs pendientes de lectura.
- Uploads incompletos.
- Tareas/entregables asignados.

### 15.5 Finanzas

- Total por cobrar.
- Vencido.
- Cobros próximos.
- Transacciones recientes.
- Events bloqueados por saldo.

### 15.6 Cliente

- Próximo paso.
- Estado general del Event.
- Próxima fecha.
- Contrato.
- Saldo/pago.
- Gallery y Deliverables.
- Timeline.

### 15.7 Administración

- Usuarios activos/bloqueados.
- Sesiones/API keys.
- Feature flags.
- Salud de DB/storage/notificaciones.
- Actividad sensible reciente.

---

# Navegación completa

## 16. Arquitectura de información recomendada

### BackOffice principal

```text
Inicio
CRM
  Pipeline
  Oportunidades
  Actividades y tareas
Personas
  Personas
  Organizaciones
Eventos
  Lista
  Calendario
Producción
Media
  Biblioteca
  Cargas
Galerías
Entregables
Contratos
Pagos
Invitaciones
Notificaciones
Reportes
Administración
  Usuarios y acceso
  Configuración
  Catálogos
  Feature flags
  Widgets
  Auditoría
  Salud e integraciones
  CMS
```

### Event workspace

```text
Resumen | Brief | Sesiones | Participantes | Producción | Contratos |
Pagos | Invitación | Media | Galerías | Entregables | Timeline
```

Las pestañas se muestran por disponibilidad y permiso. Las acciones siguen perteneciendo al módulo fuente.

### Client Portal

```text
Inicio | Mi evento | Contratos | Pagos | Invitación | Galerías | Entregables | Ayuda
```

### Mobile para equipo de campo

```text
Hoy | Agenda | Cargar | Tareas | Más
```

## 16.1 Navegación actual del frontend

- `/brand` como entrada.
- `/portfolio` y categorías/paquetes.
- `/otros`, `/soluciones`, `/clientes`, `/terminos-y-condiciones`.
- `/contratar` y `/contratar/:token`.
- `/media-admin`, `/media-admin/clientes`, `/solicitudes`, `/contratos`.
- Rutas públicas de invitación/wedding por slug e invitado.
- `/admin` redirige a `/media-admin`.
- Catch-all dinámico de wedding antes de wildcard final.

No existen topbar, sidebar, breadcrumbs y navegación ERP unificados; cada feature aplica su propio shell.

---

# Arquitectura del Frontend

## 17. Estado actual de Angular

- Angular 17.3.
- Componentes standalone y lazy loading por ruta.
- RxJS y Angular Signals.
- SCSS global y por componente.
- Firebase/AngularFire para datos, auth, storage y CMS actuales.
- Angular CDK DragDrop en CMS.
- Font Awesome.
- PhotoSwipe.
- GSAP y Lottie.
- `angular-calendar` y `date-fns`.
- `pdf-lib` para contratos actuales.
- 74 componentes, 45 servicios, 44 HTML, 44 SCSS y 3 specs observados.

### 17.1 Angular Material

No está instalado ni utilizado. Angular CDK sí aparece para drag-and-drop. No deben diseñarse componentes asumiendo estilos Material preexistentes.

### 17.2 Tailwind

No está configurado ni usado por la aplicación. Una referencia indirecta aparece en `package-lock`, no como design system activo.

### 17.3 Organización actual

- `core`: modelos, Firebase, servicios y utilidades.
- `features`: admin, brand, contracts, invitations, media-admin, portfolio, solutions y wedding.
- `shared`: backgrounds, destination y images.
- Muchos componentes contienen template y styles inline; otros usan archivos separados.

### 17.4 Datos actuales

El frontend usa modelos propios de Wedding, Guest, Client, contratos y CMS. Estos no equivalen automáticamente a los DTOs del backend DDD. Para diseño deben mapearse por contrato de pantalla, no por igualdad de nombres.

---

# Componentes reutilizables

## 18. Evaluación

### Reutilización alta

- Lazy/fallback images.
- PhotoSwipe/lightbox.
- Signature pad.
- PDF viewer.
- Upload zone y previews.
- Folder tree y file grid para Media.
- Reduced-motion handling.
- Patrones responsive de invitaciones y portafolio.

### Reutilización conceptual, no literal

- Sidebars actuales.
- Admin list/editor panel.
- Cards, badges, filters y toasts.
- Calendar de solicitudes.
- Contract list/form/detail.
- CMS collection editor.

### Solo para superficies públicas/marketing

- Portfolio shell.
- Hero y storytelling sections.
- Package cards/comparison.
- Video/gallery presentation.
- Invitation themes y animations.

### No usar como sistema base

- Componentes que duplican controles con estilos locales.
- Iconografía emoji.
- Clases globales dependientes de una página concreta.
- Colores hardcoded divergentes.
- Layouts de altura fija sin navegación mobile integral.

---

# Design System actual

## 19. Identidad visual observada

### 19.1 Paletas

**Base/Invitation travel:**

- Primary olive: `#6e7f67`.
- Primary dark: `#3f4f44`.
- Background cream: `#f3efe6`.
- Text navy: `#1e2f36`.
- Accent gold: `#c6a75e`.
- Surface: `#ffffff`.

**Portfolio y Media Admin:**

- Brand cyan: `#0097b2`.
- Bright cyan usado localmente: `#00d4ff`.
- Deep teal: `#063a45`.
- Backgrounds: `#041217`, `#05171c`, `#030b0e`, `#0a0a0c`.
- Accent gold/yellow: `#ffb800`, `#f3ad3a`.
- Text: `#f4fcff`.
- Surfaces translúcidas oscuras.

### 19.2 Tipografía

- Display/headings: Montserrat.
- Body: Inter con fallbacks de sistema.
- Invitaciones especiales usan serif como Playfair Display.

### 19.3 Forma y profundidad

- Radios frecuentes de 16–20 px.
- Pills de 999 px.
- Gradientes, radial glows, glassmorphism y blur.
- Borders de baja opacidad.
- Sombras profundas en superficies oscuras.

### 19.4 Motion

- GSAP/Lottie y transiciones propias.
- Reveal on scroll.
- Hover con elevación/scale.
- Shimmer de imágenes.
- Respeto parcial y repetido por `prefers-reduced-motion`.

### 19.5 Dark mode

No existe un switch global light/dark consistente. Hay superficies inherentemente oscuras y temas por ruta. `color-scheme: dark` aparece localmente.

### 19.6 Responsive

Hay numerosos breakpoints entre 460 y 1200 px y uso de `clamp`, grids adaptativos y media queries. La adaptación existe, pero no deriva de una escala única documentada.

---

# Design System recomendado

## 20. Dirección para Figma

La recomendación es un sistema único con tres modos de experiencia, no tres productos visualmente inconexos:

1. **Operations:** ERP oscuro o neutral, denso y eficiente.
2. **Client:** limpio, cálido y simplificado, con marca del estudio.
3. **Experience:** invitaciones y galerías altamente tematizables.

### 20.1 Foundations

- Escala de color semántica: brand, neutral, success, warning, danger, info.
- Tokens de surface por elevación.
- Tipografía Montserrat/Inter preservada.
- Espaciado base 4 px.
- Radios normalizados: 8, 12, 16 y full.
- Elevaciones moderadas; reservar glow para marca/marketing.
- Iconografía SVG consistente.
- Grid desktop de 12 columnas y mobile de 4.
- Breakpoints compartidos.
- Motion tokens y reduced motion.

### 20.2 Temas

- Operations dark.
- Operations light opcional, diseñado desde tokens.
- Client light/brand.
- Invitation theme variables por Event/Invitation.

### 20.3 Component architecture en Figma

Crear componentes con variantes y estados:

- Default, hover, focus, active, disabled, loading y error.
- Size: compact, default, comfortable.
- Permission: enabled, hidden y disabled-with-reason.
- Density para tablas y formularios.
- Responsive properties para shell y cards.

### 20.4 Accesibilidad

- WCAG AA como mínimo.
- Focus visible.
- Contraste verificado en cyan/gold sobre oscuro.
- No depender solo de color para estados.
- Targets táctiles de al menos 44 px.
- Tablas navegables y labels persistentes.
- Motion reducible.

---

# Estados UX transversales

## 21. Estados obligatorios por pantalla

### Loading

- Skeleton para listas, cards y detalle.
- Spinner solo para acciones cortas.
- Progress determinado para upload, import y procesamiento.
- Estado “procesando en segundo plano” persistente.

### Empty

- Primer uso con explicación y CTA.
- Sin resultados por filtros con “Limpiar filtros”.
- Vacío por permiso sin sugerir que no existe información.
- Vacío dependiente: “Crea un Event antes de una Gallery”.

### Error

- Error recuperable con retry.
- Validación de formulario.
- Conflicto de concurrencia.
- Recurso archivado/no disponible.
- Integración externa caída.
- Upload parcial.
- Sesión expirada.
- 403/404/500.

### Success

- Confirmación discreta para guardado.
- Pantalla/receipt para firma, pago, publicación y entrega.
- Próxima acción sugerida.

### Destructive/critical

- Cancelar Event.
- Archivar/restaurar.
- Revocar sesión/API key.
- Despublicar Gallery/Invitation.
- Registrar Payment transaction.
- Ejecutar Contract.

Cada diálogo debe nombrar entidad, impacto, reversibilidad y resultado.

---

# Oportunidades de mejora UX

## 22. Hallazgos

- Unificar las herramientas separadas dentro de una arquitectura de información ERP.
- Convertir Event en workspace navegable y no en formulario monolítico.
- Diseñar dashboards por rol en lugar de uno universal.
- Priorizar próxima acción, bloqueos y vencimientos.
- Añadir saved views y filtros persistentes en módulos densos.
- Diseñar creación rápida de Person, Opportunity, Event y Payment sin perder contexto.
- Exponer Timeline como lectura con links al origen.
- Separar estados administrativos, productivos y temporales de Event.
- Dar a fotógrafos un flujo móvil “Hoy”.
- Diseñar uploads resistentes, reanudables y con errores por archivo.
- Mostrar timezone siempre en sesiones.
- Evitar que clientes vean terminología interna.
- Hacer transparente por qué una descarga o acción está bloqueada.
- Conectar contrato, pago, Event y entrega mediante indicadores, sin mezclar ownership.

---

# Oportunidades de mejora UI

## 23. Hallazgos

- Consolidar paletas actualmente duplicadas.
- Sustituir emojis operativos por iconos consistentes.
- Crear componentes base en lugar de estilos locales repetidos.
- Moderar glassmorphism en tablas y formularios densos.
- Reservar gold para énfasis y cyan para marca/acción primaria con semántica consistente.
- Normalizar border radius, sombras, inputs y botones.
- Definir densidad compacta para ERP y cómoda para portal.
- Crear dark/light mediante tokens, no clases por ruta.
- Separar estética editorial del portafolio y estética de productividad.
- Normalizar breakpoints y anchuras máximas.

---

# Roadmap de diseño

## 24. Fases

### Fase 0 — Foundations

- Arquitectura de información.
- Personas y permission matrix.
- Tokens, grid, typography, color y accessibility.
- Componentes básicos.
- App shell.
- Estados transversales.

### Fase 1 — Núcleo operativo

- Login y dashboard.
- PEOPLE.
- EVENTS list/calendar/workspace.
- Event Sessions y brief.

### Fase 2 — Comercial y formalización

- CRM.
- Quotations.
- Contracts y firma.
- Payments.

### Fase 3 — Cadena audiovisual

- Production.
- Media library/upload.
- Galleries.
- Deliverables.

### Fase 4 — Experiencias externas

- Client Portal.
- Invitation builder/guest portal.
- Client galleries y downloads.

### Fase 5 — Administración y escala

- IAM.
- Administration.
- Notifications.
- Audit.
- Analytics y automation futuras.

---

# Orden recomendado para diseñar las pantallas

## 25. Secuencia exacta

1. Foundations y tokens.
2. App shell desktop/tablet/mobile.
3. Login, recovery y 403/404.
4. Componentes de tabla, filtro, formulario, modal y estados.
5. Dashboard operativo.
6. People list/detail/form.
7. Events list y calendar.
8. Event workspace y tabs.
9. Event Session/brief/location.
10. CRM pipeline y Opportunity detail.
11. Quotation.
12. Contract list/detail/editor/signing.
13. Payments dashboard/detail/transaction.
14. Production board y personal “Today”.
15. Media library/upload/asset detail.
16. Gallery builder/client gallery.
17. Deliverables.
18. Client Portal dashboard/timeline.
19. Invitation builder y guest experience.
20. Notifications.
21. IAM/Administration/Audit.
22. Analytics y variantes avanzadas.

Diseñar primero los flujos end-to-end de una boda y un evento corporativo, y luego validar que las estructuras funcionen para grados, quinces, sesiones y contenido social.

---

# Recomendaciones para Figma AI

## 26. Instrucciones de generación

- Tratar TECNOJACK como ERP audiovisual SaaS, no wedding planner.
- Usar los nombres de dominio oficiales en capas internas.
- Mantener Event como workspace compuesto.
- Generar variantes desktop 1440, tablet 1024 y mobile 390.
- Incluir estados loading, empty, error, success y permission-denied en cada flujo.
- Crear componentes y variables antes de pantallas completas.
- No inventar campos que transfieran ownership entre módulos.
- No diseñar actualización genérica para transiciones críticas.
- Mostrar timezone, moneda, estado y audit metadata donde aplique.
- Diferenciar Operations, Client y Experience themes.
- Usar datos de ejemplo variados: boda, corporativo, quince, grado, video musical y sesión.
- Evitar lorem ipsum; usar contenido audiovisual realista en español de Colombia.
- Diseñar tablas densas para escritorio y cards/summary rows para móvil.
- Añadir anotaciones de permisos y fuente de datos a componentes críticos.
- Marcar cada pantalla con módulo, rol, endpoint/capacidad y estados.

### 26.1 Prompt base para Figma AI

> Diseña una plataforma ERP SaaS para estudios audiovisuales llamada TECNOJACK. Usa un sistema visual profesional oscuro basado en deep teal, cyan y gold, con Montserrat para títulos e Inter para texto. La navegación principal es modular y Event funciona como workspace central sin apropiarse de contratos, pagos, medios o entregables. Diseña para roles y permisos, incluye estados completos y versiones responsive. No uses patrones de wedding planner genérico ni copies una landing page comercial.

---

# Recomendaciones para Angular

## 27. Implicaciones de diseño para implementación

Estas recomendaciones describen contratos de diseño, no refactors de código:

- Documentar componentes Figma con nombres agnósticos de dominio cuando sean realmente compartidos.
- Mantener componentes de dominio para estados y acciones especializadas.
- Entregar tokens como variables semánticas, no valores por pantalla.
- Especificar comportamiento responsive, keyboard, focus y reduced motion.
- Definir loading/error/empty como parte del contrato del componente.
- Mapear cada vista a DTOs públicos, nunca a modelos Prisma.
- Indicar acciones ocultas o deshabilitadas según permisos.
- Preparar layouts para lazy-loaded feature areas.
- Evitar que Figma dependa de Angular Material o Tailwind, porque no existen actualmente.
- Documentar variantes de densidad para tables/forms.
- Mantener invitaciones tematizables sin contaminar el shell ERP.

---

# Riesgos encontrados

## 28. Riesgos funcionales y de diseño

### 28.1 Frontend actual no corresponde al frontend descrito por el roadmap backend

El Architecture Report afirma “Frontend Angular no iniciado”, pero existe una aplicación Angular separada y madura en marketing/invitaciones/CMS. La lectura correcta es: el **frontend ERP conectado al nuevo backend** no está iniciado de manera integral.

### 28.2 Dos sistemas conceptuales superpuestos

El frontend conserva Firebase, modelos Wedding/Client y CMS propios, mientras el backend usa DDD, Event/People y PostgreSQL. Diseñar usando los modelos actuales como fuente produciría duplicaciones.

### 28.3 Navegación fragmentada

Portfolio, CMS, Media Admin, contratos e invitaciones tienen shells y estilos diferentes. Sin arquitectura de información común, el producto se percibirá como herramientas pegadas.

### 28.4 Seguridad invisible en frontend actual

El backend dispone de RBAC+ABAC, pero la UI ERP aún no representa scopes, policies, sesiones y estados de autorización.

### 28.5 Production ausente

El ERP se define para estudios audiovisuales, pero PRODUCTION no aparece como módulo completo. Si se ignora en diseño, Event o Media absorberán su responsabilidad.

### 28.6 Exceso de confianza en “backend completo”

Los reportes señalan pendientes: consumidores de eventos, email transport, cloud storage, payment gateway, PDF backend y migraciones de producción. Los diseños deben representar estados pendientes/fallidos y no asumir automatización instantánea.

### 28.7 Design system no unificado

Hay buenos patrones y una marca reconocible, pero tokens, componentes, breakpoints y dark mode no están gobernados como sistema único.

### 28.8 Baja cobertura observable del frontend

Solo se observaron tres specs frente a 74 componentes. Para UX esto aumenta el riesgo de que comportamientos implícitos no estén estabilizados.

### 28.9 Densidad y accesibilidad

El uso fuerte de superficies oscuras, textos de baja opacidad, gold/cyan y glassmorphism requiere validación sistemática de contraste. Los emojis no son una iconografía predecible.

### 28.10 Multi-tenancy

IAM anticipa `tenantId/studioId`, pero la experiencia de cambio de estudio, branding por tenant y límites visibles aún no está definida.

### 28.11 Endpoints versus experiencia

Un endpoint CRUD no equivale a un flujo usable. Algunos módulos tienen backend completo pero requieren composición, validación, permisos, bulk actions y estados para convertirse en producto.

---

# Inventario técnico de API para diseño

## 29. Familias de endpoints observadas

| Área                  | Capacidades HTTP                                                            |
| --------------------- | --------------------------------------------------------------------------- |
| `/auth`               | register, login, logout, refresh, verify email, reset password              |
| `/access`             | roles, grants, user roles, permissions, policies, API keys, sessions        |
| `/crm/opportunities`  | CRUD, stage, convert, quotations, activities, tasks                         |
| `/persons`            | create, list, detail, update, archive, restore                              |
| `/organizations`      | create, list, detail, update, archive, restore                              |
| `/events`             | CRUD, activate, phase, complete, cancel, archive, restore, sessions         |
| `/contracts`          | CRUD, publish, execute, archive, restore, versions, parties                 |
| `/payments`           | create, list, detail, transactions, installments, overdue, archive, restore |
| `/invitations`        | CRUD, duplicate, publish, unpublish, sections, schedules, guests, RSVP      |
| `/media-assets`       | register, list, detail, update, archive, restore                            |
| `/galleries`          | CRUD, publish, unpublish, albums, assets, archive, restore                  |
| `/deliverables`       | CRUD, ready, deliver, items, archive, restore                               |
| `/notifications`      | send/schedule, list, detail, cancel, retry, archive, templates              |
| `/admin`              | settings, feature flags, catalogs, widgets, health                          |
| `/client-portal`      | event dashboard, summary, galleries, deliverables, timeline                 |
| `/health`, `/version` | system status                                                               |

El catálogo backend reporta aproximadamente 140 rutas en 16 controladores. Para Figma no es necesario crear una pantalla por endpoint; deben agruparse en journeys coherentes.

---

# Business Processes

## 30. Procesos transversales adicionales

### Archivado y restauración

La mayoría de agregados usa soft delete. Las listas necesitan filtro “Archivados”, indicador visible y acción Restore. Archivar no debe confundirse con cancelar, completar o desactivar.

### Publicación

Contract, Invitation y Gallery distinguen draft/publicado. Publicar cambia visibilidad y dispara comunicaciones potenciales; requiere preview y confirmación.

### Estados financieros

Payment agrega installments y transactions. El saldo debe derivarse de movimientos válidos; UI debe distinguir obligación, cuota y transacción.

### Carga audiovisual

Storage guarda bytes; Media registra activos; Gallery referencia; Deliverable agrupa resultados. La UI debe mantener esta cadena visible sin mostrar detalles técnicos innecesarios al cliente.

### Notificación

Crear → resolver recipients → renderizar template → enviar/programar → history → retry/cancel. Mostrar channel, attempts, status y causa del fallo.

### Seguridad

User → Role → Permission → Policy/Claims → decisión. Session y APIKey tienen ciclos independientes y revocables.

---

# Conclusiones

## 31. Conclusión ejecutiva

TECNOJACK es un ERP vertical event-first para estudios audiovisuales. El backend ya ofrece una base funcional extensa: 14 bounded contexts reportados, decenas de agregados, aproximadamente 85 casos de uso, 45 modelos Prisma, unas 140 rutas y un modelo IAM empresarial. La arquitectura protege ownership y permite componer el ciclo completo sin convertir Event en un objeto gigante.

El frontend actual aporta valor real, pero representa otra etapa del producto: sitio comercial, portafolio, invitaciones, contratos, CMS y media admin construidos como experiencias separadas, principalmente sobre Firebase. Es una fuente rica de marca, interacción, media, responsive y componentes especializados; no es la arquitectura visual final del ERP.

El diseño en Figma debe comenzar por foundations, roles, navegación y Event workspace. Después debe resolver un flujo vertical completo desde Opportunity hasta Deliverable, validándolo en varios tipos de producción. Las experiencias internas, del equipo de campo, del cliente y del invitado deben compartir marca y componentes, pero mantener densidad, permisos y objetivos distintos.

La regla final para todo diseño es:

> Una pantalla puede reunir contexto de todo el negocio, pero cada dato, estado y acción debe seguir perteneciendo a su módulo oficial.

---

## 32. Fuentes auditadas

- Platform Blueprint y ADR-001 a ADR-023.
- Infrastructure Proposal.
- Repository Architecture.
- System Overview, Domain Map, API Catalog, Event Catalog, Database Overview, Business Processes, Module Dependencies, Security, Storage/Media y Future Roadmap.
- Domain Designs de Events, People, Media, Gallery, Deliverables, Contracts, Payments, CRM, Client Portal e Identity.
- Module Overviews, Decision Logs y checklists disponibles.
- Código NestJS: módulos, entidades, casos de uso, DTOs, controladores, fachadas y guards.
- Prisma multiarchivo y migraciones.
- Frontend Angular en `D:\TECNOJACK`: rutas, componentes, plantillas, SCSS, modelos, servicios, Firebase, CMS, Media Admin, Contracts, Portfolio e Invitations.
