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
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { JwtAuthGuard, Public } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all veterinary services in catalog' })
  async findAll() {
    return this.servicesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new catalog service' })
  async create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update catalog service' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete catalog service' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.servicesService.remove(id);
  }
}
