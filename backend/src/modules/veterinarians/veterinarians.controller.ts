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
import { VeterinariansService } from './veterinarians.service';
import { CreateVeterinarianDto, UpdateVeterinarianDto } from './dto/veterinarian.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('veterinarian')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('veterinarian')
export class VeterinariansController {
  constructor(private readonly veterinariansService: VeterinariansService) {}

  @Get()
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER')
  @ApiOperation({ summary: 'Get all veterinarians' })
  async findAll() {
    return this.veterinariansService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST', 'WORKER')
  @ApiOperation({ summary: 'Get veterinarian by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariansService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Register new veterinarian' })
  async create(@Body() dto: CreateVeterinarianDto) {
    return this.veterinariansService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update veterinarian details' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVeterinarianDto,
  ) {
    return this.veterinariansService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete veterinarian' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.veterinariansService.remove(id);
  }
}
