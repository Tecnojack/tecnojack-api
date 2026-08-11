# Database Overview - Schema & Relational Design

## 1. Motor y ORM

| Item | Detalle |
|------|---------|
| Motor | PostgreSQL |
| ORM | Prisma |
| Schemas | 12 archivos `.prisma` separados por dominio |
| Modelos totales | 45 tablas |

---

## 2. Schemas por Dominio

| Archivo | Domelos Contenidos |
|---------|-------------------|
| `schema.prisma` | Configuración global del datasource y generator |
| `identity.prisma` | UserModel, RoleModel, PermissionModel, PolicyModel, SessionModel, APIKeyModel |
| `administration.prisma` | SystemSettingModel, FeatureFlagModel, CatalogModel, DashboardWidgetModel |
| `crm.prisma` | OpportunityModel, QuotationModel, CRMActivityModel, CRMTaskModel, CustomerJourneyModel |
| `contracts.prisma` | ContractModel, ContractVersionModel, ContractPartyModel, ContractSignatureModel |
| `payments.prisma` | PaymentModel, PaymentTransactionModel, PaymentInstallmentModel |
| `events.prisma` | EventModel, EventSessionModel, EventTypeModel, LocationModel |
| `invitations.prisma` | InvitationModel, InvitationGuestModel, InvitationSectionModel, InvitationScheduleModel |
| `gallery.prisma` | GalleryModel, GalleryAlbumModel, GalleryAssetReferenceModel |
| `media.prisma` | MediaAssetModel |
| `deliverables.prisma` | DeliverableModel, DeliverableItemModel |
| `notifications.prisma` | NotificationModel, NotificationTemplateModel, NotificationRecipientModel, NotificationHistoryModel |
| `people.prisma` | PersonModel, OrganizationModel |

---

## 3. Estándares Transversales

Todos los modelos de la base de datos implementan sin excepción:

### AuditInfo (Auditoría completa)
```
createdAt   DateTime
createdBy   String
updatedAt   DateTime
updatedBy   String
deletedAt   DateTime?   // Null = no borrado
deletedBy   String?
```

### Soft Delete
Ningún registro es borrado físicamente. El campo `deletedAt` marca el borrado lógico.
Las queries de listado siempre filtran `WHERE deletedAt IS NULL`.

### Business Codes (Identificadores de Negocio)
Cada Aggregate Root genera un código legible de negocio único:

| Dominio | Prefijo | Ejemplo |
|---------|---------|---------|
| Users | `USR` | `USR-000001` |
| Roles | `ROL` | `ROL-000001` |
| Permissions | `PRM` | `PRM-000001` |
| Policies | `POL` | `POL-000001` |
| Sessions | `SES` | `SES-000001` |
| API Keys | `AKY` | `AKY-000001` |
| Opportunities | `OPP` | `OPP-000001` |
| Contracts | `CON` | `CON-000001` |
| Payments | `PAY` | `PAY-000001` |
| Events | `EVT` | `EVT-000001` |
| Invitations | `INV` | `INV-000001` |
| Galleries | `GAL` | `GAL-000001` |
| Media Assets | `MDA` | `MDA-000001` |
| Deliverables | `DLV` | `DLV-000001` |
| Persons | `PRS` | `PRS-000001` |
| Organizations | `ORG` | `ORG-000001` |
| Notifications | `NTF` | `NTF-000001` |
| Settings | `SET` | `SET-000001` |
| Feature Flags | `FFG` | `FFG-000001` |
| Catalogs | `CTL` | `CTL-000001` |
| Widgets | `WDG` | `WDG-000001` |

---

## 4. Prisma Workflow

```
1. Editar / crear prisma/schema/<dominio>.prisma
2. pnpm prisma generate     → Regenera el cliente tipado
3. pnpm prisma migrate dev  → Aplica migración en base de datos dev
4. pnpm prisma migrate deploy → Aplica en producción (CI/CD)
```
