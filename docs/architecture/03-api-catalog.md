# API Catalog - TECNOJACK Endpoints

Catálogo oficial de todos los endpoints REST del backend. **Total: ~140 rutas** en 16 controladores.

---

## 1. Identity & Access – Authentication (`/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Autenticar y emitir JWT + Refresh Token |
| POST | `/auth/logout` | Cerrar sesión e invalidar Refresh Token |
| POST | `/auth/refresh` | Rotar Refresh Token y emitir nuevo par JWT |
| POST | `/auth/:id/verify-email` | Verificar email con código OTP |
| POST | `/auth/:id/reset-password` | Restablecer contraseña |

## 2. Identity & Access – Authorization (`/access`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/access/roles` | Crear nuevo rol |
| POST | `/access/roles/:id/grant/:permissionId` | Asignar permiso a rol |
| POST | `/access/users/:userId/roles/:roleId` | Asignar rol a usuario |
| DELETE | `/access/users/:userId/roles/:roleId` | Remover rol de usuario |
| POST | `/access/permissions` | Crear permiso atómico |
| GET | `/access/permissions` | Listar todos los permisos |
| POST | `/access/policies` | Crear política ABAC |
| POST | `/access/users/:userId/api-keys` | Generar API Key para usuario |
| DELETE | `/access/api-keys/:id` | Revocar API Key |
| GET | `/access/users/:userId/sessions` | Listar sesiones activas |
| DELETE | `/access/sessions/:id` | Terminar sesión específica |
| DELETE | `/access/users/:userId/sessions` | Terminar todas las sesiones de usuario |

---

## 3. CRM – Oportunidades (`/crm/opportunities`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/crm/opportunities` | Registrar nuevo lead/oportunidad |
| GET | `/crm/opportunities` | Listar oportunidades (paginado) |
| GET | `/crm/opportunities/:identifier` | Obtener oportunidad por ID o código |
| PATCH | `/crm/opportunities/:id` | Actualizar datos de oportunidad |
| POST | `/crm/opportunities/:id/stage` | Cambiar etapa del pipeline |
| POST | `/crm/opportunities/:id/convert` | Convertir a ganada/perdida |
| DELETE | `/crm/opportunities/:id` | Archivar oportunidad (soft delete) |
| POST | `/crm/opportunities/:id/restore` | Restaurar oportunidad archivada |
| POST | `/crm/opportunities/:id/quotations` | Adjuntar cotización |
| POST | `/crm/opportunities/:id/quotations/:quotationId/approve` | Aprobar cotización |
| POST | `/crm/opportunities/:id/quotations/:quotationId/reject` | Rechazar cotización |
| POST | `/crm/opportunities/:id/activities` | Registrar actividad de seguimiento |
| POST | `/crm/opportunities/:id/tasks` | Crear tarea en oportunidad |
| POST | `/crm/opportunities/:id/tasks/:taskId/complete` | Completar tarea |

---

## 4. Contracts (`/contracts`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/contracts` | Crear contrato |
| GET | `/contracts` | Listar contratos |
| GET | `/contracts/:identifier` | Obtener contrato por ID o código |
| PATCH | `/contracts/:id` | Actualizar contrato |
| POST | `/contracts/:id/publish` | Publicar contrato para firma |
| POST | `/contracts/:id/execute` | Ejecutar contrato (marcar como firmado) |
| DELETE | `/contracts/:id` | Archivar contrato |
| POST | `/contracts/:id/restore` | Restaurar contrato |
| POST | `/contracts/:id/versions` | Agregar versión al contrato |
| POST | `/contracts/:id/parties` | Agregar parte firmante al contrato |

---

## 5. Payments (`/payments`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/payments` | Crear registro de pago |
| GET | `/payments` | Listar pagos |
| GET | `/payments/:identifier` | Obtener pago por ID o código |
| POST | `/payments/:id/transactions` | Registrar transacción de abono |
| POST | `/payments/:id/installments` | Registrar cuota/parcialidad |
| POST | `/payments/:id/overdue` | Marcar pago como vencido |
| DELETE | `/payments/:id` | Archivar pago |
| POST | `/payments/:id/restore` | Restaurar pago |

---

## 6. Events (`/events`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/events` | Crear evento |
| GET | `/events` | Listar eventos |
| GET | `/events/:identifier` | Obtener evento por ID o código |
| PATCH | `/events/:id` | Actualizar evento |
| POST | `/events/:id/activate` | Activar evento (confirmar) |
| POST | `/events/:id/phase` | Cambiar fase de producción |
| POST | `/events/:id/complete` | Completar evento |
| POST | `/events/:id/cancel` | Cancelar evento |
| DELETE | `/events/:id` | Archivar evento |
| POST | `/events/:id/restore` | Restaurar evento |
| POST | `/events/:id/sessions` | Agregar sesión fotográfica |

---

## 7. Invitations (`/invitations`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/invitations` | Crear invitación digital |
| GET | `/invitations` | Listar invitaciones |
| GET | `/invitations/:identifier` | Obtener invitación por ID o código |
| PATCH | `/invitations/:id` | Actualizar invitación |
| POST | `/invitations/:id/duplicate` | Clonar invitación |
| POST | `/invitations/:id/publish` | Publicar invitación |
| POST | `/invitations/:id/unpublish` | Despublicar invitación |
| DELETE | `/invitations/:id` | Archivar invitación |
| POST | `/invitations/:id/restore` | Restaurar invitación |
| POST | `/invitations/:id/sections` | Agregar sección dinámica |
| POST | `/invitations/:id/schedules` | Agregar entrada de cronograma |
| POST | `/invitations/:id/guests` | Agregar invitado |
| POST | `/invitations/:id/guests/:guestId/rsvp` | Confirmar/rechazar RSVP del invitado |

