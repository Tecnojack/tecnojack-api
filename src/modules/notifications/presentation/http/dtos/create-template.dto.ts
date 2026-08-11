import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsArray,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ example: 'TEMP-000001' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'Template de Bienvenida' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'ONBOARDING' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 'es' })
  @IsString()
  @IsNotEmpty()
  language!: string;

  @ApiPropertyOptional({ example: 'Bienvenido {{name}}' })
  @IsOptional()
  @IsString()
  subjectLayout?: string;

  @ApiProperty({ example: 'Hola {{name}}, bienvenido a la plataforma.' })
  @IsString()
  @IsNotEmpty()
  bodyLayout!: string;

  @ApiPropertyOptional({ example: ['name'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];
}
