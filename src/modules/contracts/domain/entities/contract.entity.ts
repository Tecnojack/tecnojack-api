import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import {
  ContractStatus,
  ContractTemplateType,
} from '../enums/contracts.enums.js';
import type { ContractVersion } from './contract-version.entity.js';
import type { ContractParty } from './contract-party.entity.js';
import type { ContractSignature } from './contract-signature.entity.js';
import {
  ContractAlreadyDeletedException,
  InvalidContractStatusTransitionException,
} from '../errors/contracts.errors.js';
import {
  ContractCreatedEvent,
  ContractVersionAddedEvent,
  ContractPartyAddedEvent,
  ContractSignaturePreparedEvent,
  ContractPublishedEvent,
  ContractExecutedEvent,
  ContractArchivedEvent,
  ContractRestoredEvent,
} from '../events/contracts.events.js';

export interface ContractProps {
  id?: string;
  code: string;
  title: string;
  description?: string | null;
  eventId: string;
  deliverableId?: string | null;
  status?: ContractStatus;
  templateType?: ContractTemplateType;
  currentVersionNumber?: number;
  notes?: string | null;
  signedAt?: Date | null;
  expiresAt?: Date | null;
  versions?: ContractVersion[];
  parties?: ContractParty[];
  signatures?: ContractSignature[];
  audit?: AuditInfo;
}

export class Contract extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private _title: string;
  private _description: string | null;
  private readonly _eventId: string;
  private _deliverableId: string | null;
  private _status: ContractStatus;
  private _templateType: ContractTemplateType;
  private _currentVersionNumber: number;
  private _notes: string | null;
  private _signedAt: Date | null;
  private _expiresAt: Date | null;
  private _versions: ContractVersion[];
  private _parties: ContractParty[];
  private _signatures: ContractSignature[];
  private _audit: AuditInfo;

  constructor(props: ContractProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Contract code cannot be empty.');
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Contract title cannot be empty.');
    }
    if (!props.eventId || props.eventId.trim().length === 0) {
      throw new Error('Contract eventId cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._title = props.title.trim();
    this._description = props.description?.trim() ?? null;
    this._eventId = props.eventId;
    this._deliverableId = props.deliverableId ?? null;
    this._status = props.status ?? ContractStatus.DRAFT;
    this._templateType = props.templateType ?? ContractTemplateType.SERVICE_AGREEMENT;
    this._currentVersionNumber = props.currentVersionNumber ?? 1;
    this._notes = props.notes?.trim() ?? null;
    this._signedAt = props.signedAt ?? null;
    this._expiresAt = props.expiresAt ?? null;
    this._versions = props.versions ? [...props.versions] : [];
    this._parties = props.parties ? [...props.parties] : [];
    this._signatures = props.signatures ? [...props.signatures] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: ContractProps, actorId?: string): Contract {
    const contract = new Contract({
      ...props,
      audit: AuditInfo.create(actorId),
    });

    contract.addDomainEvent(
      new ContractCreatedEvent({
        contractId: contract.id,
        code: contract.code,
        title: contract.title,
        eventId: contract.eventId,
        deliverableId: contract.deliverableId,
        templateType: contract.templateType,
        status: contract.status,
        createdBy: actorId ?? null,
      }),
    );

    return contract;
  }

  get code(): string { return this._code; }
  get title(): string { return this._title; }
  get description(): string | null { return this._description; }
  get eventId(): string { return this._eventId; }
  get deliverableId(): string | null { return this._deliverableId; }
  get status(): ContractStatus { return this._status; }
  get templateType(): ContractTemplateType { return this._templateType; }
  get currentVersionNumber(): number { return this._currentVersionNumber; }
  get notes(): string | null { return this._notes; }
  get signedAt(): Date | null { return this._signedAt; }
  get expiresAt(): Date | null { return this._expiresAt; }
  get versions(): readonly ContractVersion[] { return this._versions; }
  get parties(): readonly ContractParty[] { return this._parties; }
  get signatures(): readonly ContractSignature[] { return this._signatures; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  updateDetails(
    props: Partial<Pick<ContractProps, 'title' | 'description' | 'deliverableId' | 'templateType' | 'notes' | 'expiresAt'>>,
    actorId?: string,
  ): void {
    this.ensureNotDeleted();
    if (props.title) this._title = props.title.trim();
    if (props.description !== undefined) this._description = props.description?.trim() ?? null;
    if (props.deliverableId !== undefined) this._deliverableId = props.deliverableId;
    if (props.templateType) this._templateType = props.templateType;
    if (props.notes !== undefined) this._notes = props.notes?.trim() ?? null;
    if (props.expiresAt !== undefined) this._expiresAt = props.expiresAt;

    this._audit = this._audit.touch(actorId);
  }

  addVersion(version: ContractVersion, actorId?: string): void {
    this.ensureNotDeleted();
    this._versions.push(version);
    this._currentVersionNumber = version.versionNumber;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new ContractVersionAddedEvent({
        contractId: this.id,
        versionNumber: version.versionNumber,
        title: version.title,
        changeReason: version.changeReason,
        createdBy: actorId ?? null,
      }),
    );
  }

  addParty(party: ContractParty, actorId?: string): void {
    this.ensureNotDeleted();
    this._parties.push(party);
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new ContractPartyAddedEvent({
        contractId: this.id,
        partyId: party.id,
        role: party.role,
        personId: party.personId,
        organizationId: party.organizationId,
        addedBy: actorId ?? null,
      }),
    );
  }

  addSignaturePlaceholder(signature: ContractSignature, actorId?: string): void {
    this.ensureNotDeleted();
    this._signatures.push(signature);
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new ContractSignaturePreparedEvent({
        contractId: this.id,
        signatureId: signature.id,
        partyId: signature.partyId,
        signerEmail: signature.signerEmail,
        preparedBy: actorId ?? null,
      }),
    );
  }

  publish(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status !== ContractStatus.DRAFT) {
      throw new InvalidContractStatusTransitionException(this._status, ContractStatus.PENDING_SIGNATURE);
    }

    this._status = ContractStatus.PENDING_SIGNATURE;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new ContractPublishedEvent({
        contractId: this.id,
        code: this._code,
        publishedBy: actorId ?? null,
      }),
    );
  }

  markAsExecuted(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === ContractStatus.CANCELLED || this._status === ContractStatus.EXPIRED) {
      throw new InvalidContractStatusTransitionException(this._status, ContractStatus.EXECUTED);
    }

    this._status = ContractStatus.EXECUTED;
    this._signedAt = new Date();
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new ContractExecutedEvent({
        contractId: this.id,
        code: this._code,
        executedAt: this._signedAt,
        executedBy: actorId ?? null,
      }),
    );
  }

  softDelete(actorId?: string): void {
    if (this._audit.isDeleted()) {
      throw new ContractAlreadyDeletedException(this.id);
    }

    this._audit = this._audit.softDelete(actorId);
    this._status = ContractStatus.ARCHIVED;

    this.addDomainEvent(
      new ContractArchivedEvent({
        contractId: this.id,
        code: this._code,
        archivedAt: this._audit.deletedAt!,
        archivedBy: actorId ?? null,
      }),
    );
  }

  restore(actorId?: string): void {
    if (!this._audit.isDeleted()) return;

    this._audit = this._audit.restore(actorId);
    this._status = ContractStatus.DRAFT;

    this.addDomainEvent(
      new ContractRestoredEvent({
        contractId: this.id,
        code: this._code,
        restoredAt: new Date(),
        restoredBy: actorId ?? null,
      }),
    );
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new ContractAlreadyDeletedException(this.id);
    }
  }
}
