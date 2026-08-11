import { Injectable, Inject } from '@nestjs/common';
import {
  OPPORTUNITY_REPOSITORY,
  type OpportunityRepositoryPort,
} from '../ports/opportunity.repository.port.js';
import type { Opportunity } from '../../domain/entities/opportunity.entity.js';
import { CRMActivity } from '../../domain/entities/crm-activity.entity.js';
import { CRMTask } from '../../domain/entities/crm-task.entity.js';
import type { CRMActivityType } from '../../domain/enums/crm.enums.js';
import { OpportunityNotFoundException } from '../../domain/errors/crm.errors.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface LogActivityCommand {
  opportunityId: string;
  activityType: CRMActivityType;
  title: string;
  notes?: string;
  occurredAt?: Date;
  actorId?: string;
}

export interface AddTaskCommand {
  opportunityId: string;
  title: string;
  description?: string;
  dueDate: Date;
  actorId?: string;
}

export interface CompleteTaskCommand {
  opportunityId: string;
  taskId: string;
  actorId?: string;
}

@Injectable()
export class ManageCRMActivitiesUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY)
    private readonly opportunityRepo: OpportunityRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async logActivity(command: LogActivityCommand): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(command.opportunityId);

    const activity = new CRMActivity({
      opportunityId: opportunity.id,
      activityType: command.activityType,
      title: command.title,
      notes: command.notes,
      occurredAt: command.occurredAt,
      actorId: command.actorId,
    });

    opportunity.logActivity(activity, command.actorId);
    return this.saveAndPublish(opportunity);
  }

  async addTask(command: AddTaskCommand): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(command.opportunityId);

    const task = new CRMTask({
      opportunityId: opportunity.id,
      title: command.title,
      description: command.description,
      dueDate: command.dueDate,
    });

    opportunity.addTask(task, command.actorId);
    return this.saveAndPublish(opportunity);
  }

  async completeTask(command: CompleteTaskCommand): Promise<Opportunity> {
    const opportunity = await this.getOrThrow(command.opportunityId);

    const task = opportunity.tasks.find((t) => t.id === command.taskId);
    if (!task) throw new OpportunityNotFoundException(`Task "${command.taskId}" not found.`);

    task.complete();
    return this.saveAndPublish(opportunity);
  }

  private async getOrThrow(id: string): Promise<Opportunity> {
    const found = await this.opportunityRepo.findById(id);
    if (!found) throw new OpportunityNotFoundException(id);
    return found;
  }

  private async saveAndPublish(opportunity: Opportunity): Promise<Opportunity> {
    const saved = await this.opportunityRepo.save(opportunity);
    await this.eventPublisher.publishAll(opportunity.domainEvents);
    opportunity.clearDomainEvents();
    return saved;
  }
}
