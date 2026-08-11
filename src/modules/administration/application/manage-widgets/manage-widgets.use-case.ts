import { Injectable, Inject } from '@nestjs/common';
import {
  ADMINISTRATION_REPOSITORY,
  type AdministrationRepositoryPort,
} from '../ports/administration.repository.port.js';
import { DashboardWidget } from '../../domain/entities/dashboard-widget.entity.js';
import type { WidgetType, WidgetSize } from '../../domain/enums/administration.enums.js';
import { WidgetNotFoundException } from '../../domain/errors/administration.errors.js';

export interface CreateWidgetCommand {
  title: string;
  type: WidgetType;
  dataSourceUrl: string;
  position?: number;
  size: WidgetSize;
  permissions?: string[];
}

export interface UpdateWidgetCommand {
  id: string;
  title: string;
  type: WidgetType;
  dataSourceUrl: string;
  position: number;
  size: WidgetSize;
  permissions: string[];
  actorId?: string;
}

@Injectable()
export class ManageWidgetsUseCase {
  constructor(
    @Inject(ADMINISTRATION_REPOSITORY)
    private readonly repo: AdministrationRepositoryPort,
  ) {}

  async createWidget(command: CreateWidgetCommand): Promise<DashboardWidget> {
    const code = await this.repo.nextWidgetCode();
    const widget = new DashboardWidget({
      code,
      title: command.title,
      type: command.type,
      dataSourceUrl: command.dataSourceUrl,
      position: command.position,
      size: command.size,
      permissions: command.permissions,
    });
    return this.repo.saveWidget(widget);
  }

  async updateWidget(command: UpdateWidgetCommand): Promise<DashboardWidget> {
    const widget = await this.repo.findWidgetById(command.id);
    if (!widget) throw new WidgetNotFoundException(command.id);

    widget.updateDetails(
      command.title,
      command.type,
      command.dataSourceUrl,
      command.position,
      command.size,
      command.permissions,
      command.actorId,
    );
    return this.repo.saveWidget(widget);
  }

  async deleteWidget(id: string, actorId?: string): Promise<DashboardWidget> {
    const widget = await this.repo.findWidgetById(id);
    if (!widget) throw new WidgetNotFoundException(id);

    widget.softDelete(actorId);
    return this.repo.saveWidget(widget);
  }

  async listWidgets(): Promise<DashboardWidget[]> {
    return this.repo.findAllWidgets();
  }
}
