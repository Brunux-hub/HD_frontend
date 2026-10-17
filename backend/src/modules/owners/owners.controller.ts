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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OwnersService } from './owners.service';
import { CreateOwnerDto, UpdateOwnerDto } from './dto/owner.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('owner')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('owner')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get owner profile for currently logged-in user' })
  async getMyOwner(@CurrentUser() user: AuthenticatedUser, @Res() res: Response) {
    const owner = await this.ownersService.findByUserId(user.id_user);
    if (!owner) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(owner);
  }

  @Get('dni/:dni')
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER')
  @ApiOperation({ summary: 'Find owner by DNI' })
  async getByDni(@Param('dni') dni: string, @Res() res: Response) {
    const owner = await this.ownersService.findByDni(dni);
    if (!owner) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(owner);
  }

  @Get()
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER')
  @ApiOperation({ summary: 'Get all owners' })
  async findAll() {
    return this.ownersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER')
  @ApiOperation({ summary: 'Get owner by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ownersService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER')
  @ApiOperation({ summary: 'Create new owner profile' })
  async create(@Body() dto: CreateOwnerDto) {
    return this.ownersService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'RECEPTIONIST', 'VETERINARIAN', 'WORKER', 'CLIENT')
  @ApiOperation({ summary: 'Update owner profile' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOwnerDto,
  ) {
    return this.ownersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'RECEPTIONIST')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete owner profile' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ownersService.remove(id);
  }
}
