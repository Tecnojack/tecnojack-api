import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Notification } from '../../../../domain/entities/notification.entity.js';
import { NotificationRecipient } from '../../../../domain/entities/notification-recipient.entity.js';
import { NotificationHistory } from '../../../../domain/entities/notification-history.entity.js';
import { NotificationTemplate } from '../../../../domain/entities/notification-template.entity.js';
import type {
  NotificationRepositoryPort,
  ListNotificationsFilter,
} from '../../../../application/ports/notification.repository.port.js';
import type { PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import type {
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
  RecipientType,
} from '../../../../domain/enums/notifications.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import type {
  NotificationModel as PrismaNotification,
  NotificationRecipientModel as PrismaRecipient,
  NotificationHistoryModel as PrismaHistory,
  NotificationTemplateModel as PrismaTemplate,
} from '../../../../../../generated/prisma/client.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

type PrismaNotificationWithRelations = PrismaNotification & {
  recipients: PrismaRecipient[];
  historyLogs: PrismaHistory[];
};

@Injectable()
export class PrismaNotificationRepository implements NotificationRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(notification: Notification): Promise<Notification> {
    await this.prisma.$transaction(async (tx) => {
      // Clear recipients and logs on updates
      await tx.notificationRecipientModel.deleteMany({ where: { notificationId: notification.id } });
      await tx.notificationHistoryModel.deleteMany({ where: { notificationId: notification.id } });

      await tx.notificationModel.upsert({
        where: { id: notification.id },
        create: {
          id: notification.id,
          code: notification.code,
          templateId: notification.templateId,
          channel: notification.channel as string as never,
          status: notification.status as string as never,
          priority: notification.priority as string as never,
          variablesJson: JSON.stringify(notification.variables),
          scheduledFor: notification.scheduledFor,
          retryCount: notification.retryCount,
          maxRetries: notification.maxRetries,
          errorMessage: notification.errorMessage,
          createdAt: notification.audit.createdAt,
          createdBy: notification.audit.createdBy,
          updatedAt: notification.audit.updatedAt,
          updatedBy: notification.audit.updatedBy,
          deletedAt: notification.audit.deletedAt,
          deletedBy: notification.audit.deletedBy,
        },
        update: {
          status: notification.status as string as never,
          priority: notification.priority as string as never,
          retryCount: notification.retryCount,
          errorMessage: notification.errorMessage,
          updatedAt: notification.audit.updatedAt,
          updatedBy: notification.audit.updatedBy,
          deletedAt: notification.audit.deletedAt,
          deletedBy: notification.audit.deletedBy,
        },
      });

      for (const r of notification.recipients) {
        await tx.notificationRecipientModel.create({
          data: {
            id: r.id,
            notificationId: notification.id,
            personId: r.personId,
            recipientAddress: r.recipientAddress,
            recipientType: r.recipientType as string as never,
            createdAt: r.createdAt,
          },
        });
      }

      for (const h of notification.historyLogs) {
        await tx.notificationHistoryModel.create({
          data: {
            id: h.id,
            notificationId: notification.id,
            status: h.status as string as never,
            providerName: h.providerName,
            errorMessage: h.errorMessage,
            attemptedAt: h.attemptedAt,
          },
        });
      }
    });

    return (await this.findById(notification.id))!;
  }

  async findById(id: string): Promise<Notification | null> {
    const raw = await this.prisma.notificationModel.findUnique({
      where: { id },
      include: { recipients: true, historyLogs: true },
    });
    if (!raw) return null;
    return this.toDomain(raw as PrismaNotificationWithRelations);
  }

  async findByCode(code: string): Promise<Notification | null> {
    const raw = await this.prisma.notificationModel.findUnique({
      where: { code: code.toUpperCase() },
      include: { recipients: true, historyLogs: true },
    });
    if (!raw) return null;
    return this.toDomain(raw as PrismaNotificationWithRelations);
  }

  async findAll(filter: ListNotificationsFilter): Promise<PaginatedResult<Notification>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.NotificationModelWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { errorMessage: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.NotificationModelWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.channel ? { channel: filter.channel as never } : {}),
      ...(filter.status ? { status: filter.status as never } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.notificationModel.count({ where });
    const records = await this.prisma.notificationModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { recipients: true, historyLogs: true },
    });

    return {
      data: (records as PrismaNotificationWithRelations[]).map((r) => this.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('NTF');
  }

  // Templates
  async saveTemplate(template: NotificationTemplate): Promise<NotificationTemplate> {
    await this.prisma.notificationTemplateModel.upsert({
      where: { id: template.id },
      create: {
        id: template.id,
        code: template.code,
        name: template.name,
        category: template.category,
        language: template.language,
        version: template.version,
        subjectLayout: template.subjectLayout,
        bodyLayout: template.bodyLayout,
        variables: template.variables,
      },
      update: {
        name: template.name,
        subjectLayout: template.subjectLayout,
        bodyLayout: template.bodyLayout,
        variables: template.variables,
      },
    });

    return (await this.findTemplateById(template.id))!;
  }

  async findTemplateById(id: string): Promise<NotificationTemplate | null> {
    const raw = await this.prisma.notificationTemplateModel.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toTemplateDomain(raw);
  }

  async findTemplateByCode(code: string): Promise<NotificationTemplate | null> {
    const raw = await this.prisma.notificationTemplateModel.findUnique({ where: { code: code.toUpperCase() } });
    if (!raw) return null;
    return this.toTemplateDomain(raw);
  }

  async nextTemplateCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('TEMP');
  }

  private toDomain(raw: PrismaNotificationWithRelations): Notification {
    const recipients = raw.recipients.map(
      (r: PrismaRecipient) =>
        new NotificationRecipient({
          id: r.id,
          personId: r.personId,
          recipientAddress: r.recipientAddress,
          recipientType: r.recipientType as unknown as RecipientType,
          createdAt: r.createdAt,
        }),
    );

    const historyLogs = raw.historyLogs.map(
      (h: PrismaHistory) =>
        new NotificationHistory({
          id: h.id,
          status: h.status as unknown as NotificationStatus,
          providerName: h.providerName,
          errorMessage: h.errorMessage,
          attemptedAt: h.attemptedAt,
        }),
    );

    const audit = new AuditInfo({
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy,
    });

    return new Notification({
      id: raw.id,
      code: raw.code,
      templateId: raw.templateId,
      channel: raw.channel as unknown as NotificationChannel,
      status: raw.status as unknown as NotificationStatus,
      priority: raw.priority as unknown as NotificationPriority,
      variables: raw.variablesJson ? (JSON.parse(raw.variablesJson) as Record<string, string>) : {},
      scheduledFor: raw.scheduledFor,
      retryCount: raw.retryCount,
      maxRetries: raw.maxRetries,
      errorMessage: raw.errorMessage,
      recipients,
      historyLogs,
      audit,
    });
  }

  private toTemplateDomain(raw: PrismaTemplate): NotificationTemplate {
    return new NotificationTemplate({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      category: raw.category,
      language: raw.language,
      version: raw.version,
      subjectLayout: raw.subjectLayout,
      bodyLayout: raw.bodyLayout,
      variables: raw.variables,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }
}
