import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientRegisterDto {
  @ApiProperty({ example: 'juanperez', description: 'Unique username for login' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'secret123', description: 'Account password (min 4 characters)' })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ example: '72819203', description: 'National identity document (DNI)' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: 'Juan', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  names: string;

  @ApiProperty({ example: 'Perez Gomez', description: 'Last names' })
  @IsString()
  @IsNotEmpty()
  last_names: string;

  @ApiProperty({ example: 'juan.perez@gmail.com', description: 'Contact email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+51 987654321', description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ example: 'Av. Larco 456, Miraflores', description: 'Home address' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
