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
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccinationDto, UpdateVaccinationDto } from './dto/vaccination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('vaccination')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vaccination')
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Get()
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Get all administered vaccination records' })
  async findAll() {
    return this.vaccinationsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Get vaccination record by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vaccinationsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'VETERINARIAN')
  @ApiOperation({ summary: 'Register administered vaccination dose' })
  async create(@Body() dto: CreateVaccinationDto) {
    return this.vaccinationsService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'VETERINARIAN')
  @ApiOperation({ summary: 'Update vaccination record' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVaccinationDto,
  ) {
    return this.vaccinationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vaccination record' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vaccinationsService.remove(id);
  }
}
