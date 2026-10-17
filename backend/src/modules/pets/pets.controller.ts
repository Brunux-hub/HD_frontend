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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('pet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pet')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Get all pets (or optionally filter by owner query)' })
  async findAll(@Query('id_owner') idOwner?: string) {
    if (idOwner) {
      return this.petsService.findByOwner(parseInt(idOwner, 10));
    }
    return this.petsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Get pet by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER')
  @ApiOperation({ summary: 'Register new pet patient' })
  async create(@Body() dto: CreatePetDto) {
    return this.petsService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER')
  @ApiOperation({ summary: 'Update pet details' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePetDto,
  ) {
    return this.petsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'RECEPTIONIST')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete pet record' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.petsService.remove(id);
  }
}
