import type {
  DeliverableModel as PrismaDeliverable,
  DeliverableItemModel as PrismaDeliverableItem,
} from '../../../../../../generated/prisma/client.js';
import type {
  DeliverableType as PrismaDeliverableType,
  DeliverableStatus as PrismaDeliverableStatus,
  DeliveryMethod as PrismaDeliveryMethod,
} from '../../../../../../generated/prisma/enums.js';
import { Deliverable } from '../../../../domain/entities/deliverable.entity.js';
import { DeliverableItem } from '../../../../domain/entities/deliverable-item.entity.js';
import type { DeliverableType, DeliverableStatus, DeliveryMethod } from '../../../../domain/enums/deliverables.enums.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';

export type PrismaDeliverableWithRelations = PrismaDeliverable & {
  items?: PrismaDeliverableItem[];
};

export interface PersistenceDeliverableData {
  id: string;
  code: string;
  name: string;
  description: string | null;
  eventId: string;
  type: PrismaDeliverableType;
  status: PrismaDeliverableStatus;
  deliveryMethod: PrismaDeliveryMethod;
  recipientPersonId: string | null;
  targetGalleryId: string | null;
  estimatedDeliveryAt: Date | null;
  deliveredAt: Date | null;
  trackingNumber: string | null;
  deliveryNotes: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}

export class DeliverableMapper {
  static toDomain(raw: PrismaDeliverableWithRelations): Deliverable {
    const items = (raw.items ?? []).map(
      (i) =>
        new DeliverableItem({
          id: i.id,
          deliverableId: i.deliverableId,
          mediaAssetId: i.mediaAssetId,
          title: i.title,
          description: i.description,
          quantity: i.quantity,
          isCompleted: i.isCompleted,
          sortOrder: i.sortOrder,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
        }),
    );

    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });

    return new Deliverable({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      eventId: raw.eventId,
      type: raw.type as unknown as DeliverableType,
      status: raw.status as unknown as DeliverableStatus,
      deliveryMethod: raw.deliveryMethod as unknown as DeliveryMethod,
      recipientPersonId: raw.recipientPersonId,
      targetGalleryId: raw.targetGalleryId,
      estimatedDeliveryAt: raw.estimatedDeliveryAt,
      deliveredAt: raw.deliveredAt,
      trackingNumber: raw.trackingNumber,
      deliveryNotes: raw.deliveryNotes,
      items,
      audit,
    });
  }

  static toPersistence(entity: Deliverable): PersistenceDeliverableData {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      eventId: entity.eventId,
      type: entity.type as unknown as PrismaDeliverableType,
      status: entity.status as unknown as PrismaDeliverableStatus,
      deliveryMethod: entity.deliveryMethod as unknown as PrismaDeliveryMethod,
      recipientPersonId: entity.recipientPersonId,
      targetGalleryId: entity.targetGalleryId,
      estimatedDeliveryAt: entity.estimatedDeliveryAt,
      deliveredAt: entity.deliveredAt,
      trackingNumber: entity.trackingNumber,
      deliveryNotes: entity.deliveryNotes,
      createdAt: entity.audit.createdAt,
      createdBy: entity.audit.createdBy,
      updatedAt: entity.audit.updatedAt,
      updatedBy: entity.audit.updatedBy,
      deletedAt: entity.audit.deletedAt,
      deletedBy: entity.audit.deletedBy,
    };
  }

  static toPersistenceItems(items: readonly DeliverableItem[]): {
    id: string;
    deliverableId: string;
    mediaAssetId: string | null;
    title: string;
    description: string | null;
    quantity: number;
    isCompleted: boolean;
    sortOrder: number;
  }[] {
    return items.map((i: DeliverableItem) => ({
      id: i.id,
      deliverableId: i.deliverableId,
      mediaAssetId: i.mediaAssetId,
      title: i.title,
      description: i.description,
      quantity: i.quantity,
      isCompleted: i.isCompleted,
      sortOrder: i.sortOrder,
    }));
  }
}
