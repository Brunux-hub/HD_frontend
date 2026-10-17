import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PetGender } from '@prisma/client';

export class CreatePetDto {
  @ApiProperty({ example: 1, description: 'ID of pet owner' })
  @IsNumber()
  @IsNotEmpty()
  id_owner: number;

  @ApiProperty({ example: 'Max', description: 'Pet name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Canine', description: 'Animal species' })
  @IsString()
  @IsNotEmpty()
  species: string;

  @ApiProperty({ example: 'Golden Retriever', description: 'Breed / Race' })
  @IsString()
  @IsNotEmpty()
  race: string;

  @ApiProperty({ example: '2021-05-14', description: 'Birthdate (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  birthdate: string;

  // Frontend sends 'sex' in PetRequest
  @ApiProperty({ enum: PetGender, example: 'MALE', description: 'Pet gender (sent as sex in frontend)' })
  @IsEnum(PetGender)
  @IsOptional()
  sex?: PetGender;

  @ApiProperty({ enum: PetGender, required: false })
  @IsEnum(PetGender)
  @IsOptional()
  pet_gender?: PetGender;

  @ApiProperty({ example: '28.5 kg', description: 'Current weight' })
  @IsString()
  @IsNotEmpty()
  weight: string;
}

export class UpdatePetDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  id_owner?: number;

  @ApiProperty({ example: 'Max', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Canine', required: false })
  @IsString()
  @IsOptional()
  species?: string;

  @ApiProperty({ example: 'Golden Retriever', required: false })
  @IsString()
  @IsOptional()
  race?: string;

  @ApiProperty({ example: '2021-05-14', required: false })
  @IsString()
  @IsOptional()
  birthdate?: string;

  @ApiProperty({ enum: PetGender, required: false })
  @IsEnum(PetGender)
  @IsOptional()
  sex?: PetGender;

  @ApiProperty({ enum: PetGender, required: false })
  @IsEnum(PetGender)
  @IsOptional()
  pet_gender?: PetGender;

  @ApiProperty({ example: '29.0 kg', required: false })
  @IsString()
  @IsOptional()
  weight?: string;
}
