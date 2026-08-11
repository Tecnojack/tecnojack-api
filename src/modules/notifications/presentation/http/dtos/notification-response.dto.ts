import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationChannel, NotificationStatus, NotificationPriority, RecipientType } from '../../../domain/enums/notifications.enums.js';
import type { Notification } from '../../../domain/entities/notification.entity.js';
import type { NotificationTemplate } from '../../../domain/entities/notification-template.entity.js';

export class RecipientResponseDto {
  @ApiProperty() id!: string;
  @ApiPropertyOptional() personId?: string | null;
  @ApiProperty() recipientAddress!: string;
  @ApiProperty({ enum: RecipientType }) recipientType!: RecipientType;
}

export class HistoryResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: NotificationStatus }) status!: NotificationStatus;
  @ApiPropertyOptional() providerName?: string | null;
  @ApiPropertyOptional() errorMessage?: string | null;
  @ApiProperty() attemptedAt!: Date;
}

export class NotificationResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiPropertyOptional() templateId?: string | null;
  @ApiProperty({ enum: NotificationChannel }) channel!: NotificationChannel;
  @ApiProperty({ enum: NotificationStatus }) status!: NotificationStatus;
  @ApiProperty({ enum: NotificationPriority }) priority!: NotificationPriority;
  @ApiProperty() variables!: Record<string, string>;
  @ApiPropertyOptional() scheduledFor?: Date | null;
  @ApiProperty() retryCount!: number;
  @ApiProperty() maxRetries!: number;
  @ApiPropertyOptional() errorMessage?: string | null;
  @ApiProperty({ type: [RecipientResponseDto] }) recipients!: RecipientResponseDto[];
  @ApiProperty({ type: [HistoryResponseDto] }) historyLogs!: HistoryResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() deletedAt?: Date | null;

  static fromDomain(notification: Notification): NotificationResponseDto {
    const dto = new NotificationResponseDto();
    dto.id = notification.id;
    dto.code = notification.code;
    dto.templateId = notification.templateId;
    dto.channel = notification.channel;
    dto.status = notification.status;
    dto.priority = notification.priority;
    dto.variables = notification.variables;
    dto.scheduledFor = notification.scheduledFor;
    dto.retryCount = notification.retryCount;
    dto.maxRetries = notification.maxRetries;
    dto.errorMessage = notification.errorMessage;
    dto.recipients = notification.recipients.map((r) => ({
      id: r.id,
      personId: r.personId,
      recipientAddress: r.recipientAddress,
      recipientType: r.recipientType,
    }));
    dto.historyLogs = notification.historyLogs.map((h) => ({
      id: h.id,
      status: h.status,
      providerName: h.providerName,
      errorMessage: h.errorMessage,
      attemptedAt: h.attemptedAt,
    }));
    dto.createdAt = notification.audit.createdAt;
    dto.deletedAt = notification.audit.deletedAt;
    return dto;
  }
}

export class TemplateResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiProperty() category!: string;
  @ApiProperty() language!: string;
  @ApiProperty() version!: number;
  @ApiPropertyOptional() subjectLayout?: string | null;
  @ApiProperty() bodyLayout!: string;
  @ApiProperty() variables!: string[];

  static fromDomain(template: NotificationTemplate): TemplateResponseDto {
    const dto = new TemplateResponseDto();
    dto.id = template.id;
    dto.code = template.code;
    dto.name = template.name;
    dto.category = template.category;
    dto.language = template.language;
    dto.version = template.version;
    dto.subjectLayout = template.subjectLayout;
    dto.bodyLayout = template.bodyLayout;
    dto.variables = template.variables;
    return dto;
  }
}
