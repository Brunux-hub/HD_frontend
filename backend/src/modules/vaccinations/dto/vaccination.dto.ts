import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVaccinationDto {
  @ApiProperty({ example: 1, description: 'Medical history consultation ID' })
  @IsNumber()
  @IsNotEmpty()
  id_medical_history: number;

  @ApiProperty({ example: 1, description: 'Vaccine biological ID' })
  @IsNumber()
  @IsNotEmpty()
  id_vaccine: number;

  @ApiProperty({ example: '2026-10-10T10:30:00', description: 'Application date ISO' })
  @IsString()
  @IsNotEmpty()
  application_date: string;

  @ApiProperty({ example: '2027-10-10T10:30:00', description: 'Next booster date ISO', required: false })
  @IsString()
  @IsOptional()
  next_application_date?: string;

  @ApiProperty({ example: 'Normal tolerance, subcutaneous', description: 'Clinical observations', required: false })
  @IsString()
  @IsOptional()
  observation?: string;
}

export class UpdateVaccinationDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_medical_history?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_vaccine?: number;

  @ApiProperty({ example: '2026-10-10T10:30:00', required: false })
  @IsString()
  @IsOptional()
  application_date?: string;

  @ApiProperty({ example: '2027-10-10T10:30:00', required: false })
  @IsString()
  @IsOptional()
  next_application_date?: string;

  @ApiProperty({ example: 'Normal tolerance, subcutaneous', required: false })
  @IsString()
  @IsOptional()
  observation?: string;
}
