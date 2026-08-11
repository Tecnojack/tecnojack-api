import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliverableType, DeliveryMethod } from '../../../domain/enums/deliverables.enums.js';

export class CreateDeliverableDto {
  @ApiProperty({ description: 'Deliverable name', example: 'Álbum Físico Impreso 30x40' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Event UUID' })
  @IsUUID()
  eventId!: string;

  @ApiPropertyOptional({ enum: DeliverableType, default: DeliverableType.PHOTOS })
  @IsOptional()
  @IsEnum(DeliverableType)
  type?: DeliverableType;

  @ApiPropertyOptional({ enum: DeliveryMethod, default: DeliveryMethod.DIGITAL_DOWNLOAD })
  @IsOptional()
  @IsEnum(DeliveryMethod)
  deliveryMethod?: DeliveryMethod;

  @ApiPropertyOptional({ description: 'Recipient Person UUID' })
  @IsOptional()
  @IsUUID()
  recipientPersonId?: string;

  @ApiPropertyOptional({ description: 'Target Gallery UUID' })
  @IsOptional()
  @IsUUID()
  targetGalleryId?: string;

  @ApiPropertyOptional({ description: 'Estimated delivery date ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  estimatedDeliveryAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryNotes?: string;
}
