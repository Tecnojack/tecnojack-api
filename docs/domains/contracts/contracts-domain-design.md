# Contracts Domain Design v1

## Especificación oficial del dominio CONTRACTS de TECNOJACK

**Estado:** Aprobado como especificación oficial  
**Versión:** 1.0  
**Dominio:** CONTRACTS  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 11 de agosto de 2026

---

## 1. Propósito del dominio

El dominio **CONTRACTS** es el único propietario de todos los acuerdos legales, términos de servicio, releases de derechos de imagen y contratos asociados a los Eventos (`Event`) y Entregables (`Deliverable`) en TECNOJACK.

**Diferenciación estricta:**
- **PEOPLE**: Proporciona las partes contratantes (`Person`, `Organization`).
- **EVENTS**: Administra el evento operacional.
- **DELIVERABLES**: Administra los entregables físicos y digitales.
- **CONTRACTS**: Administra los acuerdos legales, versionamiento de cláusulas, partes firmantes y estado del ciclo de vida del contrato.

---

## 2. Ubiquitous Language

- **Contract**: Aggregate Root. Representa el contrato o acuerdo legal.
- **ContractVersion**: Versión histórica del contenido contractual y sus cláusulas.
- **ContractClause**: Cláusula específica dentro de una versión de contrato (ej. "Términos de Pago", "Licencia de Uso de Imagen").
- **ContractParty**: Parte interviniente en el contrato (Proveedor, Cliente, Testigo, Garante).
- **ContractSignature**: Registro estructurado para el estado y metadatos de futura firma electrónica.
- **ContractStatus**: Ciclo de vida del contrato (`DRAFT`, `PENDING_SIGNATURE`, `PARTIALLY_SIGNED`, `EXECUTED`, `CANCELLED`, `EXPIRED`, `ARCHIVED`).
- **ContractTemplateType**: Clasificación de la plantilla base (`SERVICE_AGREEMENT`, `MODEL_RELEASE`, `INTELLECTUAL_PROPERTY`, `EVENT_TERMS`, `CUSTOM`).

---

## 3. Límites y Reglas de Negocio

1. **Un Evento puede tener múltiples Contratos** (`eventId`).
2. **Cada Contrato pertenece a un único Evento**.
3. **Un Contrato puede asociarse opcionalmente a un Entregable** (`deliverableId`).
4. **Desacoplamiento total**: `CONTRACTS` consume exclusivamente `EventsFacade`, `PeopleFacade` y `DeliverableFacade`.
5. **Estructuración para firmas electrónicas**: Administra `ContractSignature` como placeholders preparados para firma sin ejecutar integraciones externas de firma ni cargas biométricas.

---

## 4. Future Extension Points

Esta sección documenta formalmente las extensiones futuras del dominio CONTRACTS:

1. **Integración con Proveedores de Firma Electrónica (DocuSign / Adobe Sign / SignNow)**:
   - Envío automático de sobre (envelope) criptográfico.
   - *Extensión*: Adaptador `DocuSignSignatureProvider` implementando `ISignatureProvider`.

2. **Validación de Identidad Biométrica & Firma Criptográfica (Biometric e-ID)**:
   - Captura de hash SHA-256, geolocalización, dirección IP y foto de cédula/pasaporte.
   - *Extensión*: Módulo `BIOMETRIC_AUDIT` auditando `ContractSignature`.

3. **Motor de Renderizado y Generación de PDF (PDF Rendering Engine)**:
   - Transformación de plantillas HTML/Handlebars con datos dinámicos a documentos PDF normativos.
   - *Extensión*: Servicio `PDFRendererService` escuchando `ContractPublishedEvent`.

4. **Webhooks y Workflows de Firma Automáticos**:
   - Transición automática a estado `EXECUTED` tras la confirmación remota del webhook de la firma.
   - *Extensión*: Handler de Webhook en `CONTRACTS` reaccionando a callbacks externos.

5. **Vinculación con Pasarela de Pagos (Payment Execution Hook)**:
   - Desbloqueo de hitos de cobro en `PAYMENTS` una vez el contrato cambie a estado `EXECUTED`.
   - *Extensión*: Suscripción asíncrona de `PAYMENTS` a `ContractExecutedEvent`.
