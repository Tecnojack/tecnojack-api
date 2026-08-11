# Payments Domain Design v1

## Especificación oficial del dominio PAYMENTS de TECNOJACK

**Estado:** Aprobado como especificación oficial  
**Versión:** 1.0  
**Dominio:** PAYMENTS  
**Repositorio:** <https://github.com/Tecnojack/tecnojack-api.git>  
**Última actualización:** 11 de agosto de 2026

---

## 1. Propósito del dominio

El dominio **PAYMENTS** es el único propietario de toda la información financiera, planes de pago, cuotas, transacciones, cobros, abonos, devoluciones y saldos pendientes en TECNOJACK.

**Diferenciación estricta:**
- **EVENTS**: Administra el evento operacional.
- **CONTRACTS**: Administra el acuerdo legal.
- **DELIVERABLES**: Administra la entrega de bienes/servicios.
- **PEOPLE**: Administra pagadores (personas u organizaciones).
- **PAYMENTS**: Administra única y exclusivamente el estado financiero, montos, cuotas y registros de transacciones. **No se acopla a pasarelas específicas** (Stripe, Wompi, PayU, PSE, etc.).

---

## 2. Ubiquitous Language

- **Payment**: Aggregate Root. Representa el compromiso o expediente financiero global.
- **PaymentInstallment**: Cuota o hito de pago individual dentro de un plan de pagos.
- **PaymentTransaction**: Registro contable de un movimiento financiero (abono, pago completo, devolución, ajuste).
- **PaymentPlan**: Estrategia de cobro (`FULL_PAYMENT`, `INSTALLMENTS`, `MILESTONE_BASED`, `CUSTOM`).
- **PaymentMethod**: Medio por el cual se efectúa la transacción (`CASH`, `BANK_TRANSFER`, `CREDIT_CARD`, `DEBIT_CARD`, `MANUAL_RECORD`, `EXTERNAL_ADAPTER`, `OTHER`).
- **PaymentStatus**: Estado del pago global (`DRAFT`, `PENDING`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `REFUNDED`, `CANCELLED`, `ARCHIVED`).
- **TransactionType**: Tipo de movimiento registrado (`PAYMENT`, `PARTIAL_PAYMENT`, `REFUND`, `ADJUSTMENT`).

---

## 3. Límites y Reglas de Negocio

1. **Un Evento puede tener múltiples Pagos** (`eventId`).
2. **Un Contrato puede tener múltiples Pagos** (`contractId`).
3. **Un Entregable puede asociarse a un Pago** (`deliverableId`).
4. **Un Pago puede dividirse en múltiples Cuotas** (`PaymentInstallment`).
5. **Desacoplamiento total**: `PAYMENTS` consulta `EventsFacade`, `PeopleFacade`, `ContractsFacade` y `DeliverableFacade`.
6. **Sin acoplamiento a pasarelas**: `PAYMENTS` registra transacciones de forma neutral sin almacenar credenciales, tokens PCI o estructuras propietarias de pasarelas específicas.

---

## 4. Future Extension Points & Architecture Policy

En concordancia con las directivas del proyecto, todo servicio externo interactúa mediante la arquitectura de **Puertos (Ports) y Adaptadores (Adapters)**:

1. **Pasarelas de Pago Externa (Payment Gateway Adapters)**:
   - Adaptadores concretos (`StripeAdapter`, `WompiAdapter`, `PayUAdapter`, `MercadoPagoAdapter`) implementando la interfaz `IPaymentGatewayPort`.

2. **Webhooks & Confirmación Idempotente de Pagos**:
   - Escuchadores de webhooks procesados por adaptadores que mapean eventos externos a `RegisterTransactionUseCase`.

3. **Facturación Electrónica (DIAN / Electronic Invoicing)**:
   - Adaptador `DIANInvoiceAdapter` implementando `IElectronicInvoicingPort` para emisión de facturas legales tras la transacción.

4. **Notificaciones Multicanal & Recordatorios de Vencimiento**:
   - Recordatorios automáticos de cuotas vencidas o próximas a vencer mediante `INotificationsPort` (Email, WhatsApp, SMS).

5. **Puertos y Adaptadores Generales del Sistema**:
   - **Correo Electrónico**: `IEmailServicePort` -> `SendGridAdapter` / `AWS_SESAdapter`.
   - **WhatsApp & SMS**: `IMessagingServicePort` -> `TwilioAdapter`.
   - **Almacenamiento Cloud**: `ICloudStoragePort` -> `S3Adapter` / `R2Adapter`.
   - **Firma Electrónica**: `ISignatureProviderPort` -> `DocuSignAdapter`.
   - **IA / OCR / Facial**: `IAIServicePort` -> `GeminiAdapter` / `VisionAdapter`.
   - **Geolocalización**: `IGeolocationPort` -> `GoogleMapsAdapter`.
