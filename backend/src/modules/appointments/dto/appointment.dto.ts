import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, description: 'ID of booking receptionist' })
  @IsNumber()
  @IsNotEmpty()
  id_receptionist: number;

  @ApiProperty({ example: 1, description: 'ID of patient pet' })
  @IsNumber()
  @IsNotEmpty()
  id_pet: number;

  @ApiProperty({ example: 1, description: 'ID of attending veterinarian' })
  @IsNumber()
  @IsNotEmpty()
  id_veterinarian: number;

  @ApiProperty({ example: '2026-10-25T15:00:00', description: 'Scheduled date and time ISO' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @IsNumber()
  @Min(5)
  time_minutes: number;

  @ApiProperty({ example: 'Annual routine checkup', description: 'Consultation reason' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ example: 'Check right ear', description: 'Reception notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ enum: AppointmentStatus, default: AppointmentStatus.OPENED })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}

export class UpdateAppointmentDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_receptionist?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_pet?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_veterinarian?: number;

  @ApiProperty({ example: '2026-10-25T15:00:00', required: false })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 30, required: false })
  @IsNumber()
  @Min(5)
  @IsOptional()
  time_minutes?: number;

  @ApiProperty({ example: 'Annual routine checkup', required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ example: 'Check right ear', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ enum: AppointmentStatus, required: false })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
