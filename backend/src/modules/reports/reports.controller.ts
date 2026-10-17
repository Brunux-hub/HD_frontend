import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MedicalHistoriesService } from '../medical-histories/medical-histories.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AppointmentStatus } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly medicalHistoriesService: MedicalHistoriesService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get('completed-services')
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER')
  @ApiOperation({ summary: 'Get completed clinical services reports' })
  async getCompletedServices() {
    return this.medicalHistoriesService.findCompletedServices();
  }

  @Get('appointments')
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER')
  @ApiOperation({ summary: 'Get appointments filtered by status' })
  @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false })
  async getAppointmentsByStatus(@Query('status') status?: AppointmentStatus) {
    if (status) {
      return this.appointmentsService.findByStatus(status);
    }
    return this.appointmentsService.findAll();
  }
}
