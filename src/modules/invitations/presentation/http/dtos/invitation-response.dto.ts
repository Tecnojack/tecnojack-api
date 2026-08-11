import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvitationStatus, InvitationVisibility, RSVPStatus } from '../../../domain/enums/invitations.enums.js';
import type { Invitation } from '../../../domain/entities/invitation.entity.js';

export class SectionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() type!: string;
  @ApiProperty() title!: string;
  @ApiProperty() content!: Record<string, unknown>;
  @ApiProperty() orderIndex!: number;
  @ApiProperty() isEnabled!: boolean;
}

export class GuestResponseDto {
  @ApiProperty() id!: string;
  @ApiPropertyOptional() personId?: string | null;
  @ApiProperty() displayName!: string;
  @ApiPropertyOptional() email?: string | null;
  @ApiPropertyOptional() phone?: string | null;
  @ApiProperty() maxCompanions!: number;
  @ApiProperty({ enum: RSVPStatus }) rsvpStatus!: RSVPStatus;
  @ApiProperty() confirmedCompanions!: number;
  @ApiPropertyOptional() dietaryRestrictions?: string | null;
  @ApiPropertyOptional() guestNotes?: string | null;
  @ApiProperty({ type: [String] }) companions!: string[];
  @ApiPropertyOptional() confirmedAt?: Date | null;
}

export class ScheduleResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() timeLabel!: string;
  @ApiPropertyOptional() locationLabel?: string | null;
  @ApiProperty() orderIndex!: number;
}

export class InvitationResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() eventId!: string;
  @ApiProperty() slug!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() language!: string;
  @ApiProperty({ enum: InvitationStatus }) status!: InvitationStatus;
  @ApiProperty({ enum: InvitationVisibility }) visibility!: InvitationVisibility;
  @ApiPropertyOptional() expiresAt?: Date | null;
  @ApiPropertyOptional() galleryId?: string | null;
  @ApiPropertyOptional() coverMediaId?: string | null;
  @ApiPropertyOptional() musicUrl?: string | null;
  @ApiProperty() theme!: Record<string, unknown>;
  @ApiProperty({ type: [SectionResponseDto] }) sections!: SectionResponseDto[];
  @ApiProperty({ type: [GuestResponseDto] }) guests!: GuestResponseDto[];
  @ApiProperty({ type: [ScheduleResponseDto] }) schedules!: ScheduleResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() deletedAt?: Date | null;

  static fromDomain(invitation: Invitation): InvitationResponseDto {
    const dto = new InvitationResponseDto();
    dto.id = invitation.id;
    dto.code = invitation.code;
    dto.eventId = invitation.eventId;
    dto.slug = invitation.slug;
    dto.title = invitation.title;
    dto.description = invitation.description;
    dto.language = invitation.language;
    dto.status = invitation.status;
    dto.visibility = invitation.visibility;
    dto.expiresAt = invitation.expiresAt;
    dto.galleryId = invitation.galleryId;
    dto.coverMediaId = invitation.coverMediaId;
    dto.musicUrl = invitation.musicUrl;
    dto.theme = invitation.theme;
    dto.sections = invitation.sections.map((s) => ({
      id: s.id,
      type: s.type,
      title: s.title,
      content: s.content,
      orderIndex: s.orderIndex,
      isEnabled: s.isEnabled,
    }));
    dto.guests = invitation.guests.map((g) => ({
      id: g.id,
      personId: g.personId,
      displayName: g.displayName,
      email: g.email,
      phone: g.phone,
      maxCompanions: g.maxCompanions,
      rsvpStatus: g.rsvpStatus,
      confirmedCompanions: g.confirmedCompanions,
      dietaryRestrictions: g.dietaryRestrictions,
      guestNotes: g.guestNotes,
      companions: g.companions as string[],
      confirmedAt: g.confirmedAt,
    }));
    dto.schedules = invitation.schedules.map((sch) => ({
      id: sch.id,
      title: sch.title,
      description: sch.description,
      timeLabel: sch.timeLabel,
      locationLabel: sch.locationLabel,
      orderIndex: sch.orderIndex,
    }));
    dto.createdAt = invitation.audit.createdAt;
    dto.deletedAt = invitation.audit.deletedAt;
    return dto;
  }
}
