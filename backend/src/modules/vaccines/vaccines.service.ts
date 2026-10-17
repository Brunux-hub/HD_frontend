import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVaccineDto, UpdateVaccineDto } from './dto/vaccine.dto';

@Injectable()
export class VaccinesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vaccine.findMany({
      orderBy: { id_vaccine: 'asc' },
    });
  }

  async findOne(id: number) {
    const vaccine = await this.prisma.vaccine.findUnique({
      where: { id_vaccine: id },
    });
    if (!vaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }
    return vaccine;
  }

  async create(dto: CreateVaccineDto) {
    const existing = await this.prisma.vaccine.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Vaccine '${dto.name}' already exists in catalog`);
    }

    return this.prisma.vaccine.create({
      data: {
        name: dto.name,
        description: dto.description,
        manufacturer: dto.manufacturer,
        required_dose: dto.required_dose,
      },
    });
  }

  async update(id: number, dto: UpdateVaccineDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.vaccine.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id_vaccine !== id) {
        throw new ConflictException(`Vaccine name '${dto.name}' is already used`);
      }
    }

    return this.prisma.vaccine.update({
      where: { id_vaccine: id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description && { description: dto.description }),
        ...(dto.manufacturer && { manufacturer: dto.manufacturer }),
        ...(dto.required_dose !== undefined && { required_dose: dto.required_dose }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.vaccine.delete({
      where: { id_vaccine: id },
    });
  }
}
