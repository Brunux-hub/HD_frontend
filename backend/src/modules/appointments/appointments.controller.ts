import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('appointment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointment')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Get all scheduled appointments' })
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Get appointment by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER')
  @ApiOperation({ summary: 'Create new appointment' })
  async create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER')
  @ApiOperation({ summary: 'Update appointment' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'RECEPTIONIST')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete appointment' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.appointmentsService.remove(id);
  }
}
