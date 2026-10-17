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
import { ReceptionistsService } from './receptionists.service';
import { CreateReceptionistDto, UpdateReceptionistDto } from './dto/receptionist.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('receptionist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('receptionist')
export class ReceptionistsController {
  constructor(private readonly receptionistsService: ReceptionistsService) {}

  @Get()
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Get all receptionists' })
  async findAll() {
    return this.receptionistsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIAN', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Get receptionist by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.receptionistsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Register receptionist profile' })
  async create(@Body() dto: CreateReceptionistDto) {
    return this.receptionistsService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update receptionist profile' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReceptionistDto,
  ) {
    return this.receptionistsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete receptionist profile' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.receptionistsService.remove(id);
  }
}
