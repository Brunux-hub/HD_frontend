import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ClientRegisterDto } from './dto/client-register.dto';
import { RegisterDto } from './dto/register.dto';
import { Public, JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return JWT bearer token' })
  @ApiResponse({ status: 200, description: 'User successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user fine-grained role' })
  @ApiResponse({ status: 200, description: 'Role details of authenticated user' })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.id_user);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Public client registration (Creates User + Owner profile)' })
  @ApiResponse({ status: 201, description: 'Client registered successfully' })
  async register(@Body() payload: ClientRegisterDto) {
    return this.authService.registerClient(payload);
  }

  @Post('register-internal')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin internal registration of system user accounts' })
  async registerInternal(@Body() payload: RegisterDto) {
    return this.authService.registerUser(payload);
  }
}
