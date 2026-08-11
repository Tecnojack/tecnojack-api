import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../../../../platform/database/prisma/prisma.service.js';
import { Invitation } from '../../../../domain/entities/invitation.entity.js';
import { InvitationSection } from '../../../../domain/entities/invitation-section.entity.js';
import { InvitationGuest } from '../../../../domain/entities/invitation-guest.entity.js';
import { InvitationSchedule } from '../../../../domain/entities/invitation-schedule.entity.js';
import type {
  InvitationRepositoryPort,
  ListInvitationsFilter,
} from '../../../../application/ports/invitation.repository.port.js';
import type { PaginatedResult } from '../../../../../../platform/domain/types/pagination.types.js';
import type {
  InvitationStatus,
  InvitationVisibility,
  RSVPStatus,
} from '../../../../domain/enums/invitations.enums.js';
import type { Prisma } from '../../../../../../generated/prisma/client.js';
import type {
  InvitationModel as PrismaInvitation,
  InvitationSectionModel as PrismaSection,
  InvitationGuestModel as PrismaGuest,
  InvitationScheduleModel as PrismaSchedule,
} from '../../../../../../generated/prisma/client.js';
import { AuditInfo } from '../../../../../../platform/domain/value-objects/audit-info.value-object.js';
import {
  SEQUENCE_GENERATOR,
  type SequenceGeneratorPort,
} from '../../../../../../platform/domain/providers/sequence-generator.port.js';

type PrismaInvitationWithRelations = PrismaInvitation & {
  sections: PrismaSection[];
  guests: PrismaGuest[];
  schedules: PrismaSchedule[];
};

