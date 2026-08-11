# Future Roadmap - Next Architecture Steps

## 1. Estado Actual de Completitud

| Área | Estado |
|------|--------|
| Domain Layer (DDD) | ✅ Completo |
| Application Layer (Use Cases) | ✅ Completo |
| Infrastructure (Prisma Repositories) | ✅ Completo |
| Presentation (REST Controllers) | ✅ Completo |
| Security (IAM + RBAC + ABAC) | ✅ Completo |
| Domain Events (emisión) | ✅ Completo |
| Domain Events (consumo) | ⚠️ Pendiente — Bus físico no conectado |
| Email Transporter | ⚠️ Puerto definido, adaptador pendiente |
| Cloud Storage (S3) | ⚠️ Puerto definido, adaptador pendiente |
| Payment Gateway | ⚠️ Diseñado, adaptador de terceros pendiente |
| PDF Generation | ❌ No implementado |
| Frontend Angular | ❌ No iniciado |
| Migrations de Producción | ❌ Pendiente revisar con DBA |

---

## 2. Extensiones Preparadas (Ports Ready)

La Arquitectura Hexagonal asegura que las siguientes integraciones se puedan agregar **sin tocar la lógica de dominio**:

### Email Provider
- El `NotificationsModule` tiene definido el `NotificationTransportPort`.
- Para producción: implementar `SendGridTransportAdapter` o `ResendTransportAdapter`.

### Cloud Storage
- `StorageModule` tiene `StorageProvider` port.
- Para producción: implementar `S3StorageAdapter` con SDK de AWS o Cloudflare R2.

### Payment Gateways
- `PaymentsModule` está listo para recibir webhooks de Stripe, MercadoPago, o Conekta.
- Se necesita un `PaymentGatewayPort` y su adapter correspondiente.

---

## 3. Próximas Work Orders Proyectadas

| WO | Título | Prioridad |
|----|--------|-----------|
| WO-019 | Angular Frontend — Admin Panel | MÁXIMA |
| WO-020 | Angular Frontend — Client Portal | CRÍTICA |
| WO-021 | Email Transport Adapter (SendGrid/Resend) | CRÍTICA |
| WO-022 | S3 Storage Adapter (producción) | ALTA |
| WO-023 | Domain Event Bus (Redis/RabbitMQ) | ALTA |
| WO-024 | PDF Contract Generation | MEDIA |
| WO-025 | Production Database Migrations | MÁXIMA |

---

## 4. Escalabilidad Proyectada

La arquitectura actual permite tres caminos de escalamiento sin refactoring del dominio:

1. **Monolito Modular (actual)**: Un solo proceso NestJS con todos los módulos. Adecuado para la fase inicial.
2. **Vertical Slicing (intermedio)**: Separar en 2-3 procesos (ej: API principal + Worker de eventos) utilizando NestJS Microservices.
3. **Microservicios Puros (futuro)**: Cada Bounded Context se convierte en un servicio independiente dockerizado, manteniendo toda la lógica de dominio intacta.
