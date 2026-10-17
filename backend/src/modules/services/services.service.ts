import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  private mapService(service: any) {
    if (!service) return null;
    return {
      ...service,
      price: Number(service.price),
    };
  }

  async findAll() {
    const list = await this.prisma.service.findMany({
      orderBy: { id_service: 'asc' },
    });
    return list.map((s) => this.mapService(s));
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id_service: id },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return this.mapService(service);
  }

  async create(dto: CreateServiceDto) {
    const existing = await this.prisma.service.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Service '${dto.name}' already exists in catalog`);
    }

    const created = await this.prisma.service.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
      },
    });
    return this.mapService(created);
  }

  async update(id: number, dto: UpdateServiceDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.service.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id_service !== id) {
        throw new ConflictException(`Service name '${dto.name}' already exists`);
      }
    }

    const updated = await this.prisma.service.update({
      where: { id_service: id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
      },
    });
    return this.mapService(updated);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.service.delete({
      where: { id_service: id },
    });
  }
}
