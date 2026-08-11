import { Injectable } from '@nestjs/common';
import type { NotificationTemplate } from '../../domain/entities/notification-template.entity.js';

@Injectable()
export class NotificationTemplateRenderer {
  render(template: NotificationTemplate, variables: Record<string, string>): { subject: string | null; body: string } {
    let subject = template.subjectLayout;
    let body = template.bodyLayout;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
      if (subject) {
        subject = subject.replace(placeholder, value);
      }
      body = body.replace(placeholder, value);
    }

    return { subject, body };
  }
}
