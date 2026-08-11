import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliverableType, DeliveryMethod } from '../../../domain/enums/deliverables.enums.js';

export class UpdateDeliverableDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: DeliverableType }) @IsOptional() @IsEnum(DeliverableType) type?: DeliverableType;
  @ApiPropertyOptional({ enum: DeliveryMethod }) @IsOptional() @IsEnum(DeliveryMethod) deliveryMethod?: DeliveryMethod;
  @ApiPropertyOptional() @IsOptional() @IsUUID() recipientPersonId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() targetGalleryId?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Date) estimatedDeliveryAt?: Date;
  @ApiPropertyOptional() @IsOptional() @IsString() trackingNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deliveryNotes?: string;
}
