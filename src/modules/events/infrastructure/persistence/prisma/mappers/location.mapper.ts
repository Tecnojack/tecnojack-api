import type { LocationModel as PrismaLocation } from '../../../../../../generated/prisma/client.js';
import { Location } from '../../../../domain/entities/location.entity.js';

export interface PersistenceLocationData {
  id: string;
  name: string;
  type: string;
  addressLine: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  contactName: string | null;
  contactPhone: string | null;
  accessInstructions: string | null;
  parkingInstructions: string | null;
  technicalNotes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class LocationMapper {
  static toDomain(raw: PrismaLocation): Location {
    return new Location({
      id: raw.id,
      name: raw.name,
      type: raw.type,
      addressLine: raw.addressLine,
      city: raw.city,
      region: raw.region,
      countryCode: raw.countryCode,
      postalCode: raw.postalCode,
      latitude: raw.latitude,
      longitude: raw.longitude,
      timezone: raw.timezone,
      contactName: raw.contactName,
      contactPhone: raw.contactPhone,
      accessInstructions: raw.accessInstructions,
      parkingInstructions: raw.parkingInstructions,
      technicalNotes: raw.technicalNotes,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: Location): PersistenceLocationData {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      addressLine: entity.addressLine,
      city: entity.city,
      region: entity.region,
      countryCode: entity.countryCode,
      postalCode: entity.postalCode,
      latitude: entity.latitude,
      longitude: entity.longitude,
      timezone: entity.timezone,
      contactName: entity.contactName,
      contactPhone: entity.contactPhone,
      accessInstructions: entity.accessInstructions,
      parkingInstructions: entity.parkingInstructions,
      technicalNotes: entity.technicalNotes,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
