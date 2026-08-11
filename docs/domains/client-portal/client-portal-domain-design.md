# Client Portal Domain Design v1

## Especificación oficial del dominio CLIENT PORTAL de TECNOJACK

**Estado:** Aprobado como especificación oficial  
**Versión:** 1.0  
**Dominio:** CLIENT PORTAL  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 11 de agosto de 2026

---

## 1. Propósito del dominio

El dominio **CLIENT PORTAL** actúa como el servicio de experiencia unificada (BFF / Aggregation Domain) para los clientes de TECNOJACK. 

**Características clave:**
- **Sin almacenamiento propio**: No posee tablas Prisma ni entidades persistidas directamente.
- **Orquestación de fachadas**: Agrega información consolidada consumiendo exclusivamente `EventsFacade`, `GalleryFacade`, `DeliverableFacade` y `PeopleFacade`.
- **Enfoque de experiencia**: Proporciona a las aplicaciones cliente (web/móvil) una estructura lista para renderizar el Dashboard del Cliente sin exponer modelos o DTOs internos de otros módulos.

---

## 2. Ubiquitous Language

- **Client Dashboard**: Vista unificada completa de la experiencia del cliente para un evento.
- **Client Event Summary**: Resumen contextual del evento (código, estado general, fase productiva, brief creativo, fechas).
- **Client Gallery View**: Colección filtrada únicamente con galerías en estado `PUBLISHED`.
- **Client Deliverable View**: Estado de los entregables prometidos (fotografías, videos, USBs, álbumes).
- **Client Timeline**: Cronograma ordenado de hitos y sesiones relevantes para el cliente.
- **Client Next Action**: Acciones o recomendaciones próximas para el cliente (ej. revisar galería publicada, confirmar locación, preparar sesión).

---

## 3. Límites y Reglas de Negocio

1. **No Data Ownership**: CLIENT PORTAL no accede a la base de datos ni posee repositorios.
2. **Consumo por Fachadas**: Cualquier consulta a `EVENTS`, `GALLERY`, `DELIVERABLES` o `PEOPLE` se realiza a través de su `Facade` oficial.
3. **Filtro de Visibilidad**: El Portal sólo expone galerías en estado `PUBLISHED` y oculta información o borradores de uso interno administrativo.

---

## 4. Future Extension Points

Esta sección documenta formalmente los puntos de extensión previstos para el Portal del Cliente:

1. **Autenticación & Magiks Links / Portal Tokens**:
   - Autenticación passwordless vía enlaces mágicos temporales o JWT emitidos para participantes.
   - *Extensión*: Módulo `AUTH_CLIENT` validando tokens de acceso restringidos por `eventId` y `personId`.

2. **Visualización y Aceptación de Contratos (Contract Portal View)**:
   - Presentación de acuerdos y firma electrónica de contratos.
   - *Extensión*: Integración con `ContractFacade` y servicio de firmas criptográficas.

3. **Pasarela de Pagos & Estado Financiero (Payments & Invoicing View)**:
   - Consulta de planes de pago, abonos, saldos pendientes y descarga de recibos/facturas.
   - *Extensión*: Integración con `PaymentFacade` y pasarelas (Stripe, Wompi, PSE).

4. **Centro de Mensajería & Chat en Vivo (Client Messaging)**:
   - Comunicación directa entre el cliente y el productor asignado al evento.
   - *Extensión*: Servicio `MESSAGING_SERVICE` con WebSockets / SSE.

5. **Selección Activa de Fotos & Favoritos (Photo Proofing & Favorites)**:
   - Selección interactiva de fotografías para edición fina o impresión de álbum.
   - *Extensión*: Conexión con `GallerySelectionFacade`.

6. **Notificaciones y Preferencias de Contacto**:
   - Configuración de canales preferidos (WhatsApp, Email) y recepción de alertas de avance.
   - *Extensión*: Integración con `NotificationsFacade`.
