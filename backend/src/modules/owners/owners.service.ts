import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOwnerDto, UpdateOwnerDto } from './dto/owner.dto';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.owner.findMany({
      orderBy: { id_owner: 'asc' },
    });
  }

  async findOne(id: number) {
    const owner = await this.prisma.owner.findUnique({
      where: { id_owner: id },
    });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return owner;
  }

  async findByUserId(userId: number) {
    return this.prisma.owner.findUnique({
      where: { id_user: userId },
    });
  }

  async findByDni(dni: string) {
    return this.prisma.owner.findUnique({
      where: { dni },
    });
  }

  async create(dto: CreateOwnerDto) {
    const existing = await this.prisma.owner.findUnique({
      where: { dni: dto.dni },
    });
    if (existing) {
      throw new ConflictException(`Owner with DNI '${dto.dni}' already exists`);
    }

    return this.prisma.owner.create({
      data: {
        dni: dto.dni,
        names: dto.names,
        last_names: dto.last_names,
        email: dto.email,
        phone_number: dto.phone_number,
        address: dto.address,
        id_user: dto.id_user ?? null,
      },
    });
  }

  async update(id: number, dto: UpdateOwnerDto) {
    await this.findOne(id);

    if (dto.dni) {
      const existing = await this.prisma.owner.findUnique({
        where: { dni: dto.dni },
      });
      if (existing && existing.id_owner !== id) {
        throw new ConflictException(`DNI '${dto.dni}' is already used by another owner`);
      }
    }

    return this.prisma.owner.update({
      where: { id_owner: id },
      data: {
        ...(dto.dni && { dni: dto.dni }),
        ...(dto.names && { names: dto.names }),
        ...(dto.last_names && { last_names: dto.last_names }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phone_number && { phone_number: dto.phone_number }),
        ...(dto.address && { address: dto.address }),
        ...(dto.id_user !== undefined && { id_user: dto.id_user }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.owner.delete({
      where: { id_owner: id },
    });
  }
}
