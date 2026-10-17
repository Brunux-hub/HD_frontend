import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVaccineDto {
  @ApiProperty({ example: 'Rabies Rabisin', description: 'Vaccine name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Inactivated rabies virus vaccine for dogs and cats', description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Boehringer Ingelheim', description: 'Pharmaceutical manufacturer' })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiProperty({ example: 1, description: 'Required doses in protocol' })
  @IsNumber()
  @Min(1)
  required_dose: number;
}

export class UpdateVaccineDto {
  @ApiProperty({ example: 'Rabies Rabisin', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Inactivated rabies virus vaccine for dogs and cats', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Boehringer Ingelheim', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  required_dose?: number;
}
