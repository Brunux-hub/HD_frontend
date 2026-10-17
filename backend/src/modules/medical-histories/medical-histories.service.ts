import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from './dto/medical-history.dto';

@Injectable()
export class MedicalHistoriesService {
  constructor(private prisma: PrismaService) {}

  private mapHistory(mh: any) {
    if (!mh) return null;
    const serviceFormatted = mh.service
      ? {
          ...mh.service,
          price: Number(mh.service.price),
        }
      : null;

    const appointmentFormatted = mh.appointment
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

    return {
      ...mh,
      services: serviceFormatted,
      service: serviceFormatted,
      appointment: appointmentFormatted,
    };
  }

  private get includeQuery() {
    return {
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
    };
  }

  async findAll() {
    const list = await this.prisma.medicalHistory.findMany({
      include: this.includeQuery,
      orderBy: { date: 'desc' },
    });
    return list.map((mh) => this.mapHistory(mh));
  }

  async findCompletedServices() {
    const list = await this.prisma.medicalHistory.findMany({
      where: {
        appointment: {
          status: 'CLOSED',
        },
      },
      include: this.includeQuery,
      orderBy: { date: 'desc' },
    });
    return list.map((mh) => this.mapHistory(mh));
  }

  async findOne(id: number) {
    const mh = await this.prisma.medicalHistory.findUnique({
      where: { id_medical_history: id },
      include: this.includeQuery,
    });
    if (!mh) {
      throw new NotFoundException(`Medical history with ID ${id} not found`);
    }
    return this.mapHistory(mh);
  }

  async create(dto: CreateMedicalHistoryDto) {
    const existing = await this.prisma.medicalHistory.findUnique({
      where: { id_appointment: dto.id_appointment },
    });
    if (existing) {
      throw new ConflictException(`Appointment ID ${dto.id_appointment} already has a medical history`);
    }

    await this.prisma.appointment.findUniqueOrThrow({
      where: { id_appointment: dto.id_appointment },
    });
    await this.prisma.service.findUniqueOrThrow({
      where: { id_service: dto.id_service },
    });

    const date = new Date(dto.date);

    const created = await this.prisma.medicalHistory.create({
      data: {
        id_appointment: dto.id_appointment,
        id_service: dto.id_service,
        description: dto.description,
        date,
      },
      include: this.includeQuery,
    });

    // Mark appointment as CLOSED once medical history is created
    await this.prisma.appointment.update({
      where: { id_appointment: dto.id_appointment },
      data: { status: 'CLOSED' },
    });

    return this.mapHistory(created);
  }

  async update(id: number, dto: UpdateMedicalHistoryDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.id_appointment !== undefined) data.id_appointment = dto.id_appointment;
    if (dto.id_service !== undefined) data.id_service = dto.id_service;
    if (dto.description) data.description = dto.description;
    if (dto.date) data.date = new Date(dto.date);

    const updated = await this.prisma.medicalHistory.update({
      where: { id_medical_history: id },
      data,
      include: this.includeQuery,
    });

    return this.mapHistory(updated);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.medicalHistory.delete({
      where: { id_medical_history: id },
    });
  }
}
