import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVeterinarianDto {
  @ApiProperty({ example: 2, description: 'User account ID for login' })
  @IsNumber()
  @IsNotEmpty()
  id_user: number;

  @ApiProperty({ example: 'Alejandro', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  names: string;

  @ApiProperty({ example: 'Martinez Ruiz', description: 'Last names' })
  @IsString()
  @IsNotEmpty()
  last_names: string;

  @ApiProperty({ example: 'CMVP-10293', description: 'Medical license registration number' })
  @IsString()
  @IsNotEmpty()
  number_license: string;

  @ApiProperty({ example: 'General Medicine', description: 'Medical specialty' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ example: 'alejandro.martinez@healthypets.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+51 912345678', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

export class UpdateVeterinarianDto {
  @ApiProperty({ example: 2, required: false })
  @IsNumber()
  @IsOptional()
  id_user?: number;

  @ApiProperty({ example: 'Alejandro', required: false })
  @IsString()
  @IsOptional()
  names?: string;

  @ApiProperty({ example: 'Martinez Ruiz', required: false })
  @IsString()
  @IsOptional()
  last_names?: string;

  @ApiProperty({ example: 'CMVP-10293', required: false })
  @IsString()
  @IsOptional()
  number_license?: string;

  @ApiProperty({ example: 'Surgery', required: false })
  @IsString()
  @IsOptional()
  specialty?: string;

  @ApiProperty({ example: 'alejandro.martinez@healthypets.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+51 912345678', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;
}
