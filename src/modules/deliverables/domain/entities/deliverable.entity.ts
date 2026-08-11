import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import {
  DeliverableType,
  DeliverableStatus,
  DeliveryMethod,
} from '../enums/deliverables.enums.js';
import type { DeliverableItem } from './deliverable-item.entity.js';
import {
  DeliverableAlreadyDeletedException,
  InvalidDeliverableStatusTransitionException,
} from '../errors/deliverables.errors.js';
import {
  DeliverableCreatedEvent,
  DeliverableStatusChangedEvent,
  DeliverableReadyEvent,
  DeliverableDeliveredEvent,
  DeliverableItemAddedEvent,
  DeliverableItemRemovedEvent,
  DeliverableArchivedEvent,
  DeliverableRestoredEvent,
} from '../events/deliverables.events.js';

export interface DeliverableProps {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  eventId: string;
  type?: DeliverableType;
  status?: DeliverableStatus;
  deliveryMethod?: DeliveryMethod;
  recipientPersonId?: string | null;
  targetGalleryId?: string | null;
  estimatedDeliveryAt?: Date | null;
  deliveredAt?: Date | null;
  trackingNumber?: string | null;
  deliveryNotes?: string | null;
  items?: DeliverableItem[];
  audit?: AuditInfo;
}

export class Deliverable extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _name: string;
  private _description: string | null;
  private readonly _eventId: string;
  private _type: DeliverableType;
  private _status: DeliverableStatus;
  private _deliveryMethod: DeliveryMethod;
  private _recipientPersonId: string | null;
  private _targetGalleryId: string | null;
  private _estimatedDeliveryAt: Date | null;
  private _deliveredAt: Date | null;
  private _trackingNumber: string | null;
  private _deliveryNotes: string | null;
  private _items: DeliverableItem[];
  private _audit: AuditInfo;

  constructor(props: DeliverableProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Deliverable code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Deliverable name cannot be empty.');
    }
    if (!props.eventId || props.eventId.trim().length === 0) {
      throw new Error('Deliverable eventId cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._name = props.name.trim();
    this._description = props.description?.trim() ?? null;
    this._eventId = props.eventId;
    this._type = props.type ?? DeliverableType.PHOTOS;
    this._status = props.status ?? DeliverableStatus.DRAFT;
    this._deliveryMethod = props.deliveryMethod ?? DeliveryMethod.DIGITAL_DOWNLOAD;
    this._recipientPersonId = props.recipientPersonId ?? null;
    this._targetGalleryId = props.targetGalleryId ?? null;
    this._estimatedDeliveryAt = props.estimatedDeliveryAt ?? null;
    this._deliveredAt = props.deliveredAt ?? null;
    this._trackingNumber = props.trackingNumber?.trim() ?? null;
    this._deliveryNotes = props.deliveryNotes?.trim() ?? null;
    this._items = props.items ? [...props.items] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: DeliverableProps, actorId?: string): Deliverable {
    const deliverable = new Deliverable({
      ...props,
      audit: AuditInfo.create(actorId),
    });

    deliverable.addDomainEvent(
      new DeliverableCreatedEvent({
        deliverableId: deliverable.id,
        code: deliverable.code,
        name: deliverable.name,
        eventId: deliverable.eventId,
        type: deliverable.type,
        status: deliverable.status,
        createdBy: actorId ?? null,
      }),
    );

    return deliverable;
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get eventId(): string { return this._eventId; }
  get type(): DeliverableType { return this._type; }
  get status(): DeliverableStatus { return this._status; }
  get deliveryMethod(): DeliveryMethod { return this._deliveryMethod; }
  get recipientPersonId(): string | null { return this._recipientPersonId; }
  get targetGalleryId(): string | null { return this._targetGalleryId; }
  get estimatedDeliveryAt(): Date | null { return this._estimatedDeliveryAt; }
  get deliveredAt(): Date | null { return this._deliveredAt; }
  get trackingNumber(): string | null { return this._trackingNumber; }
  get deliveryNotes(): string | null { return this._deliveryNotes; }
  get items(): readonly DeliverableItem[] { return this._items; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(
    props: Partial<Pick<DeliverableProps, 'name' | 'description' | 'type' | 'deliveryMethod' | 'recipientPersonId' | 'targetGalleryId' | 'estimatedDeliveryAt' | 'trackingNumber' | 'deliveryNotes'>>,
    actorId?: string,
  ): void {
    this.ensureNotDeleted();
    if (props.name) this._name = props.name.trim();
    if (props.description !== undefined) this._description = props.description?.trim() ?? null;
    if (props.type) this._type = props.type;
    if (props.deliveryMethod) this._deliveryMethod = props.deliveryMethod;
    if (props.recipientPersonId !== undefined) this._recipientPersonId = props.recipientPersonId;
    if (props.targetGalleryId !== undefined) this._targetGalleryId = props.targetGalleryId;
    if (props.estimatedDeliveryAt !== undefined) this._estimatedDeliveryAt = props.estimatedDeliveryAt;
    if (props.trackingNumber !== undefined) this._trackingNumber = props.trackingNumber?.trim() ?? null;
    if (props.deliveryNotes !== undefined) this._deliveryNotes = props.deliveryNotes?.trim() ?? null;

    this._audit = this._audit.touch(actorId);
  }

  markAsReady(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === DeliverableStatus.DELIVERED || this._status === DeliverableStatus.CANCELLED) {
      throw new InvalidDeliverableStatusTransitionException(this._status, DeliverableStatus.READY);
    }

    const prev = this._status;
    this._status = DeliverableStatus.READY;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new DeliverableStatusChangedEvent({
        deliverableId: this.id,
        code: this._code,
        previousStatus: prev,
        newStatus: DeliverableStatus.READY,
        updatedBy: actorId ?? null,
      }),
    );

    this.addDomainEvent(
      new DeliverableReadyEvent({
        deliverableId: this.id,
        code: this._code,
        readyAt: new Date(),
        updatedBy: actorId ?? null,
      }),
    );
  }

  markAsDelivered(method?: DeliveryMethod, notes?: string, actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === DeliverableStatus.CANCELLED) {
      throw new InvalidDeliverableStatusTransitionException(this._status, DeliverableStatus.DELIVERED);
    }

    const prev = this._status;
    this._status = DeliverableStatus.DELIVERED;
    if (method) this._deliveryMethod = method;
    if (notes) this._deliveryNotes = notes.trim();
    this._deliveredAt = new Date();
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new DeliverableStatusChangedEvent({
        deliverableId: this.id,
        code: this._code,
        previousStatus: prev,
        newStatus: DeliverableStatus.DELIVERED,
        updatedBy: actorId ?? null,
      }),
    );

    this.addDomainEvent(
      new DeliverableDeliveredEvent({
        deliverableId: this.id,
        code: this._code,
        deliveredAt: this._deliveredAt,
        deliveryMethod: this._deliveryMethod,
        recipientPersonId: this._recipientPersonId,
        updatedBy: actorId ?? null,
      }),
    );
  }

  addItem(item: DeliverableItem, actorId?: string): void {
    this.ensureNotDeleted();
    this._items.push(item);
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new DeliverableItemAddedEvent({
        deliverableId: this.id,
        itemId: item.id,
        title: item.title,
        addedBy: actorId ?? null,
      }),
    );
  }

  removeItem(itemId: string, actorId?: string): void {
    this.ensureNotDeleted();
    const initialCount = this._items.length;
    this._items = this._items.filter((i) => i.id !== itemId);

    if (this._items.length < initialCount) {
      this._audit = this._audit.touch(actorId);
      this.addDomainEvent(
        new DeliverableItemRemovedEvent({
          deliverableId: this.id,
          itemId,
          removedBy: actorId ?? null,
        }),
      );
    }
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new DeliverableAlreadyDeletedException(this.id);
    }

    this._audit = this._audit.softDelete(actorId);
    this._status = DeliverableStatus.ARCHIVED;

    this.addDomainEvent(
      new DeliverableArchivedEvent({
        deliverableId: this.id,
        code: this._code,
        archivedAt: this._audit.deletedAt!,
        archivedBy: actorId ?? null,
      }),
    );
  }

  restore(actorId?: string): void {
    if (!this._audit.isDeleted()) return;

    this._audit = this._audit.restore(actorId);
    this._status = DeliverableStatus.DRAFT;

    this.addDomainEvent(
      new DeliverableRestoredEvent({
        deliverableId: this.id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new DeliverableAlreadyDeletedException(this.id);
    }
  }
}
