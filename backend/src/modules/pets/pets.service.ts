import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pet.findMany({
      include: {
        owner: true,
      },
      orderBy: { id_pet: 'asc' },
    });
  }

  async findOne(id: number) {
    const pet = await this.prisma.pet.findUnique({
      where: { id_pet: id },
      include: {
        owner: true,
      },
    });
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  async findByOwner(idOwner: number) {
    return this.prisma.pet.findMany({
      where: { id_owner: idOwner },
      include: {
        owner: true,
      },
      orderBy: { id_pet: 'asc' },
    });
  }

  async create(dto: CreatePetDto) {
    // Verify owner exists
    await this.prisma.owner.findUniqueOrThrow({
      where: { id_owner: dto.id_owner },
    });

    const gender = dto.sex || dto.pet_gender || 'MALE';
    const birthdate = new Date(dto.birthdate);

    return this.prisma.pet.create({
      data: {
        id_owner: dto.id_owner,
        name: dto.name,
        species: dto.species,
        race: dto.race,
        birthdate,
        pet_gender: gender,
        weight: dto.weight,
      },
      include: {
        owner: true,
      },
    });
  }

  async update(id: number, dto: UpdatePetDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.id_owner !== undefined) data.id_owner = dto.id_owner;
    if (dto.name) data.name = dto.name;
    if (dto.species) data.species = dto.species;
    if (dto.race) data.race = dto.race;
    if (dto.birthdate) data.birthdate = new Date(dto.birthdate);
    if (dto.sex || dto.pet_gender) data.pet_gender = dto.sex || dto.pet_gender;
    if (dto.weight) data.weight = dto.weight;

    return this.prisma.pet.update({
      where: { id_pet: id },
      data,
      include: {
        owner: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.pet.delete({
      where: { id_pet: id },
    });
  }
}
