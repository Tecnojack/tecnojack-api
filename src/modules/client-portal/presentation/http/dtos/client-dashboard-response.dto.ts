import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientEventSummaryDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() slug?: string | null;
  @ApiProperty() lifecycleStatus!: string;
  @ApiProperty() productionPhase!: string;
  @ApiProperty() dateStatus!: string;
  @ApiProperty() priority!: string;
  @ApiProperty() timezone!: string;
  @ApiPropertyOptional() estimatedStartAt?: Date | null;
  @ApiPropertyOptional() estimatedEndAt?: Date | null;
  @ApiPropertyOptional() confirmedStartAt?: Date | null;
  @ApiPropertyOptional() confirmedEndAt?: Date | null;
  @ApiPropertyOptional() briefSummary?: string | null;
  @ApiPropertyOptional() completedAt?: Date | null;
}

export class ClientParticipantSummaryDto {
  @ApiProperty() id!: string;
  @ApiProperty() displayName!: string;
  @ApiProperty() role!: string;
  @ApiPropertyOptional() email?: string | null;
  @ApiPropertyOptional() phone?: string | null;
}

export class ClientGallerySummaryDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() slug?: string | null;
  @ApiPropertyOptional() description?: string | null;
  @ApiPropertyOptional() coverMediaAssetId?: string | null;
  @ApiProperty() allowDownload!: boolean;
  @ApiProperty() allowFavorites!: boolean;
  @ApiProperty() allowComments!: boolean;
  @ApiPropertyOptional() publishedAt?: Date | null;
  @ApiProperty() albumCount!: number;
  @ApiProperty() assetCount!: number;
}

export class ClientDeliverableItemDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() quantity!: number;
  @ApiProperty() isCompleted!: boolean;
}

export class ClientDeliverableSummaryDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() description?: string | null;
  @ApiProperty() type!: string;
  @ApiProperty() status!: string;
  @ApiProperty() deliveryMethod!: string;
  @ApiPropertyOptional() estimatedDeliveryAt?: Date | null;
  @ApiPropertyOptional() deliveredAt?: Date | null;
  @ApiPropertyOptional() trackingNumber?: string | null;
  @ApiPropertyOptional() deliveryNotes?: string | null;
  @ApiProperty({ type: [ClientDeliverableItemDto] }) items!: ClientDeliverableItemDto[];
}

export class ClientTimelineItemDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiProperty() type!: string;
  @ApiProperty() status!: string;
  @ApiPropertyOptional() date?: Date | null;
  @ApiPropertyOptional() description?: string | null;
}

export class ClientNextActionDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiProperty() description!: string;
  @ApiProperty() category!: string;
  @ApiPropertyOptional() actionUrl?: string;
}

export class ClientDashboardResponseDto {
  @ApiProperty({ type: ClientEventSummaryDto }) event!: ClientEventSummaryDto;
  @ApiProperty({ description: 'Percentage of overall project progress (0-100)' }) progressPercentage!: number;
  @ApiProperty({ type: [ClientParticipantSummaryDto] }) participants!: ClientParticipantSummaryDto[];
  @ApiProperty({ type: [ClientGallerySummaryDto] }) publishedGalleries!: ClientGallerySummaryDto[];
  @ApiProperty({ type: [ClientDeliverableSummaryDto] }) deliverables!: ClientDeliverableSummaryDto[];
  @ApiProperty({ type: [ClientTimelineItemDto] }) timeline!: ClientTimelineItemDto[];
  @ApiProperty({ type: [ClientNextActionDto] }) nextActions!: ClientNextActionDto[];
}