@Injectable()
export class PrismaInvitationRepository implements InvitationRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SEQUENCE_GENERATOR)
    private readonly sequenceGenerator: SequenceGeneratorPort,
  ) {}

  async save(invitation: Invitation): Promise<Invitation> {
    await this.prisma.$transaction(async (tx) => {
      // Clean dynamic relationship elements for updating safety
      await tx.invitationSectionModel.deleteMany({ where: { invitationId: invitation.id } });
      await tx.invitationGuestModel.deleteMany({ where: { invitationId: invitation.id } });
      await tx.invitationScheduleModel.deleteMany({ where: { invitationId: invitation.id } });

      await tx.invitationModel.upsert({
        where: { id: invitation.id },
        create: {
          id: invitation.id,
          code: invitation.code,
          eventId: invitation.eventId,
          slug: invitation.slug,
          title: invitation.title,
          description: invitation.description,
          language: invitation.language,
          status: invitation.status as string as never,
          visibility: invitation.visibility as string as never,
          passwordHash: invitation.passwordHash,
          expiresAt: invitation.expiresAt,
          galleryId: invitation.galleryId,
          coverMediaId: invitation.coverMediaId,
          musicUrl: invitation.musicUrl,
          themeJson: JSON.stringify(invitation.theme),
          createdAt: invitation.audit.createdAt,
          createdBy: invitation.audit.createdBy,
          updatedAt: invitation.audit.updatedAt,
          updatedBy: invitation.audit.updatedBy,
          deletedAt: invitation.audit.deletedAt,
          deletedBy: invitation.audit.deletedBy,
        },
        update: {
          slug: invitation.slug,
          title: invitation.title,
          description: invitation.description,
          language: invitation.language,
          status: invitation.status as string as never,
          visibility: invitation.visibility as string as never,
          passwordHash: invitation.passwordHash,
          expiresAt: invitation.expiresAt,
          galleryId: invitation.galleryId,
          coverMediaId: invitation.coverMediaId,
          musicUrl: invitation.musicUrl,
          themeJson: JSON.stringify(invitation.theme),
          updatedAt: invitation.audit.updatedAt,
          updatedBy: invitation.audit.updatedBy,
          deletedAt: invitation.audit.deletedAt,
          deletedBy: invitation.audit.deletedBy,
        },
      });

      for (const s of invitation.sections) {
        await tx.invitationSectionModel.create({
          data: {
            id: s.id,
            invitationId: invitation.id,
            type: s.type,
            title: s.title,
            contentJson: JSON.stringify(s.content),
            orderIndex: s.orderIndex,
            isEnabled: s.isEnabled,
          },
        });
      }

      for (const g of invitation.guests) {
        await tx.invitationGuestModel.create({
          data: {
            id: g.id,
            invitationId: invitation.id,
            personId: g.personId,
            displayName: g.displayName,
            email: g.email,
            phone: g.phone,
            maxCompanions: g.maxCompanions,
            rsvpStatus: g.rsvpStatus as string as never,
            confirmedCompanions: g.confirmedCompanions,
            dietaryRestrictions: g.dietaryRestrictions,
            guestNotes: g.guestNotes,
            companionsJson: g.companions.length > 0 ? JSON.stringify(g.companions) : null,
            confirmedAt: g.confirmedAt,
          },
        });
      }

      for (const sch of invitation.schedules) {
        await tx.invitationScheduleModel.create({
          data: {
            id: sch.id,
            invitationId: invitation.id,
            title: sch.title,
            description: sch.description,
            timeLabel: sch.timeLabel,
            locationLabel: sch.locationLabel,
            orderIndex: sch.orderIndex,
          },
        });
      }
    });

    return (await this.findById(invitation.id))!;
  }

  async findById(id: string): Promise<Invitation | null> {
    const raw = await this.prisma.invitationModel.findUnique({
      where: { id },
      include: { sections: true, guests: true, schedules: true },
    });
    if (!raw) return null;
    return this.toDomain(raw as PrismaInvitationWithRelations);
  }

  async findByCode(code: string): Promise<Invitation | null> {
    const raw = await this.prisma.invitationModel.findUnique({
      where: { code: code.toUpperCase() },
      include: { sections: true, guests: true, schedules: true },
    });
    if (!raw) return null;
    return this.toDomain(raw as PrismaInvitationWithRelations);
  }

  async findBySlug(slug: string): Promise<Invitation | null> {
    const raw = await this.prisma.invitationModel.findUnique({
      where: { slug: slug.toLowerCase() },
      include: { sections: true, guests: true, schedules: true },
    });
    if (!raw) return null;
    return this.toDomain(raw as PrismaInvitationWithRelations);
  }

  async findAll(filter: ListInvitationsFilter): Promise<PaginatedResult<Invitation>> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, Math.min(100, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const query = filter.search?.trim();
    const OR: Prisma.InvitationModelWhereInput[] = query
      ? [
          { code: { contains: query, mode: 'insensitive' } },
          { title: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
        ]
      : [];

    const where: Prisma.InvitationModelWhereInput = {
      ...(filter.includeDeleted ? {} : { deletedAt: null }),
      ...(filter.eventId ? { eventId: filter.eventId } : {}),
      ...(filter.status ? { status: filter.status as never } : {}),
      ...(OR.length > 0 ? { OR } : {}),
    };

    const total = await this.prisma.invitationModel.count({ where });
    const records = await this.prisma.invitationModel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { sections: true, guests: true, schedules: true },
    });

    return {
      data: (records as PrismaInvitationWithRelations[]).map((r) => this.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async nextCode(): Promise<string> {
    return this.sequenceGenerator.nextCode('INV');
  }

  private toDomain(raw: PrismaInvitationWithRelations): Invitation {
    const sections = raw.sections.map(
      (s: PrismaSection) =>
        new InvitationSection({
          id: s.id,
          type: s.type,
          title: s.title,
          content: s.contentJson ? (JSON.parse(s.contentJson) as Record<string, unknown>) : {},
          orderIndex: s.orderIndex,
          isEnabled: s.isEnabled,
        }),
    );

    const guests = raw.guests.map(
      (g: PrismaGuest) =>
        new InvitationGuest({
          id: g.id,
          personId: g.personId,
          displayName: g.displayName,
          email: g.email,
          phone: g.phone,
          maxCompanions: g.maxCompanions,
          rsvpStatus: g.rsvpStatus as unknown as RSVPStatus,
          confirmedCompanions: g.confirmedCompanions,
          dietaryRestrictions: g.dietaryRestrictions,
          guestNotes: g.guestNotes,
          companions: g.companionsJson ? (JSON.parse(g.companionsJson) as string[]) : [],
          confirmedAt: g.confirmedAt,
        }),
    );

    const schedules = raw.schedules.map(
      (sch: PrismaSchedule) =>
        new InvitationSchedule({
          id: sch.id,
          title: sch.title,
          description: sch.description,
          timeLabel: sch.timeLabel,
          locationLabel: sch.locationLabel,
          orderIndex: sch.orderIndex,
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

    return new Invitation({
      id: raw.id,
      code: raw.code,
      eventId: raw.eventId,
      slug: raw.slug,
      title: raw.title,
      description: raw.description,
      language: raw.language,
      status: raw.status as unknown as InvitationStatus,
      visibility: raw.visibility as unknown as InvitationVisibility,
      passwordHash: raw.passwordHash,
      expiresAt: raw.expiresAt,
      galleryId: raw.galleryId,
      coverMediaId: raw.coverMediaId,
      musicUrl: raw.musicUrl,
      theme: raw.themeJson ? (JSON.parse(raw.themeJson) as Record<string, unknown>) : {},
      sections,
      guests,
      schedules,
      audit,
    });
  }
}
