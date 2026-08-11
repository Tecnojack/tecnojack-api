import { AuditInfo } from './audit-info.value-object.js';

describe('AuditInfo Value Object', () => {
  it('should initialize with default values when empty', () => {
    const audit = new AuditInfo();
    expect(audit.createdAt).toBeInstanceOf(Date);
    expect(audit.updatedAt).toBeInstanceOf(Date);
    expect(audit.createdBy).toBeNull();
    expect(audit.updatedBy).toBeNull();
    expect(audit.deletedAt).toBeNull();
    expect(audit.deletedBy).toBeNull();
    expect(audit.isDeleted()).toBe(false);
  });

  it('should create audit info with actor', () => {
    const audit = AuditInfo.create('user-123');
    expect(audit.createdBy).toBe('user-123');
    expect(audit.updatedBy).toBe('user-123');
    expect(audit.isDeleted()).toBe(false);
  });

  it('should mark as soft-deleted', () => {
    const audit = AuditInfo.create('user-123');
    const deletedAudit = audit.softDelete('deleter-456');

    expect(deletedAudit.isDeleted()).toBe(true);
    expect(deletedAudit.deletedBy).toBe('deleter-456');
    expect(deletedAudit.deletedAt).toBeInstanceOf(Date);
  });

  it('should restore from soft-deleted state', () => {
    const audit = AuditInfo.create('user-123').softDelete('deleter-456');
    const restoredAudit = audit.restore('restorer-789');

    expect(restoredAudit.isDeleted()).toBe(false);
    expect(restoredAudit.deletedAt).toBeNull();
    expect(restoredAudit.deletedBy).toBeNull();
    expect(restoredAudit.updatedBy).toBe('restorer-789');
  });
});
