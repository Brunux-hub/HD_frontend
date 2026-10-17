import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVaccinationDto, UpdateVaccinationDto } from './dto/vaccination.dto';

@Injectable()
export class VaccinationsService {
  constructor(private prisma: PrismaService) {}

  private mapVaccination(v: any) {
    if (!v) return null;
    let mh = v.medical_history;
    if (mh) {
      const s = mh.service ? { ...mh.service, price: Number(mh.service.price) } : null;
      const app = mh.appointment
        ? {
            ...mh.appointment,
            veterinarian: mh.appointment.veterinarian
              ? {
                  ...mh.appointment.veterinarian,
                  user_response: mh.appointment.veterinarian.user,
                }
              : null,
          }
        : null;
      mh = {
        ...mh,
        service: s,
        services: s,
        appointment: app,
      };
    }

    return {
      ...v,
      medical_history: mh,
    };
  }

  private get includeQuery() {
    return {
      vaccine: true,
      medical_history: {
        include: {
          service: true,
          appointment: {
            include: {
              receptionist: {
                include: {
                  user: {
                    select: { id_user: true, username: true, type: true },
                  },
                },
              },
              pet: {
                include: {
                  owner: true,
                },
              },
              veterinarian: {
                include: {
                  user: {
                    select: { id_user: true, username: true, type: true },
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  async findAll() {
    const list = await this.prisma.vaccination.findMany({
      include: this.includeQuery,
      orderBy: { application_date: 'desc' },
    });
    return list.map((v) => this.mapVaccination(v));
  }

  async findOne(id: number) {
    const v = await this.prisma.vaccination.findUnique({
      where: { id_vaccination: id },
      include: this.includeQuery,
    });
    if (!v) {
      throw new NotFoundException(`Vaccination record with ID ${id} not found`);
    }
    return this.mapVaccination(v);
  }

  async create(dto: CreateVaccinationDto) {
    await this.prisma.medicalHistory.findUniqueOrThrow({
      where: { id_medical_history: dto.id_medical_history },
    });
    await this.prisma.vaccine.findUniqueOrThrow({
      where: { id_vaccine: dto.id_vaccine },
    });

    const appDate = new Date(dto.application_date);
    const nextDate = dto.next_application_date ? new Date(dto.next_application_date) : null;

    const created = await this.prisma.vaccination.create({
      data: {
        id_medical_history: dto.id_medical_history,
        id_vaccine: dto.id_vaccine,
        application_date: appDate,
        next_application_date: nextDate,
        observation: dto.observation || '',
      },
      include: this.includeQuery,
    });

    return this.mapVaccination(created);
  }

  async update(id: number, dto: UpdateVaccinationDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.id_medical_history !== undefined) data.id_medical_history = dto.id_medical_history;
    if (dto.id_vaccine !== undefined) data.id_vaccine = dto.id_vaccine;
    if (dto.application_date) data.application_date = new Date(dto.application_date);
    if (dto.next_application_date !== undefined) {
      data.next_application_date = dto.next_application_date ? new Date(dto.next_application_date) : null;
    }
    if (dto.observation !== undefined) data.observation = dto.observation;

    const updated = await this.prisma.vaccination.update({
      where: { id_vaccination: id },
      data,
      include: this.includeQuery,
    });

    return this.mapVaccination(updated);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.vaccination.delete({
      where: { id_vaccination: id },
    });
  }
}
