import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Location } from '../../../../domain/entities/location.entity.js';
import type { LocationRepositoryPort } from '../../../../application/ports/event.repository.port.js';
import { LocationMapper } from '../mappers/location.mapper.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';

@Injectable()
export class PrismaLocationRepository implements LocationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(location: Location): Promise<Location> {
    const data = LocationMapper.toPersistence(location);
    const saved = await this.prisma.locationModel.upsert({
      where: { id: location.id },
      create: data,
      update: data,
    });
    return LocationMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Location | null> {
    const found = await this.prisma.locationModel.findUnique({
      where: { id },
    });
    if (!found) return null;
    return LocationMapper.toDomain(found);
  }

  async findAll(search?: string, onlyActive = true): Promise<Location[]> {
    const query = search?.trim();
    const where: Prisma.LocationModelWhereInput = {
      ...(onlyActive ? { isActive: true } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { city: { contains: query, mode: 'insensitive' } },
              { addressLine: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const found = await this.prisma.locationModel.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return found.map((f) => LocationMapper.toDomain(f));
  }
}
