import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id_user: true,
        username: true,
        type: true,
        role: true,
      },
      orderBy: { id_user: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: id },
      select: {
        id_user: true,
        username: true,
        type: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing) {
      throw new ConflictException(`Username '${dto.username}' already exists`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        type: dto.type,
        role: dto.role || (dto.type === 'ADMIN' ? 'ADMIN' : 'WORKER'),
      },
      select: {
        id_user: true,
        username: true,
        type: true,
        role: true,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.username) data.username = dto.username;
    if (dto.type) data.type = dto.type;
    if (dto.role) data.role = dto.role;
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id_user: id },
      data,
      select: {
        id_user: true,
        username: true,
        type: true,
        role: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({
      where: { id_user: id },
    });
  }
}
