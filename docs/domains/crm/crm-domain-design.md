# CRM Domain Design v1

## Especificación oficial del dominio CRM de TECNOJACK

**Estado:** Aprobado como especificación oficial  
**Versión:** 1.0  
**Dominio:** CRM (Customer Relationship Management)  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 11 de agosto de 2026

---

## 1. Propósito del dominio

El dominio **CRM** es el único responsable de administrar y orquestar todo el ciclo comercial de TECNOJACK (Lead Generation, Prospecting, Pipeline Management, Cotizaciones, Conversiones a Evento y Seguimiento Comercial).

**Diferenciación estricta:**
- **PEOPLE**: Proporciona prospectos y contactos (`Person`, `Organization`).
- **EVENTS**: Administra el evento operativo una vez concretada la venta.
- **CONTRACTS**: Administra el acuerdo legal generado tras la aprobación comercial.
- **PAYMENTS**: Administra los cobros y planes de pago acordados.
- **CRM**: Administra la gestión de Leads, Oportunidades comerciales, Cotizaciones, Registro de Actividades (llamadas, reuniones, notas), Tareas y la Conversión Comercial del cliente.

---

## 2. Ubiquitous Language

- **Lead / Prospect**: Persona u Organización interesada en los servicios de la plataforma.
- **Opportunity**: Oportunidad de venta. Aggregate Root del dominio CRM.
- **CRMPipelineStage**: Etapas del embudo comercial (`NEW_LEAD`, `CONTACTED`, `MEETING_SCHEDULED`, `QUOTATION_SENT`, `NEGOTIATION`, `APPROVED`, `REJECTED`, `CONVERTED`, `ARCHIVED`).
- **Quotation**: Cotización comercial estructurada con rubros e ítems propuesta al cliente.
- **CustomerJourney**: Historial inmutable de transiciones de etapa de una Oportunidad Comercial.
- **CRMActivity**: Registro de interacciones comerciales (`CALL`, `MEETING`, `NOTE`, `EMAIL_LOG`, `OTHER`).
- **CRMTask**: Tarea con fecha límite asignada para seguimiento comercial (`dueDate`, `isCompleted`).

---

## 3. Límites y Reglas de Negocio

1. **CRM no posee Personas**: Consume `personId` u `organizationId` desde `PEOPLE`.
2. **CRM no posee Eventos**: Consume `eventId` desde `EVENTS` o invoca `eventsFacade.createEvent` al convertir una cotización aprobada.
3. **CRM no posee Contratos ni Pagos**: Vincula `contractId` y `paymentId` mediante `ContractsFacade` y `PaymentsFacade`.
4. **Pipeline Configurable & Extensible**: Permite transiciones de etapa y el registro inmutable en `CustomerJourney`.

---

## 4. Future Extension Points

Esta sección documenta los puntos de extensión futuros del dominio CRM:

1. **Integración con Notificaciones Multicanal (CRM Notifications)**:
   - Alertas automáticas por WhatsApp/Email al avanzar etapas del Pipeline o al vencer tareas.
   - *Extensión*: Suscripciones a `OpportunityStageChangedEvent`.

2. **Integración con Proveedores de Correo Electrónico (Email Marketing / Sync)**:
   - Sincronización bidireccional de correos enviados y recibidos con prospectos.
   - *Extensión*: Adaptador `EmailSyncAdapter` implementando `IEmailPort`.

3. **Integración con WhatsApp Business & SMS (Twilio Adapter)**:
   - Chatbots comercial de calificación de Leads e integración con bandeja de entrada.
   - *Extensión*: Adaptador `WhatsAppCRMAdapter` implementando `IMessagingPort`.

4. **Sincronización con Calendarios Externos (Google Calendar / Microsoft Outlook)**:
   - Creación automática de eventos en calendarios externos para reuniones comerciales (`MEETING_SCHEDULED`).
   - *Extensión*: Servicio `CalendarSyncService` implementando `ICalendarPort`.

5. **Asistente Comercial con Inteligencia Artificial (AI Lead Scoring & Sales Copilot)**:
   - Calificación automática de probabilidad de cierre, resúmenes de llamadas y generación inteligente de cotizaciones.
   - *Extensión*: Módulo `AI_SALES_COPILOT` consumiendo `AIServicePort`.

6. **Analítica Comercial & Pronósticos de Venta (Sales Analytics & Pipeline Forecasting)**:
   - Tableros predictivos de ingresos esperados por etapa y tasa de conversión de vendedores.
   - *Extensión*: Servicio `CRMAnalyticsService`.
