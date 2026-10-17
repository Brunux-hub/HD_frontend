import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVeterinarianDto, UpdateVeterinarianDto } from './dto/veterinarian.dto';
import { StaffRole } from '@prisma/client';

@Injectable()
export class VeterinariansService {
  constructor(private prisma: PrismaService) {}

  private mapVet(vet: any) {
    if (!vet) return null;
    return {
      ...vet,
      user_response: vet.user,
    };
  }

  async findAll() {
    const list = await this.prisma.veterinarian.findMany({
      include: {
        user: {
          select: {
            id_user: true,
            username: true,
            type: true,
          },
        },
      },
      orderBy: { id_veterinarian: 'asc' },
    });
    return list.map((v) => this.mapVet(v));
  }

  async findOne(id: number) {
    const vet = await this.prisma.veterinarian.findUnique({
      where: { id_veterinarian: id },
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
    if (!vet) {
      throw new NotFoundException(`Veterinarian with ID ${id} not found`);
    }
    return this.mapVet(vet);
  }

  async create(dto: CreateVeterinarianDto) {
    const existingUser = await this.prisma.veterinarian.findUnique({
      where: { id_user: dto.id_user },
    });
    if (existingUser) {
      throw new ConflictException(`User ID ${dto.id_user} is already assigned to a veterinarian`);
    }

    const existingLicense = await this.prisma.veterinarian.findUnique({
      where: { number_license: dto.number_license },
    });
    if (existingLicense) {
      throw new ConflictException(`License number '${dto.number_license}' is already registered`);
    }

    // Automatically update the user's role to VETERINARIAN
    await this.prisma.user.update({
      where: { id_user: dto.id_user },
      data: { role: StaffRole.VETERINARIAN },
    });

    const created = await this.prisma.veterinarian.create({
      data: {
        id_user: dto.id_user,
        names: dto.names,
        last_names: dto.last_names,
        number_license: dto.number_license,
        specialty: dto.specialty,
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

    return this.mapVet(created);
  }

  async update(id: number, dto: UpdateVeterinarianDto) {
    await this.findOne(id);

    if (dto.number_license) {
      const existingLicense = await this.prisma.veterinarian.findUnique({
        where: { number_license: dto.number_license },
      });
      if (existingLicense && existingLicense.id_veterinarian !== id) {
        throw new ConflictException(`License number '${dto.number_license}' is used by another veterinarian`);
      }
    }

    const updated = await this.prisma.veterinarian.update({
      where: { id_veterinarian: id },
      data: {
        ...(dto.id_user !== undefined && { id_user: dto.id_user }),
        ...(dto.names && { names: dto.names }),
        ...(dto.last_names && { last_names: dto.last_names }),
        ...(dto.number_license && { number_license: dto.number_license }),
        ...(dto.specialty && { specialty: dto.specialty }),
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

    return this.mapVet(updated);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.veterinarian.delete({
      where: { id_veterinarian: id },
    });
  }
}
