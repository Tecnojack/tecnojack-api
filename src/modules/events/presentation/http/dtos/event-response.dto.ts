import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EventLifecycleStatus,
  EventProductionPhase,
  EventDateStatus,
  EventPriority,
  EventSessionType,
  EventSessionStatus,
} from '../../../domain/enums/events.enums.js';
import type { Event } from '../../../domain/entities/event.entity.js';

export class EventSessionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() eventId!: string;
  @ApiPropertyOptional() locationId?: string | null;
  @ApiProperty({ enum: EventSessionType }) type!: EventSessionType;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty({ enum: EventSessionStatus }) status!: EventSessionStatus;
  @ApiProperty({ enum: EventDateStatus }) dateStatus!: EventDateStatus;
  @ApiPropertyOptional() startAt?: Date | null;
  @ApiPropertyOptional() endAt?: Date | null;
  @ApiPropertyOptional() timezone?: string | null;
  @ApiProperty() allDay!: boolean;
  @ApiProperty() sortOrder!: number;
  @ApiPropertyOptional() notes?: string | null;
}

export class EventResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() slug?: string | null;
  @ApiProperty() eventTypeId!: string;
  @ApiProperty({ enum: EventLifecycleStatus }) lifecycleStatus!: EventLifecycleStatus;
  @ApiProperty({ enum: EventProductionPhase }) productionPhase!: EventProductionPhase;
  @ApiProperty({ enum: EventDateStatus }) dateStatus!: EventDateStatus;
  @ApiProperty({ enum: EventPriority }) priority!: EventPriority;
  @ApiPropertyOptional() ownerUserId?: string | null;
  @ApiProperty() timezone!: string;
  @ApiPropertyOptional() estimatedStartAt?: Date | null;
  @ApiPropertyOptional() estimatedEndAt?: Date | null;
  @ApiPropertyOptional() confirmedStartAt?: Date | null;
  @ApiPropertyOptional() confirmedEndAt?: Date | null;
  @ApiPropertyOptional() briefSummary?: string | null;
  @ApiPropertyOptional() cancellationReason?: string | null;
  @ApiPropertyOptional() cancelledAt?: Date | null;
  @ApiPropertyOptional() completedAt?: Date | null;
  @ApiPropertyOptional() closedAt?: Date | null;
  @ApiPropertyOptional() archivedAt?: Date | null;
  @ApiProperty({ type: [EventSessionResponseDto] }) sessions!: EventSessionResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiPropertyOptional() createdBy?: string | null;
  @ApiProperty() updatedAt!: Date;
  @ApiPropertyOptional() updatedBy?: string | null;
  @ApiPropertyOptional() deletedAt?: Date | null;

  static fromDomain(event: Event): EventResponseDto {
    const dto = new EventResponseDto();
    dto.id = event.id;
    dto.code = event.code;
    dto.name = event.name;
    dto.slug = event.slug;
    dto.eventTypeId = event.eventTypeId;
    dto.lifecycleStatus = event.lifecycleStatus;
    dto.productionPhase = event.productionPhase;
    dto.dateStatus = event.dateStatus;
    dto.priority = event.priority;
    dto.ownerUserId = event.ownerUserId;
    dto.timezone = event.timezone;
    dto.estimatedStartAt = event.estimatedStartAt;
    dto.estimatedEndAt = event.estimatedEndAt;
    dto.confirmedStartAt = event.confirmedStartAt;
    dto.confirmedEndAt = event.confirmedEndAt;
    dto.briefSummary = event.brief.summary;
    dto.cancellationReason = event.cancellationReason;
    dto.cancelledAt = event.cancelledAt;
    dto.completedAt = event.completedAt;
    dto.closedAt = event.closedAt;
    dto.archivedAt = event.archivedAt;
    dto.sessions = event.sessions.map((s) => ({
      id: s.id,
      eventId: s.eventId,
      locationId: s.locationId,
      type: s.type,
      name: s.name,
      description: s.description,
      status: s.status,
      dateStatus: s.dateStatus,
      startAt: s.startAt,
      endAt: s.endAt,
      timezone: s.timezone,
      allDay: s.allDay,
      sortOrder: s.sortOrder,
      notes: s.notes,
    }));
    dto.createdAt = event.audit.createdAt;
    dto.createdBy = event.audit.createdBy;
    dto.updatedAt = event.audit.updatedAt;
    dto.updatedBy = event.audit.updatedBy;
    dto.deletedAt = event.audit.deletedAt;
    return dto;
  }
}
