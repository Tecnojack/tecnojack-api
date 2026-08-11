import { AuditInfo } from '../../../../shared/domain/value-objects/audit-info.value-object.js';
import { PersonStatus } from '../enums/people.enums.js';
import type { PersonName } from '../value-objects/person-name.value-object.js';
import type { Document } from '../value-objects/document.value-object.js';
import { ContactInformation } from '../value-objects/contact-information.value-object.js';
import { PersonAlreadyDeletedException } from '../errors/people.errors.js';
import {
  type DomainEvent,
  PersonCreatedEvent,
  PersonUpdatedEvent,
  PersonArchivedEvent,
  PersonRestoredEvent,
} from '../events/people.events.js';

export interface PersonProps {
  id?: string;
  code: string;
  name: PersonName;
  document?: Document | null;
  status?: PersonStatus;
  contactPoints?: ContactInformation[];
  audit?: AuditInfo;
}

export class Person {
  private readonly _id: string;
  private readonly _code: string;
  private _name: PersonName;
  private _document: Document | null;
  private _status: PersonStatus;
  private _contactPoints: ContactInformation[];
  private _audit: AuditInfo;
  private _domainEvents: DomainEvent[] = [];

  constructor(props: PersonProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Person code cannot be empty.');
    }

    this._id = props.id ?? crypto.randomUUID();
    this._code = props.code.trim();
    this._name = props.name;
    this._document = props.document ?? null;
    this._status = props.status ?? PersonStatus.ACTIVE;
    this._contactPoints = props.contactPoints ? [...props.contactPoints] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: PersonProps, actorId?: string): Person {
    const person = new Person({
      ...props,
      audit: AuditInfo.create(actorId),
    });

    person.addDomainEvent(
      new PersonCreatedEvent({
        personId: person.id,
        code: person.code,
        displayName: person.name.displayName,
        documentNumber: person.document?.number ?? null,
        status: person.status,
        createdBy: actorId ?? null,
      }),
    );

    return person;
  }

  get id(): string {
    return this._id;
  }

  get code(): string {
    return this._code;
  }

  get name(): PersonName {
    return this._name;
  }

  get document(): Document | null {
    return this._document;
  }

  get status(): PersonStatus {
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

  updateName(name: PersonName, actorId?: string): void {
    this.ensureNotDeleted();
    this._name = name;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new PersonUpdatedEvent({
        personId: this._id,
        code: this._code,
        updatedFields: ['name'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  updateDocument(document: Document | null, actorId?: string): void {
    this.ensureNotDeleted();
    this._document = document;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new PersonUpdatedEvent({
        personId: this._id,
        code: this._code,
        updatedFields: ['document'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  changeStatus(status: PersonStatus, actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === status) return;

    this._status = status;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new PersonUpdatedEvent({
        personId: this._id,
        code: this._code,
        updatedFields: ['status'],
        updatedBy: actorId ?? null,
      }),
    );
  }

  addContactPoint(contact: ContactInformation, actorId?: string): void {
    this.ensureNotDeleted();

    // If new contact is primary for its type, unset previous primary of same type
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

    // Replace if exact match, otherwise append
    const existingIndex = this._contactPoints.findIndex((c) => c.equals(contact));
    if (existingIndex >= 0) {
      this._contactPoints[existingIndex] = contact;
    } else {
      this._contactPoints.push(contact);
    }

    this._audit = this._audit.touch(actorId);
    this.addDomainEvent(
      new PersonUpdatedEvent({
        personId: this._id,
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
        new PersonUpdatedEvent({
          personId: this._id,
          code: this._code,
          updatedFields: ['contactPoints'],
          updatedBy: actorId ?? null,
        }),
      );
    }
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new PersonAlreadyDeletedException(this._id);
    }

    this._audit = this._audit.softDelete(actorId);
    this.addDomainEvent(
      new PersonArchivedEvent({
        personId: this._id,
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
      new PersonRestoredEvent({
        personId: this._id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new PersonAlreadyDeletedException(this._id);
    }
  }
}
