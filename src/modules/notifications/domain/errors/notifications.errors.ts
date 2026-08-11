export class NotificationsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotificationNotFoundException extends NotificationsException {
  constructor(identifier: string) {
    super(`Notification with identifier "${identifier}" was not found.`);
  }
}

export class NotificationTemplateNotFoundException extends NotificationsException {
  constructor(identifier: string) {
    super(`Notification template with identifier "${identifier}" was not found.`);
  }
}

export class InvalidNotificationTransitionException extends NotificationsException {
  constructor(from: string, to: string, reason?: string) {
    super(`Invalid notification status transition from "${from}" to "${to}".${reason ? ` Reason: ${reason}` : ''}`);
  }
}

export class NotificationDispatchException extends NotificationsException {
  constructor(providerName: string, reason: string) {
    super(`Notification dispatch failed using provider "${providerName}": ${reason}`);
  }
}
