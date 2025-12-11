import { InferSelectModel } from 'drizzle-orm';
import { userTable } from './../../../drizzle/schema';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../config/env/configuration';
import { Request } from 'express';
import { AuthService } from '../auth.service';

type UserTable = InferSelectModel<typeof userTable>

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly userService: UserService;
  private readonly authService: AuthService;

  constructor(
    userService: UserService,
    configService: ConfigService<EnvironmentVariables>,
    authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies?.refreshToken;
          return token;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtRefreshSecret'),
      passReqToCallback: true,
    });
    this.userService = userService;
    this.authService = authService
  }

  validate(req: Request, payload: { sub: number }) {
    const refreshToken = req.cookies['refreshToken'];
    const userId = payload.sub;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}