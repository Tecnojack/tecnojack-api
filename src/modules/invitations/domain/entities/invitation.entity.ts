import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import { InvitationStatus, InvitationVisibility, RSVPStatus } from '../enums/invitations.enums.js';
import type { InvitationSection } from './invitation-section.entity.js';
import type { InvitationGuest } from './invitation-guest.entity.js';
import type { InvitationSchedule } from './invitation-schedule.entity.js';
import { GuestNotFoundException, InvalidInvitationOperationException } from '../errors/invitations.errors.js';
import { InvitationCreatedEvent, InvitationPublishedEvent, GuestRSVPUpdatedEvent } from '../events/invitations.events.js';

export interface InvitationProps {
  id?: string;
  code: string;
  eventId: string;
  slug: string;
  title: string;
  description?: string | null;
  language?: string;
  status?: InvitationStatus;
  visibility?: InvitationVisibility;
  passwordHash?: string | null;
  expiresAt?: Date | null;
  galleryId?: string | null;
  coverMediaId?: string | null;
  musicUrl?: string | null;
  theme?: Record<string, unknown>;
  sections?: InvitationSection[];
  guests?: InvitationGuest[];
  schedules?: InvitationSchedule[];
  audit?: AuditInfo;
}

export class Invitation extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private readonly _eventId: string;
  private _slug: string;
  private _title: string;
  private _description: string | null;
  private _language: string;
  private _status: InvitationStatus;
  private _visibility: InvitationVisibility;
  private _passwordHash: string | null;
  private _expiresAt: Date | null;
  private _galleryId: string | null;
  private _coverMediaId: string | null;
  private _musicUrl: string | null;
  private _theme: Record<string, unknown>;
  private _sections: InvitationSection[];
  private _guests: InvitationGuest[];
  private _schedules: InvitationSchedule[];
  private _audit: AuditInfo;

  constructor(props: InvitationProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Invitation code cannot be empty.');
    }
    if (!props.eventId || props.eventId.trim().length === 0) {
      throw new Error('Invitation eventId cannot be empty.');
    }
    if (!props.slug || props.slug.trim().length === 0) {
      throw new Error('Invitation slug cannot be empty.');
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Invitation title cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._eventId = props.eventId;
    this._slug = props.slug.trim().toLowerCase();
    this._title = props.title.trim();
    this._description = props.description?.trim() ?? null;
    this._language = props.language?.toLowerCase().trim() ?? 'es';
    this._status = props.status ?? InvitationStatus.DRAFT;
    this._visibility = props.visibility ?? InvitationVisibility.PUBLIC;
    this._passwordHash = props.passwordHash ?? null;
    this._expiresAt = props.expiresAt ?? null;
    this._galleryId = props.galleryId ?? null;
    this._coverMediaId = props.coverMediaId ?? null;
    this._musicUrl = props.musicUrl?.trim() ?? null;
    this._theme = props.theme ? { ...props.theme } : {};
    this._sections = props.sections ? [...props.sections] : [];
    this._guests = props.guests ? [...props.guests] : [];
    this._schedules = props.schedules ? [...props.schedules] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: InvitationProps, actorId?: string): Invitation {
    const invitation = new Invitation({ ...props, audit: AuditInfo.create(actorId) });
    invitation.addDomainEvent(
      new InvitationCreatedEvent({
        invitationId: invitation.id,
        code: invitation.code,
        eventId: invitation.eventId,
        slug: invitation.slug,
      }),
    );
    return invitation;
  }

  get code(): string { return this._code; }
  get eventId(): string { return this._eventId; }
  get slug(): string { return this._slug; }
  get title(): string { return this._title; }
  get description(): string | null { return this._description; }
  get language(): string { return this._language; }
  get status(): InvitationStatus { return this._status; }
  get visibility(): InvitationVisibility { return this._visibility; }
  get passwordHash(): string | null { return this._passwordHash; }
  get expiresAt(): Date | null { return this._expiresAt; }
  get galleryId(): string | null { return this._galleryId; }
  get coverMediaId(): string | null { return this._coverMediaId; }
  get musicUrl(): string | null { return this._musicUrl; }
  get theme(): Record<string, unknown> { return this._theme; }
  get sections(): readonly InvitationSection[] { return this._sections; }
  get guests(): readonly InvitationGuest[] { return this._guests; }
  get schedules(): readonly InvitationSchedule[] { return this._schedules; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean { return this._audit.isDeleted(); }

  updateConfig(
    props: Partial<Pick<InvitationProps, 'title' | 'description' | 'language' | 'visibility' | 'passwordHash' | 'expiresAt' | 'galleryId' | 'coverMediaId' | 'musicUrl' | 'theme'>>,
    actorId?: string,
  ): void {
    this.ensureNotDeleted();
    if (props.title) this._title = props.title.trim();
    if (props.description !== undefined) this._description = props.description;
    if (props.language) this._language = props.language.toLowerCase().trim();
    if (props.visibility) this._visibility = props.visibility;
    if (props.passwordHash !== undefined) this._passwordHash = props.passwordHash;
    if (props.expiresAt !== undefined) this._expiresAt = props.expiresAt;
    if (props.galleryId !== undefined) this._galleryId = props.galleryId;
    if (props.coverMediaId !== undefined) this._coverMediaId = props.coverMediaId;
    if (props.musicUrl !== undefined) this._musicUrl = props.musicUrl;
    if (props.theme) this._theme = { ...props.theme };
    this._audit = this._audit.touch(actorId);
  }

  publish(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === InvitationStatus.PUBLISHED) return;
    this._status = InvitationStatus.PUBLISHED;
    this._audit = this._audit.touch(actorId);
    this.addDomainEvent(
      new InvitationPublishedEvent({
        invitationId: this.id,
        code: this._code,
        publishedAt: new Date(),
      }),
    );
  }

  unpublish(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === InvitationStatus.DRAFT) return;
    this._status = InvitationStatus.DRAFT;
    this._audit = this._audit.touch(actorId);
  }

  confirmRSVP(guestId: string, companions: string[], dietaryRestrictions?: string | null, guestNotes?: string | null): void {
    this.ensureNotDeleted();
    if (this._status !== InvitationStatus.PUBLISHED) {
      throw new InvalidInvitationOperationException('Cannot confirm RSVP on an unpublished invitation.');
    }
    if (this._expiresAt && this._expiresAt.getTime() < Date.now()) {
      throw new InvalidInvitationOperationException('This invitation has expired.');
    }

    const guest = this._guests.find((g) => g.id === guestId);
    if (!guest) throw new GuestNotFoundException(guestId);

    guest.confirm(companions, dietaryRestrictions, guestNotes);

    this.addDomainEvent(
      new GuestRSVPUpdatedEvent({
        invitationId: this.id,
        guestId: guest.id,
        displayName: guest.displayName,
        status: RSVPStatus.CONFIRMED,
        companionsCount: companions.length,
      }),
    );
  }

  declineRSVP(guestId: string, guestNotes?: string | null): void {
    this.ensureNotDeleted();
    const guest = this._guests.find((g) => g.id === guestId);
    if (!guest) throw new GuestNotFoundException(guestId);

    guest.decline(guestNotes);

    this.addDomainEvent(
      new GuestRSVPUpdatedEvent({
        invitationId: this.id,
        guestId: guest.id,
        displayName: guest.displayName,
        status: RSVPStatus.DECLINED,
        companionsCount: 0,
      }),
    );
  }

  addGuest(guest: InvitationGuest, actorId?: string): void {
    this.ensureNotDeleted();
    this._guests.push(guest);
    this._audit = this._audit.touch(actorId);
  }

  addSection(section: InvitationSection, actorId?: string): void {
    this.ensureNotDeleted();
    this._sections.push(section);
    this._audit = this._audit.touch(actorId);
  }

  setSections(sections: InvitationSection[], actorId?: string): void {
    this.ensureNotDeleted();
    this._sections = [...sections];
    this._audit = this._audit.touch(actorId);
  }

  addSchedule(schedule: InvitationSchedule, actorId?: string): void {
    this.ensureNotDeleted();
    this._schedules.push(schedule);
    this._audit = this._audit.touch(actorId);
  }

  setSchedules(schedules: InvitationSchedule[], actorId?: string): void {
    this.ensureNotDeleted();
    this._schedules = [...schedules];
    this._audit = this._audit.touch(actorId);
  }

  softDelete(actorId?: string): void {
    this._audit = this._audit.softDelete(actorId);
    this._status = InvitationStatus.ARCHIVED;
  }

  restore(actorId?: string): void {
    this._audit = this._audit.restore(actorId);
    this._status = InvitationStatus.DRAFT;
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new Error('Invitation is archived/deleted.');
    }
  }
}
