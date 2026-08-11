import { Injectable, Inject } from '@nestjs/common';
import {
  ADMINISTRATION_REPOSITORY,
  type AdministrationRepositoryPort,
} from '../ports/administration.repository.port.js';
import { Catalog } from '../../domain/entities/catalog.entity.js';
import type { CatalogType } from '../../domain/enums/administration.enums.js';
import { CatalogNotFoundException } from '../../domain/errors/administration.errors.js';

export interface CreateCatalogCommand {
  name: string;
  type: CatalogType;
  value: string;
  label: string;
  description?: string;
}

export interface UpdateCatalogCommand {
  id: string;
  value: string;
  label: string;
  description?: string;
  actorId?: string;
}

@Injectable()
export class ManageCatalogsUseCase {
  constructor(
    @Inject(ADMINISTRATION_REPOSITORY)
    private readonly repo: AdministrationRepositoryPort,
  ) {}

  async createCatalogEntry(command: CreateCatalogCommand): Promise<Catalog> {
    const existing = await this.repo.findCatalogByTypeAndValue(command.type, command.value);
    if (existing) {
      throw new Error(`Catalog entry for type "${command.type}" with value "${command.value}" already exists.`);
    }

    const code = await this.repo.nextCatalogCode();
    const entry = new Catalog({
      code,
      name: command.name,
      type: command.type,
      value: command.value,
      label: command.label,
      description: command.description,
    });

    return this.repo.saveCatalog(entry);
  }

  async updateCatalogEntry(command: UpdateCatalogCommand): Promise<Catalog> {
    const entry = await this.repo.findCatalogById(command.id);
    if (!entry) throw new CatalogNotFoundException(command.id);

    entry.updateDetails(command.value, command.label, command.description, command.actorId);
    return this.repo.saveCatalog(entry);
  }

  async deleteCatalogEntry(id: string, actorId?: string): Promise<Catalog> {
    const entry = await this.repo.findCatalogById(id);
    if (!entry) throw new CatalogNotFoundException(id);

    entry.softDelete(actorId);
    return this.repo.saveCatalog(entry);
  }

  async listByType(type: CatalogType): Promise<Catalog[]> {
    return this.repo.findCatalogsByType(type);
  }

  async listAll(): Promise<Catalog[]> {
    return this.repo.findAllCatalogs();
  }
}
