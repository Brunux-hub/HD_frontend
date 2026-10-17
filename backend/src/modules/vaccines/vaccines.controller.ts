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
import { VaccinesService } from './vaccines.service';
import { CreateVaccineDto, UpdateVaccineDto } from './dto/vaccine.dto';
import { JwtAuthGuard, Public } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('vaccine')
@Controller('vaccine')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VaccinesController {
  constructor(private readonly vaccinesService: VaccinesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all vaccines from catalog' })
  async findAll() {
    return this.vaccinesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get vaccine by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vaccinesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'VETERINARIAN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new vaccine in catalog' })
  async create(@Body() dto: CreateVaccineDto) {
    return this.vaccinesService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'VETERINARIAN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vaccine details' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVaccineDto,
  ) {
    return this.vaccinesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vaccine from catalog' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vaccinesService.remove(id);
  }
}
