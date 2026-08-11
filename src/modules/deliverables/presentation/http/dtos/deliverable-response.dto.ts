import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliverableType, DeliverableStatus, DeliveryMethod } from '../../../domain/enums/deliverables.enums.js';
import type { Deliverable } from '../../../domain/entities/deliverable.entity.js';

export class DeliverableItemResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() deliverableId!: string;
  @ApiPropertyOptional() mediaAssetId?: string | null;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() quantity!: number;
  @ApiProperty() isCompleted!: boolean;
  @ApiProperty() sortOrder!: number;
}

export class DeliverableResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() eventId!: string;
  @ApiProperty({ enum: DeliverableType }) type!: DeliverableType;
  @ApiProperty({ enum: DeliverableStatus }) status!: DeliverableStatus;
  @ApiProperty({ enum: DeliveryMethod }) deliveryMethod!: DeliveryMethod;
  @ApiPropertyOptional() recipientPersonId?: string | null;
  @ApiPropertyOptional() targetGalleryId?: string | null;
  @ApiPropertyOptional() estimatedDeliveryAt?: Date | null;
  @ApiPropertyOptional() deliveredAt?: Date | null;
  @ApiPropertyOptional() trackingNumber?: string | null;
  @ApiPropertyOptional() deliveryNotes?: string | null;
  @ApiProperty({ type: [DeliverableItemResponseDto] }) items!: DeliverableItemResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() createdBy?: string | null;
  @ApiProperty() updatedAt!: Date;
  @ApiPropertyOptional() updatedBy?: string | null;
  @ApiPropertyOptional() deletedAt?: Date | null;

  static fromDomain(deliverable: Deliverable): DeliverableResponseDto {
    const dto = new DeliverableResponseDto();
    dto.id = deliverable.id;
    dto.code = deliverable.code;
    dto.name = deliverable.name;
    dto.description = deliverable.description;
    dto.eventId = deliverable.eventId;
    dto.type = deliverable.type;
    dto.status = deliverable.status;
    dto.deliveryMethod = deliverable.deliveryMethod;
    dto.recipientPersonId = deliverable.recipientPersonId;
    dto.targetGalleryId = deliverable.targetGalleryId;
    dto.estimatedDeliveryAt = deliverable.estimatedDeliveryAt;
    dto.deliveredAt = deliverable.deliveredAt;
    dto.trackingNumber = deliverable.trackingNumber;
    dto.deliveryNotes = deliverable.deliveryNotes;
    dto.items = deliverable.items.map((i) => ({
      id: i.id,
      deliverableId: i.deliverableId,
      mediaAssetId: i.mediaAssetId,
      title: i.title,
      description: i.description,
      quantity: i.quantity,
      isCompleted: i.isCompleted,
      sortOrder: i.sortOrder,
    }));
    dto.createdAt = deliverable.audit.createdAt;
    dto.createdBy = deliverable.audit.createdBy;
    dto.updatedAt = deliverable.audit.updatedAt;
    dto.updatedBy = deliverable.audit.updatedBy;
    dto.deletedAt = deliverable.audit.deletedAt;
    return dto;
  }
}
