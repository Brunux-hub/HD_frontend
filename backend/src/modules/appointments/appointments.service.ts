import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  private mapAppointment(app: any) {
    if (!app) return null;
    return {
      ...app,
      veterinarian: app.veterinarian
        ? {
            ...app.veterinarian,
            user_response: app.veterinarian.user,
          }
        : null,
    };
  }

  private get includeQuery() {
    return {
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
    };
  }

  async findAll() {
    const list = await this.prisma.appointment.findMany({
      include: this.includeQuery,
      orderBy: { date: 'desc' },
    });
    return list.map((a) => this.mapAppointment(a));
  }

  async findByStatus(status: AppointmentStatus) {
    const list = await this.prisma.appointment.findMany({
      where: { status },
      include: this.includeQuery,
      orderBy: { date: 'desc' },
    });
    return list.map((a) => this.mapAppointment(a));
  }

  async findOne(id: number) {
    const app = await this.prisma.appointment.findUnique({
      where: { id_appointment: id },
      include: this.includeQuery,
    });
    if (!app) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return this.mapAppointment(app);
  }

  async create(dto: CreateAppointmentDto) {
    // Validate relations
    await this.prisma.receptionist.findUniqueOrThrow({
      where: { id_receptionist: dto.id_receptionist },
    });
    await this.prisma.pet.findUniqueOrThrow({
      where: { id_pet: dto.id_pet },
    });
    await this.prisma.veterinarian.findUniqueOrThrow({
      where: { id_veterinarian: dto.id_veterinarian },
    });

    const date = new Date(dto.date);

    const created = await this.prisma.appointment.create({
      data: {
        id_receptionist: dto.id_receptionist,
        id_pet: dto.id_pet,
        id_veterinarian: dto.id_veterinarian,
        date,
        time_minutes: dto.time_minutes,
        reason: dto.reason,
        notes: dto.notes || '',
        status: dto.status || AppointmentStatus.OPENED,
      },
      include: this.includeQuery,
    });

    return this.mapAppointment(created);
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.id_receptionist !== undefined) data.id_receptionist = dto.id_receptionist;
    if (dto.id_pet !== undefined) data.id_pet = dto.id_pet;
    if (dto.id_veterinarian !== undefined) data.id_veterinarian = dto.id_veterinarian;
    if (dto.date) data.date = new Date(dto.date);
    if (dto.time_minutes !== undefined) data.time_minutes = dto.time_minutes;
    if (dto.reason) data.reason = dto.reason;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.status) data.status = dto.status;

    const updated = await this.prisma.appointment.update({
      where: { id_appointment: id },
      data,
      include: this.includeQuery,
    });

    return this.mapAppointment(updated);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.appointment.delete({
      where: { id_appointment: id },
    });
  }
}
