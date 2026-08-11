import { AuditInfo } from '../../../../shared/domain/value-objects/audit-info.value-object.js';
import { OrganizationStatus } from '../enums/people.enums.js';
import type { OrganizationName } from '../value-objects/organization-name.value-object.js';
import type { TaxDocument } from '../value-objects/tax-document.value-object.js';
import { ContactInformation } from '../value-objects/contact-information.value-object.js';
import { OrganizationAlreadyDeletedException } from '../errors/people.errors.js';
import {
  type DomainEvent,
  OrganizationCreatedEvent,
  OrganizationUpdatedEvent,
  OrganizationArchivedEvent,
  OrganizationRestoredEvent,
} from '../events/people.events.js';

export interface OrganizationProps {
  id?: string;
  code: string;
  name: OrganizationName;
  taxDocument?: TaxDocument | null;
  status?: OrganizationStatus;
  contactPoints?: ContactInformation[];
  audit?: AuditInfo;
}

export class Organization {
  private readonly _id: string;
  private readonly _code: string;
  private _name: OrganizationName;
  private _taxDocument: TaxDocument | null;
  private _status: OrganizationStatus;
  private _contactPoints: ContactInformation[];
  private _audit: AuditInfo;
  private _domainEvents: DomainEvent[] = [];

  constructor(props: OrganizationProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Organization code cannot be empty.');
    }

    this._id = props.id ?? crypto.randomUUID();
    this._code = props.code.trim();
    this._name = props.name;
    this._taxDocument = props.taxDocument ?? null;
    this._status = props.status ?? OrganizationStatus.ACTIVE;
    this._contactPoints = props.contactPoints ? [...props.contactPoints] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: OrganizationProps, actorId?: string): Organization {
    const org = new Organization({
      ...props,
      audit: AuditInfo.create(actorId),
    });

    org.addDomainEvent(
      new OrganizationCreatedEvent({
        organizationId: org.id,
        code: org.code,
        legalName: org.name.legalName,
        taxIdNumber: org.taxDocument?.taxId ?? null,
        status: org.status,
        createdBy: actorId ?? null,
      }),
    );

    return org;
  }

  get id(): string {
    return this._id;
  }

  get code(): string {
    return this._code;
  }

  get name(): OrganizationName {
    return this._name;
  }

  get taxDocument(): TaxDocument | null {
    return this._taxDocument;
  }

  get status(): OrganizationStatus {
    return this._status;
  }

  get contactPoints(): readonly ContactInformation[] {
    return this._contactPoints;
  }

  get audit(): AuditInfo {
    return this._audit;
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  updateName(name: OrganizationName, actorId?: string): void {
    this.ensureNotDeleted();
    this._name = name;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new OrganizationUpdatedEvent({
        organizationId: this._id,
        code: this._code,
        updatedFields: ['name'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  updateTaxDocument(taxDocument: TaxDocument | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._taxDocument = taxDocument;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new OrganizationUpdatedEvent({
        organizationId: this._id,
        code: this._code,
        updatedFields: ['taxDocument'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  changeStatus(status: OrganizationStatus, actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === status) return;

    this._status = status;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new OrganizationUpdatedEvent({
        organizationId: this._id,
        code: this._code,
        updatedFields: ['status'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  addContactPoint(contact: ContactInformation, actorId?: string): void {
    this.ensureNotDeleted();

    if (contact.isPrimary) {
      this._contactPoints = this._contactPoints.map((c) =>
        c.type === contact.type
          ? new ContactInformation({
              id: c.id ?? undefined,
              type: c.type,
              value: c.value,
              label: c.label,
              isPrimary: false,
            })
          : c,
      );
    }

    const existingIndex = this._contactPoints.findIndex((c) => c.equals(contact));
    if (existingIndex >= 0) {
      this._contactPoints[existingIndex] = contact;
    } else {
      this._contactPoints.push(contact);
    }

    this._audit = this._audit.touch(actorId);
    this.addDomainEvent(
      new OrganizationUpdatedEvent({
        organizationId: this._id,
        code: this._code,
        updatedFields: ['contactPoints'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  removeContactPoint(contactValue: string, actorId?: string): void {
    this.ensureNotDeleted();
    const initialLength = this._contactPoints.length;
    this._contactPoints = this._contactPoints.filter((c) => c.value !== contactValue.trim());

    if (this._contactPoints.length !== initialLength) {
      this._audit = this._audit.touch(actorId);
      this.addDomainEvent(
        new OrganizationUpdatedEvent({
          organizationId: this._id,
          code: this._code,
          updatedFields: ['contactPoints'],
          updatedBy: actorId ?? null,
        }),
      );
    }
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new OrganizationAlreadyDeletedException(this._id);
    }

    this._audit = this._audit.softDelete(actorId);
    this.addDomainEvent(
      new OrganizationArchivedEvent({
        organizationId: this._id,
        code: this._code,
        deletedAt: this._audit.deletedAt!,
        deletedBy: actorId ?? null,
      }),
    );
  }

  restore(actorId?: string): void {
    if (!this._audit.isDeleted()) return;

    this._audit = this._audit.restore(actorId);
    this.addDomainEvent(
      new OrganizationRestoredEvent({
        organizationId: this._id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new OrganizationAlreadyDeletedException(this._id);
    }
  }
}