---

## 8. Gallery (`/galleries`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/galleries` | Crear galería |
| GET | `/galleries` | Listar galerías |
| GET | `/galleries/:identifier` | Obtener galería por ID o código |
| PATCH | `/galleries/:id` | Actualizar galería |
| POST | `/galleries/:id/publish` | Publicar galería para el cliente |
| POST | `/galleries/:id/unpublish` | Despublicar galería |
| DELETE | `/galleries/:id` | Archivar galería |
| POST | `/galleries/:id/restore` | Restaurar galería |
| POST | `/galleries/:id/albums` | Crear álbum dentro de galería |
| POST | `/galleries/:id/assets` | Asociar asset multimedia a galería |
| DELETE | `/galleries/:id/assets/:mediaAssetId` | Remover asset de galería |

---

## 9. Media Assets (`/media-assets`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/media-assets` | Registrar asset multimedia |
| GET | `/media-assets` | Listar assets |
| GET | `/media-assets/:identifier` | Obtener asset por ID o código |
| PUT | `/media-assets/:id` | Actualizar metadatos del asset |
| DELETE | `/media-assets/:id` | Archivar asset |
| POST | `/media-assets/:id/restore` | Restaurar asset |

---

## 10. Deliverables (`/deliverables`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/deliverables` | Crear entregable |
| GET | `/deliverables` | Listar entregables |
| GET | `/deliverables/:identifier` | Obtener entregable |
| PATCH | `/deliverables/:id` | Actualizar entregable |
| POST | `/deliverables/:id/ready` | Marcar entregable como listo |
| POST | `/deliverables/:id/deliver` | Registrar entrega al cliente |
| DELETE | `/deliverables/:id` | Archivar entregable |
| POST | `/deliverables/:id/restore` | Restaurar entregable |
| POST | `/deliverables/:id/items` | Agregar ítem al entregable |
| DELETE | `/deliverables/:id/items/:itemId` | Remover ítem del entregable |

---

## 11. People – Persons (`/persons`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/persons` | Crear persona/contacto |
| GET | `/persons` | Listar personas |
| GET | `/persons/:identifier` | Obtener persona |
| PUT | `/persons/:id` | Actualizar persona |
| DELETE | `/persons/:id` | Archivar persona |
| POST | `/persons/:id/restore` | Restaurar persona |

---

## 12. People – Organizations (`/organizations`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/organizations` | Crear organización |
| GET | `/organizations` | Listar organizaciones |
| GET | `/organizations/:identifier` | Obtener organización |
| PUT | `/organizations/:id` | Actualizar organización |
| DELETE | `/organizations/:id` | Archivar organización |
| POST | `/organizations/:id/restore` | Restaurar organización |

---

## 13. Notifications (`/notifications`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/notifications` | Programar/enviar notificación |
| GET | `/notifications` | Listar notificaciones |
| GET | `/notifications/:identifier` | Obtener notificación |
| POST | `/notifications/:id/cancel` | Cancelar notificación pendiente |
| POST | `/notifications/:id/retry` | Reintentar notificación fallida |
| DELETE | `/notifications/:id` | Archivar notificación |
| POST | `/notifications/:id/restore` | Restaurar notificación |
| POST | `/notifications/templates` | Crear plantilla de notificación |
| GET | `/notifications/templates/:identifier` | Obtener plantilla |

---

## 14. Administration CMS (`/admin`)
| Method | Path | Description |
|--------|------|-------------|
| PUT | `/admin/settings` | Crear/actualizar configuración de sistema |
| GET | `/admin/settings` | Listar configuraciones (filtro por categoría) |
| POST | `/admin/feature-flags` | Registrar feature flag |
| PUT | `/admin/feature-flags/:key/toggle` | Habilitar/deshabilitar feature flag |
| GET | `/admin/feature-flags` | Listar feature flags |
| POST | `/admin/catalogs` | Agregar entrada de catálogo |
| GET | `/admin/catalogs` | Listar catálogos (filtro por tipo) |
| POST | `/admin/widgets` | Configurar widget de dashboard |
| GET | `/admin/widgets` | Listar widgets del dashboard |
| GET | `/admin/health` | Estado de salud del backend |

---

## 15. Client Portal (`/client-portal`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/client-portal/events/:eventIdentifier/dashboard` | Dashboard del evento para cliente |
| GET | `/client-portal/events/:eventIdentifier/summary` | Resumen ejecutivo del evento |
| GET | `/client-portal/events/:eventIdentifier/galleries` | Galerías disponibles del evento |
| GET | `/client-portal/events/:eventIdentifier/deliverables` | Entregables del evento |
| GET | `/client-portal/events/:eventIdentifier/timeline` | Timeline del evento |

---

## 16. System (`/`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health/live` | Liveness probe (Kubernetes) |
| GET | `/health/ready` | Readiness probe (Kubernetes) |
| GET | `/version` | Versión actual del API |
