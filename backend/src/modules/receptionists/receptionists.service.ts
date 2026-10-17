import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReceptionistDto, UpdateReceptionistDto } from './dto/receptionist.dto';
import { StaffRole } from '@prisma/client';

@Injectable()
export class ReceptionistsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.receptionist.findMany({
      include: {
        user: {
          select: {
            id_user: true,
            username: true,
            type: true,
          },
        },
      },
      orderBy: { id_receptionist: 'asc' },
    });
  }

  async findOne(id: number) {
    const receptionist = await this.prisma.receptionist.findUnique({
      where: { id_receptionist: id },
      include: {
        user: {
          select: {
            id_user: true,
            username: true,
            type: true,
          },
        },
      },
    });
    if (!receptionist) {
      throw new NotFoundException(`Receptionist with ID ${id} not found`);
    }
    return receptionist;
  }

  async create(dto: CreateReceptionistDto) {
    const existing = await this.prisma.receptionist.findUnique({
      where: { id_user: dto.id_user },
    });
    if (existing) {
      throw new ConflictException(`User ID ${dto.id_user} is already assigned to a receptionist`);
    }

    // Automatically update the user's role to RECEPTIONIST
    await this.prisma.user.update({
      where: { id_user: dto.id_user },
      data: { role: StaffRole.RECEPTIONIST },
    });

    return this.prisma.receptionist.create({
      data: {
        id_user: dto.id_user,
        names: dto.names,
        last_names: dto.last_names,
        email: dto.email,
        phone_number: dto.phone_number,
      },
      include: {
        user: {
          select: {
            id_user: true,
            username: true,
            type: true,
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateReceptionistDto) {
    await this.findOne(id);

    return this.prisma.receptionist.update({
      where: { id_receptionist: id },
      data: {
        ...(dto.id_user !== undefined && { id_user: dto.id_user }),
        ...(dto.names && { names: dto.names }),
        ...(dto.last_names && { last_names: dto.last_names }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phone_number && { phone_number: dto.phone_number }),
      },
      include: {
        user: {
          select: {
            id_user: true,
            username: true,
            type: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.receptionist.delete({
      where: { id_receptionist: id },
    });
  }
}
