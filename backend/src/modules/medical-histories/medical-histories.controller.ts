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
import { MedicalHistoriesService } from './medical-histories.service';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from './dto/medical-history.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('medical_history')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medical_history')
export class MedicalHistoriesController {
  constructor(private readonly medicalHistoriesService: MedicalHistoriesService) {}

  @Get()
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Get all medical histories' })
  async findAll() {
    return this.medicalHistoriesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Get medical history by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicalHistoriesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'VETERINARIAN')
  @ApiOperation({ summary: 'Create medical history record' })
  async create(@Body() dto: CreateMedicalHistoryDto) {
    return this.medicalHistoriesService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'VETERINARIAN')
  @ApiOperation({ summary: 'Update medical history record' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicalHistoryDto,
  ) {
    return this.medicalHistoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete medical history record' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.medicalHistoriesService.remove(id);
  }
}
