import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalHistoryDto {
  @ApiProperty({ example: 1, description: 'ID of completed appointment' })
  @IsNumber()
  @IsNotEmpty()
  id_appointment: number;

  @ApiProperty({ example: 1, description: 'ID of veterinary service performed' })
  @IsNumber()
  @IsNotEmpty()
  id_service: number;

  @ApiProperty({ example: 'Patient presented healthy. Normal vital signs.', description: 'Clinical assessment notes' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-10-10T10:30:00', description: 'Consultation date and time ISO' })
  @IsString()
  @IsNotEmpty()
  date: string;
}

export class UpdateMedicalHistoryDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_appointment?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_service?: number;

  @ApiProperty({ example: 'Patient presented healthy. Normal vital signs.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-10-10T10:30:00', required: false })
  @IsString()
  @IsOptional()
  date?: string;
}
