import { Injectable, Inject } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepositoryPort,
} from '../ports/notification.repository.port.js';
import { NotificationTemplate } from '../../domain/entities/notification-template.entity.js';

export interface CreateTemplateCommand {
  name: string;
  category: string;
  language: string;
  subjectLayout?: string;
  bodyLayout: string;
  variables?: string[];
}

@Injectable()
export class ManageNotificationTemplatesUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: NotificationRepositoryPort,
  ) {}

  async createTemplate(command: CreateTemplateCommand): Promise<NotificationTemplate> {
    const code = await this.repo.nextTemplateCode();
    const template = new NotificationTemplate({
      code,
      name: command.name,
      category: command.category,
      language: command.language,
      subjectLayout: command.subjectLayout,
      bodyLayout: command.bodyLayout,
      variables: command.variables,
    });
    return this.repo.saveTemplate(template);
  }

  async getTemplate(identifier: string): Promise<NotificationTemplate> {
    const isCode = identifier.toUpperCase().startsWith('TEMP-');
    const found = isCode ? await this.repo.findTemplateByCode(identifier) : await this.repo.findTemplateById(identifier);
    if (!found) throw new Error(`Template "${identifier}" not found.`);
    return found;
  }
}
