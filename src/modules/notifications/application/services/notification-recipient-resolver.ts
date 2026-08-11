import { Injectable, Inject } from '@nestjs/common';
import {
  OPPORTUNITY_REPOSITORY,
  type OpportunityRepositoryPort,
} from '../../../crm/application/ports/opportunity.repository.port.js';
import { PeopleFacade } from '../../../people/public/people.facade.js';

@Injectable()
export class NotificationRecipientResolver {
  constructor(
    private readonly peopleFacade: PeopleFacade,
    @Inject(OPPORTUNITY_REPOSITORY)
    private readonly opportunityRepo: OpportunityRepositoryPort,
  ) {}

  async resolveAddress(personId: string, channel: string): Promise<string> {
    try {
      const person = await this.peopleFacade.findPersonByIdOrCode(personId);
      if (!person) return '';
      
      const points = person.contactPoints ?? [];
      const primaryPoint = points.find((p) => p.isPrimary) ?? points[0];

      if (channel === 'EMAIL') {
        const emailPoint = points.find((p) => String(p.type) === 'EMAIL');
        return emailPoint ? emailPoint.value : (primaryPoint && String(primaryPoint.type) === 'EMAIL' ? primaryPoint.value : '');
      }

      if (channel === 'WHATSAPP' || channel === 'SMS') {
        const phonePoint = points.find((p) => String(p.type) === 'PHONE' || String(p.type) === 'MOBILE');
        return phonePoint ? phonePoint.value : (primaryPoint && (String(primaryPoint.type) === 'PHONE' || String(primaryPoint.type) === 'MOBILE') ? primaryPoint.value : '');
      }
    } catch {
      // Allow fallback
    }
    return '';
  }
}
