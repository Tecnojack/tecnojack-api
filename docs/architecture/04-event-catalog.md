# Event Catalog - Domain Events

Catálogo completo de todos los Domain Events publicados por los Aggregate Roots.
**Total: ~80 eventos distintos** distribuidos en 12 dominios.

---

## CRM Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `OpportunityCreatedEvent` | `Opportunity` | Lead registrado en el pipeline |
| `OpportunityStageChangedEvent` | `Opportunity` | Cambio de etapa en el pipeline |
| `OpportunityConvertedEvent` | `Opportunity` | Oportunidad convertida (ganada/perdida) |
| `QuotationStatusChangedEvent` | `Opportunity` | Cotización aprobada o rechazada |
| `CRMActivityLoggedEvent` | `Opportunity` | Actividad de seguimiento registrada |
| `OpportunityArchivedEvent` | `Opportunity` | Oportunidad archivada (soft delete) |
| `OpportunityRestoredEvent` | `Opportunity` | Oportunidad restaurada |

---

## Contracts Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `ContractCreatedEvent` | `Contract` | Contrato creado en estado borrador |
| `ContractVersionAddedEvent` | `Contract` | Nueva versión del contrato registrada |
| `ContractPartyAddedEvent` | `Contract` | Parte firmante añadida |
| `ContractSignaturePreparedEvent` | `Contract` | Firma preparada para su validación |
| `ContractPublishedEvent` | `Contract` | Contrato publicado y listo para firma |
| `ContractExecutedEvent` | `Contract` | Contrato ejecutado/firmado oficialmente |
| `ContractArchivedEvent` | `Contract` | Contrato archivado |
| `ContractRestoredEvent` | `Contract` | Contrato restaurado del archivo |

---

## Payments Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `PaymentCreatedEvent` | `Payment` | Registro de pago creado |
| `PaymentInstallmentAddedEvent` | `Payment` | Cuota o parcialidad agregada |
| `PaymentCompletedEvent` | `Payment` | Pago liquidado en su totalidad |
| `PaymentTransactionRegisteredEvent` | `Payment` | Transacción de abono registrada |
| `PaymentOverdueEvent` | `Payment` | Pago marcado como vencido |
| `PaymentArchivedEvent` | `Payment` | Pago archivado |
| `PaymentRestoredEvent` | `Payment` | Pago restaurado |

---

## Events Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `EventCreatedEvent` | `Event` | Evento creado |
| `EventUpdatedEvent` | `Event` | Evento actualizado |
| `EventActivatedEvent` | `Event` | Evento confirmado/activado |
| `EventProductionPhaseChangedEvent` | `Event` | Fase de producción cambiada |
| `EventCompletedEvent` | `Event` | Evento completado exitosamente |
| `EventCancelledEvent` | `Event` | Evento cancelado |
| `EventSessionAddedEvent` | `Event` | Sesión fotográfica añadida al evento |
| `EventArchivedEvent` | `Event` | Evento archivado |
| `EventRestoredEvent` | `Event` | Evento restaurado |

---

## Invitations Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `InvitationCreatedEvent` | `Invitation` | Invitación digital creada |
| `InvitationPublishedEvent` | `Invitation` | Invitación publicada (accesible a invitados) |
| `GuestRSVPUpdatedEvent` | `Invitation` | Invitado confirmó o rechazó asistencia (RSVP) |

---

## Gallery Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `GalleryCreatedEvent` | `Gallery` | Galería creada |
| `GalleryPublishedEvent` | `Gallery` | Galería publicada para el cliente |
| `GalleryUnpublishedEvent` | `Gallery` | Galería despublicada |
| `GalleryAssetAddedEvent` | `Gallery` | Asset multimedia añadido a la galería |
| `GalleryAssetRemovedEvent` | `Gallery` | Asset removido de la galería |
| `GalleryArchivedEvent` | `Gallery` | Galería archivada |
| `GalleryRestoredEvent` | `Gallery` | Galería restaurada |

---

## Media Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `MediaAssetRegisteredEvent` | `MediaAsset` | Asset multimedia registrado |
| `MediaAssetUpdatedEvent` | `MediaAsset` | Metadatos del asset actualizados |
| `MediaAssetArchivedEvent` | `MediaAsset` | Asset archivado |
| `MediaAssetRestoredEvent` | `MediaAsset` | Asset restaurado |

---

## Deliverables Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `DeliverableCreatedEvent` | `Deliverable` | Entregable creado |
| `DeliverableStatusChangedEvent` | `Deliverable` | Estado del entregable actualizado |
| `DeliverableReadyEvent` | `Deliverable` | Entregable marcado como listo para entrega |
| `DeliverableDeliveredEvent` | `Deliverable` | Entregable entregado al cliente |
| `DeliverableItemAddedEvent` | `Deliverable` | Ítem agregado al entregable |
| `DeliverableItemRemovedEvent` | `Deliverable` | Ítem removido del entregable |
| `DeliverableArchivedEvent` | `Deliverable` | Entregable archivado |
| `DeliverableRestoredEvent` | `Deliverable` | Entregable restaurado |

---

## Identity & Access Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `UserCreatedEvent` | `User` | Usuario registrado en la plataforma |

---

## Notifications Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `NotificationCreatedEvent` | `Notification` | Notificación programada |
| `NotificationStatusChangedEvent` | `Notification` | Estado de notificación cambiado |
| `NotificationDispatchedEvent` | `Notification` | Notificación enviada exitosamente |
| `NotificationDispatchFailedEvent` | `Notification` | Notificación fallida |

---

## People Domain
| Event | Producer Entity | Description |
|-------|----------------|-------------|
| `PersonCreatedEvent` | `Person` | Persona/contacto creada |
| `PersonUpdatedEvent` | `Person` | Datos de persona actualizados |
| `PersonArchivedEvent` | `Person` | Persona archivada |
| `PersonRestoredEvent` | `Person` | Persona restaurada |
| `OrganizationCreatedEvent` | `Organization` | Organización creada |
| `OrganizationUpdatedEvent` | `Organization` | Organización actualizada |
| `OrganizationArchivedEvent` | `Organization` | Organización archivada |
| `OrganizationRestoredEvent` | `Organization` | Organización restaurada |

---

## Consumidores Proyectados
Los eventos actualmente se registran sobre el Aggregate Root y se propagan mediante el Bus de Eventos interno (`DomainEventBus`). Los consumidores proyectados para cada evento son:

| Evento | Consumidor Proyectado |
|--------|-----------------------|
| `ContractExecutedEvent` | Payments (iniciar plan de pagos) |
| `OpportunityConvertedEvent` | Contracts (preparar contrato) |
| `PaymentCompletedEvent` | Deliverables (liberar acceso) |
| `InvitationPublishedEvent` | Notifications (enviar correo) |
| `GalleryPublishedEvent` | Notifications (alertar cliente) |
| `DeliverableDeliveredEvent` | Notifications (confirmar entrega) |
| `GuestRSVPUpdatedEvent` | Notifications (confirmar asistencia) |
| `UserCreatedEvent` | Notifications (enviar bienvenida) |
