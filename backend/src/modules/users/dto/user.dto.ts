import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType, StaffRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'staffuser', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ enum: UserType, default: UserType.WORKER, description: 'Type (ADMIN | WORKER)' })
  @IsEnum(UserType)
  @IsNotEmpty()
  type: UserType;

  @ApiProperty({ enum: StaffRole, default: StaffRole.WORKER, required: false })
  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'staffuser', description: 'Username', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'password123', description: 'User password', required: false })
  @IsString()
  @MinLength(4)
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: UserType, required: false })
  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @ApiProperty({ enum: StaffRole, required: false })
  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole;
}
