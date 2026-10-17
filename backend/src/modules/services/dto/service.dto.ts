import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'General Consultation', description: 'Service name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Complete clinical evaluation and vital signs', description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 45.0, description: 'Price in local currency' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateServiceDto {
  @ApiProperty({ example: 'General Consultation', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 50.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}
