import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  type?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'healthy-pets-super-secure-jwt-production-ready-key-2026',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: payload.sub },
      select: {
        id_user: true,
        username: true,
        role: true,
        type: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User in token no longer exists');
    }

    return user;
  }
}
