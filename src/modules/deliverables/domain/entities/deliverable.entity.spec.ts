import { Deliverable } from './deliverable.entity.js';
import { DeliverableType, DeliverableStatus, DeliveryMethod } from '../enums/deliverables.enums.js';
import { DeliverableItem } from './deliverable-item.entity.js';
import { DeliverableAlreadyDeletedException } from '../errors/deliverables.errors.js';

describe('Deliverable Aggregate Entity', () => {
  it('should create a valid DRAFT deliverable and raise DeliverableCreatedEvent', () => {
    const deliverable = Deliverable.create({
      code: 'DEL-000001',
      name: 'Paquete de Fotografías Impresas y USB',
      eventId: crypto.randomUUID(),
      type: DeliverableType.PRINTED_ALBUM,
    });

    expect(deliverable.id).toBeDefined();
    expect(deliverable.code).toBe('DEL-000001');
    expect(deliverable.status).toBe(DeliverableStatus.DRAFT);
    expect(deliverable.type).toBe(DeliverableType.PRINTED_ALBUM);
    expect(deliverable.domainEvents.length).toBe(1);
    expect(deliverable.domainEvents[0]!.eventName).toBe('deliverables.created');
  });

  it('should mark deliverable as READY and then DELIVERED raising appropriate events', () => {
    const deliverable = Deliverable.create({
      code: 'DEL-000002',
      name: 'Video Highlight 4K',
      eventId: crypto.randomUUID(),
      type: DeliverableType.VIDEOS,
    });
    deliverable.clearDomainEvents();

    deliverable.markAsReady('admin-user');
    expect(deliverable.status).toBe(DeliverableStatus.READY);
    expect(deliverable.domainEvents.some((e) => e.eventName === 'deliverables.ready')).toBe(true);

    deliverable.markAsDelivered(DeliveryMethod.DIGITAL_DOWNLOAD, 'Enviado por enlace oficial', 'admin-user');
    expect(deliverable.status).toBe(DeliverableStatus.DELIVERED);
    expect(deliverable.deliveredAt).toBeDefined();
    expect(deliverable.domainEvents.some((e) => e.eventName === 'deliverables.delivered')).toBe(true);
  });

  it('should add deliverable items', () => {
    const deliverable = Deliverable.create({
      code: 'DEL-000003',
      name: 'Álbum y USB Personalizada',
      eventId: crypto.randomUUID(),
    });

    const item = new DeliverableItem({
      deliverableId: deliverable.id,
      title: 'Memoria USB 64GB Grabada en Madera',
      quantity: 1,
    });

    deliverable.addItem(item);
    expect(deliverable.items.length).toBe(1);
    expect(deliverable.items[0]!.title).toBe('Memoria USB 64GB Grabada en Madera');
  });

  it('should soft delete and throw on subsequent mutations', () => {
    const deliverable = Deliverable.create({
      code: 'DEL-000004',
      name: 'Entregable Cancelado',
      eventId: crypto.randomUUID(),
    });

    deliverable.softDelete('user-1');
    expect(deliverable.isDeleted()).toBe(true);
    expect(deliverable.status).toBe(DeliverableStatus.ARCHIVED);

    expect(() => deliverable.softDelete('user-1')).toThrow(DeliverableAlreadyDeletedException);
    expect(() => deliverable.markAsReady()).toThrow(DeliverableAlreadyDeletedException);
  });
});
