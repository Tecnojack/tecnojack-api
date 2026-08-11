# Module Dependencies - Technical Relationships

## 1. Mapa Técnico de Dependencias (AppModule)

```mermaid
graph TD
  AppModule --> PlatformModule[PlatformModule / PrismaService]
  AppModule --> IdentityModule
  AppModule --> AdministrationModule
  AppModule --> PeopleModule
  AppModule --> CRMModule
  AppModule --> EventsModule
  AppModule --> ContractsModule
  AppModule --> PaymentsModule
  AppModule --> InvitationsModule
  AppModule --> GalleryModule
  AppModule --> MediaModule
  AppModule --> DeliverablesModule
  AppModule --> NotificationsModule
  AppModule --> StorageModule
  AppModule --> ClientPortalModule
  AppModule --> SystemModule

  CRMModule -->|imports PeopleModule| PeopleModule
  ContractsModule -->|imports PeopleModule| PeopleModule
  ContractsModule -->|imports CRMModule| CRMModule
  PaymentsModule -->|imports ContractsModule| ContractsModule
  EventsModule -->|imports PeopleModule| PeopleModule
  InvitationsModule -->|imports EventsModule| EventsModule
  InvitationsModule -->|imports NotificationsModule| NotificationsModule
  InvitationsModule -->|imports PeopleModule| PeopleModule
  GalleryModule -->|imports EventsModule| EventsModule
  GalleryModule -->|imports MediaModule| MediaModule
  DeliverablesModule -->|imports GalleryModule| GalleryModule
  ClientPortalModule -->|imports EventsModule| EventsModule
  ClientPortalModule -->|imports GalleryModule| GalleryModule
  ClientPortalModule -->|imports DeliverablesModule| DeliverablesModule
```

## 2. Módulos que Exportan Facades

| Módulo | Exporta |
|--------|---------|
| `PeopleModule` | `PeopleFacade` |
| `EventsModule` | `EventsFacade` |
| `NotificationsModule` | `NotificationsFacade` |
| `MediaModule` | `MediaFacade` |
| `GalleryModule` | `GalleryFacade` |
| `ContractsModule` | `ContractsFacade` |
| `CRMModule` | `CRMFacade` |
| `DeliverablesModule` | `DeliverablesFacade` |
| `AdministrationModule` | `AdministrationFacade` |

## 3. Módulos de Plataforma (Compartidos)

| Módulo | Descripción |
|--------|-------------|
| `PrismaService` | Proveedor global de conexión a PostgreSQL, inyectado en todos los repositorios |
| `StorageModule` | Abstracción del almacenamiento de archivos (Local / S3), inyectado en Media |
| `SequenceGeneratorPort` | Proveedor de Business Codes (`USR-000001`) |
