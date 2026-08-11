import { AuditInfo } from './audit-info.value-object.js';

describe('AuditInfo Value Object', () => {
  it('should create audit info with default values', () => {
    const audit = AuditInfo.create('actor-123');
    expect(audit.createdBy).toBe('actor-123');
    expect(audit.updatedBy).toBe('actor-123');
    expect(audit.deletedAt).toBeNull();
    expect(audit.deletedBy).toBeNull();
    expect(audit.isDeleted()).toBe(false);
  });

  it('should update timestamp on touch', () => {
    const audit = AuditInfo.create('actor-1');
    const updated = audit.touch('actor-2');
    expect(updated.updatedBy).toBe('actor-2');
    expect(updated.createdAt).toEqual(audit.createdAt);
  });

  it('should set soft delete flags', () => {
    const audit = AuditInfo.create('actor-1');
    const deleted = audit.softDelete('actor-deleter');
    expect(deleted.isDeleted()).toBe(true);
    expect(deleted.deletedBy).toBe('actor-deleter');
    expect(deleted.deletedAt).toBeInstanceOf(Date);
  });

  it('should clear soft delete flags on restore', () => {
    const audit = AuditInfo.create('actor-1').softDelete('actor-deleter');
    const restored = audit.restore('actor-restorer');
    expect(restored.isDeleted()).toBe(false);
    expect(restored.deletedAt).toBeNull();
    expect(restored.deletedBy).toBeNull();
    expect(restored.updatedBy).toBe('actor-restorer');
  });
});
