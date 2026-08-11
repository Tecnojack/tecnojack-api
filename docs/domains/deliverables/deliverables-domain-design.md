# Deliverables Domain Design v1

## Especificación oficial del dominio DELIVERABLES de TECNOJACK

**Estado:** Aprobado como especificación oficial  
**Versión:** 1.0  
**Dominio:** DELIVERABLES  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 11 de agosto de 2026

---

## 1. Propósito del dominio

El dominio **DELIVERABLES** es responsable de administrar el compromiso, seguimiento, empaquetado conceptual y registro de entrega de todos los resultados acordados para un Cliente respecto a un Evento (`Event`).

**Diferenciación estricta:**
- **STORAGE**: Administra binarios físicos.
- **MEDIA**: Administra archivos individuales y metadatos técnicos (`MediaAsset`).
- **GALLERY**: Administra la visualización y curaduría de fotos/videos.
- **EVENTS**: Administra el expediente operativo global.
- **DELIVERABLES**: Administra la entrega formal comprometida con el cliente (fotografías, videos, álbumes impresos, memorias USB, enlaces de descarga, etc.).

---

## 2. Ubiquitous Language

- **Deliverable**: Resultado acordado y producido para un Evento. Aggregate Root de este dominio.
- **DeliverableItem**: Elemento o componente específico dentro de un Entregable (ej. "Video Highlight", "Trailer 4K", "Álbum Físico 30x40").
- **DeliverableType**: Clasificación del entregable (`PHOTOS`, `VIDEOS`, `DIGITAL_ALBUM`, `PRINTED_ALBUM`, `USB_DRIVE`, `DOWNLOAD_LINK`, `CUSTOM`).
- **DeliverableStatus**: Ciclo de vida del entregable (`DRAFT`, `IN_PROGRESS`, `READY`, `DELIVERED`, `CANCELLED`, `ARCHIVED`).
- **DeliveryMethod**: Canal o medio de entrega (`DIGITAL_DOWNLOAD`, `PHYSICAL_SHIPPING`, `IN_PERSON_PICKUP`, `COURIER`, `THIRD_PARTY_SERVICE`, `OTHER`).

---

## 3. Límites y Reglas de Negocio

1. **Un Deliverable pertenece a un único Evento** (`eventId`).
2. **Un Evento puede tener múltiples Deliverables**.
3. **Un Deliverable no almacena binarios físicos ni duplica galerías**. Registra referencias livianas (`mediaAssetId`, `targetGalleryId`).
4. **Desacoplamiento total**: `DELIVERABLES` consulta `EventsFacade`, `MediaFacade`, `GalleryFacade` y `PeopleFacade`.

---

## 4. Future Extension Points

Esta sección documenta las extensiones futuras previstas sin alterar el modelo de dominio base:

1. **Firma Digital & Acta de Entrega (Digital Signatures & Acceptance)**:
   - Firma electrónica del cliente al recibir el entregable.
   - *Extensión*: Módulo `CONTRACTS` / `DELIVERY_ACCEPTANCE` asociando `deliverableId` con firma criptográfica.

2. **Seguimiento de Envíos y Guías de Mensajería (Carrier Tracking & Shipping Logistics)**:
   - Integración en tiempo real con APIs de courier (DHL, Servientrega, FedEx).
   - *Extensión*: Servicio `LOGISTICS_TRACKER` para actualización automática de `trackingNumber`.

3. **Confirmación Automática de Recibido (Proof of Delivery)**:
   - Confirmaciones de apertura y descargas verificadas por token.
   - *Extensión*: Eventos en `CLIENT_PORTAL` actualizando la confirmación de recepción.

4. **Notificaciones Automatizadas (Multi-channel Notifications)**:
   - Alertas por Email, WhatsApp y SMS cuando un entregable pase a estado `READY` o `DELIVERED`.
   - *Extensión*: Suscripciones asíncronas en `NOTIFICATIONS_SERVICE` reaccionando a `DeliverableReadyEvent`.

5. **Enlaces de Descarga Temporales y Generación ZIP (Secure Download Bundles)**:
   - Generación de presigned URLs y paquetes ZIP dinámicos.
   - *Extensión*: Integración vía `STORAGE` y `CLIENT_PORTAL`.
