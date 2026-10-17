import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReceptionistDto {
  @ApiProperty({ example: 4, description: 'User account ID for login' })
  @IsNumber()
  @IsNotEmpty()
  id_user: number;

  @ApiProperty({ example: 'Maria', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  names: string;

  @ApiProperty({ example: 'Solis Perez', description: 'Last names' })
  @IsString()
  @IsNotEmpty()
  last_names: string;

  @ApiProperty({ example: 'maria.solis@healthypets.com', description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+51 987654321', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

export class UpdateReceptionistDto {
  @ApiProperty({ example: 4, required: false })
  @IsNumber()
  @IsOptional()
  id_user?: number;

  @ApiProperty({ example: 'Maria', required: false })
  @IsString()
  @IsOptional()
  names?: string;

  @ApiProperty({ example: 'Solis Perez', required: false })
  @IsString()
  @IsOptional()
  last_names?: string;

  @ApiProperty({ example: 'maria.solis@healthypets.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+51 987654321', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;
}
