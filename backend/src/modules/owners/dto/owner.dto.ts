import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOwnerDto {
  @ApiProperty({ example: '72849102', description: 'National ID document' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: 'Carlos', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  names: string;

  @ApiProperty({ example: 'Mendoza Vargas', description: 'Last names' })
  @IsString()
  @IsNotEmpty()
  last_names: string;

  @ApiProperty({ example: 'carlos.mendoza@gmail.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+51 998877665', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ example: 'Av. Primavera 452, Santiago de Surco', description: 'Home address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 5, required: false, description: 'Optional user account ID' })
  @IsOptional()
  id_user?: number;
}

export class UpdateOwnerDto {
  @ApiProperty({ example: '72849102', required: false })
  @IsString()
  @IsOptional()
  dni?: string;

  @ApiProperty({ example: 'Carlos', required: false })
  @IsString()
  @IsOptional()
  names?: string;

  @ApiProperty({ example: 'Mendoza Vargas', required: false })
  @IsString()
  @IsOptional()
  last_names?: string;

  @ApiProperty({ example: 'carlos.mendoza@gmail.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+51 998877665', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: 'Av. Primavera 452, Santiago de Surco', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  id_user?: number;
}
