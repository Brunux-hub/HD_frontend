import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType, StaffRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'newworker', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ enum: UserType, default: UserType.WORKER, description: 'User level (ADMIN | WORKER)' })
  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @ApiProperty({ enum: StaffRole, default: StaffRole.CLIENT, description: 'Role (ADMIN | VETERINARIAN | RECEPTIONIST | CLIENT | WORKER)' })
  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole;
}
