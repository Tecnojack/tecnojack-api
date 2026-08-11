import { AggregateRoot } from '../../../../platform/domain/entities/aggregate-root.js';
import type { ISoftDeletable } from '../../../../platform/domain/interfaces/soft-deletable.interface.js';
import { AuditInfo } from '../../../../platform/domain/value-objects/audit-info.value-object.js';
import { NotificationStatus, NotificationPriority } from '../enums/notifications.enums.js';
import type { NotificationChannel } from '../enums/notifications.enums.js';
import type { NotificationRecipient } from './notification-recipient.entity.js';
import type { NotificationHistory } from './notification-history.entity.js';
import { InvalidNotificationTransitionException } from '../errors/notifications.errors.js';
import {
  NotificationCreatedEvent,
  NotificationStatusChangedEvent,
  NotificationDispatchedEvent,
  NotificationDispatchFailedEvent,
} from '../events/notifications.events.js';

export interface NotificationProps {
  id?: string;
  code: string;
  templateId?: string | null;
  channel: NotificationChannel;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  variables?: Record<string, string>;
  scheduledFor?: Date | null;
  retryCount?: number;
  maxRetries?: number;
  errorMessage?: string | null;
  recipients?: NotificationRecipient[];
  historyLogs?: NotificationHistory[];
  audit?: AuditInfo;
}

export class Notification extends AggregateRoot<string> implements ISoftDeletable {
  private readonly _code: string;
  private readonly _templateId: string | null;
  private readonly _channel: NotificationChannel;
  private _status: NotificationStatus;
  private _priority: NotificationPriority;
  private readonly _variables: Record<string, string>;
  private _scheduledFor: Date | null;
  private _retryCount: number;
  private readonly _maxRetries: number;
  private _errorMessage: string | null;
  private _recipients: NotificationRecipient[];
  private _historyLogs: NotificationHistory[];
  private _audit: AuditInfo;

  constructor(props: NotificationProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Notification code cannot be empty.');
    }

    const id = props.id ?? crypto.randomUUID();
    super(id);

    this._code = props.code.trim();
    this._templateId = props.templateId ?? null;
    this._channel = props.channel;
    this._status = props.status ?? (props.scheduledFor ? NotificationStatus.SCHEDULED : NotificationStatus.PENDING);
    this._priority = props.priority ?? NotificationPriority.MEDIUM;
    this._variables = props.variables ? { ...props.variables } : {};
    this._scheduledFor = props.scheduledFor ?? null;
    this._retryCount = props.retryCount ?? 0;
    this._maxRetries = props.maxRetries ?? 3;
    this._errorMessage = props.errorMessage ?? null;
    this._recipients = props.recipients ? [...props.recipients] : [];
    this._historyLogs = props.historyLogs ? [...props.historyLogs] : [];
    this._audit = props.audit ?? AuditInfo.create();
  }

  static create(props: NotificationProps, actorId?: string): Notification {
    const notification = new Notification({ ...props, audit: AuditInfo.create(actorId) });

    notification.addDomainEvent(
      new NotificationCreatedEvent({
        notificationId: notification.id,
        code: notification.code,
        channel: notification.channel,
        priority: notification.priority,
        scheduledFor: notification.scheduledFor,
      }),
    );

    return notification;
  }

  get code(): string { return this._code; }
  get templateId(): string | null { return this._templateId; }
  get channel(): NotificationChannel { return this._channel; }
  get status(): NotificationStatus { return this._status; }
  get priority(): NotificationPriority { return this._priority; }
  get variables(): Record<string, string> { return this._variables; }
  get scheduledFor(): Date | null { return this._scheduledFor; }
  get retryCount(): number { return this._retryCount; }
  get maxRetries(): number { return this._maxRetries; }
  get errorMessage(): string | null { return this._errorMessage; }
  get recipients(): readonly NotificationRecipient[] { return this._recipients; }
  get historyLogs(): readonly NotificationHistory[] { return this._historyLogs; }
  get audit(): AuditInfo { return this._audit; }

  isDeleted(): boolean {
    return this._audit.isDeleted();
  }

  changePriority(newPriority: NotificationPriority, actorId?: string): void {
    this.ensureNotDeleted();
    this._priority = newPriority;
    this._audit = this._audit.touch(actorId);
  }

  cancel(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status === NotificationStatus.DISPATCHED) {
      throw new InvalidNotificationTransitionException(this._status, NotificationStatus.CANCELLED, 'Cannot cancel an already dispatched notification.');
    }
    const prev = this._status;
    this._status = NotificationStatus.CANCELLED;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new NotificationStatusChangedEvent({
        notificationId: this.id,
        code: this._code,
        fromStatus: prev,
        toStatus: NotificationStatus.CANCELLED,
      }),
    );
  }

  markDispatched(providerName: string, actorId?: string): void {
    this.ensureNotDeleted();
    const prev = this._status;
    this._status = NotificationStatus.DISPATCHED;
    this._errorMessage = null;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new NotificationStatusChangedEvent({
        notificationId: this.id,
        code: this._code,
        fromStatus: prev,
        toStatus: NotificationStatus.DISPATCHED,
      }),
    );

    this.addDomainEvent(
      new NotificationDispatchedEvent({
        notificationId: this.id,
        code: this._code,
        providerName,
        attemptedAt: new Date(),
      }),
    );
  }

  markFailed(providerName: string, errorMessage: string, actorId?: string): void {
    this.ensureNotDeleted();
    this._retryCount++;
    this._errorMessage = errorMessage;
    this._audit = this._audit.touch(actorId);

    const prev = this._status;
    if (this._retryCount >= this._maxRetries) {
      this._status = NotificationStatus.FAILED;
    }

    this.addDomainEvent(
      new NotificationStatusChangedEvent({
        notificationId: this.id,
        code: this._code,
        fromStatus: prev,
        toStatus: this._status,
        errorMessage,
      }),
    );

    this.addDomainEvent(
      new NotificationDispatchFailedEvent({
        notificationId: this.id,
        code: this._code,
        providerName,
        errorMessage,
        retryCount: this._retryCount,
      }),
    );
  }

  retry(actorId?: string): void {
    this.ensureNotDeleted();
    if (this._status !== NotificationStatus.FAILED && this._status !== NotificationStatus.PENDING) {
      throw new InvalidNotificationTransitionException(this._status, NotificationStatus.PENDING, 'Can only retry failed or pending notifications.');
    }
    const prev = this._status;
    this._status = NotificationStatus.PENDING;
    this._errorMessage = null;
    this._audit = this._audit.touch(actorId);

    this.addDomainEvent(
      new NotificationStatusChangedEvent({
        notificationId: this.id,
        code: this._code,
        fromStatus: prev,
        toStatus: NotificationStatus.PENDING,
      }),
    );
  }

  addRecipient(recipient: NotificationRecipient): void {
    this._recipients.push(recipient);
  }

  addHistoryLog(log: NotificationHistory): void {
    this._historyLogs.push(log);
  }

  softDelete(actorId?: string): void {
    this._audit = this._audit.softDelete(actorId);
  }

  restore(actorId?: string): void {
    this._audit = this._audit.restore(actorId);
  }

  private ensureNotDeleted(): void {
    if (this._audit.isDeleted()) {
      throw new Error('Notification is archived/deleted.');
    }
  }
}
