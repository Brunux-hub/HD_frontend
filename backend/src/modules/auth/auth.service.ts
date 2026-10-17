import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ClientRegisterDto } from './dto/client-register.dto';
import { RegisterDto } from './dto/register.dto';
import { StaffRole, UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id_user,
      id_user: user.id_user,
      username: user.username,
      role: user.role,
      type: user.type,
      // Supabase RLS compatibility custom claims
      app_metadata: {
        role: user.role,
      },
    };

    const token = this.jwtService.sign(payload);

    return { token };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: userId },
      select: {
        id_user: true,
        username: true,
        role: true,
        type: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return {
      username: user.username,
      role: user.role,
    };
  }

  async registerClient(dto: ClientRegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUser) {
      throw new ConflictException(`Username '${dto.username}' is already in use`);
    }

    const existingDni = await this.prisma.owner.findUnique({
      where: { dni: dto.dni },
    });
    if (existingDni) {
      throw new ConflictException(`DNI '${dto.dni}' is already registered`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: dto.username,
          password: hashedPassword,
          type: UserType.WORKER,
          role: StaffRole.CLIENT,
        },
      });

      const owner = await tx.owner.create({
        data: {
          id_user: user.id_user,
          dni: dto.dni,
          names: dto.names,
          last_names: dto.last_names,
          email: dto.email,
          phone_number: dto.phone_number,
          address: dto.address,
        },
      });

      return owner;
    });
  }

  async registerUser(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUser) {
      throw new ConflictException(`Username '${dto.username}' already exists`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        type: dto.type || UserType.WORKER,
        role: dto.role || StaffRole.WORKER,
      },
      select: {
        id_user: true,
        username: true,
        type: true,
        role: true,
        created_at: true,
      },
    });

    return user;
  }
}
