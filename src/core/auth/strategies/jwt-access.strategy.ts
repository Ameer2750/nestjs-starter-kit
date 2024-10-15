import { InferSelectModel } from 'drizzle-orm';
import { userTable } from './../../../drizzle/schema';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../config/env/configuration';

type UserTable = InferSelectModel<typeof userTable>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userService: UserService;

  constructor(
    userService: UserService,
    configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
    this.userService = userService;
  }

  async validate(payload: any): Promise<UserTable | null> {
    const authUser = await this.userService.findOneById(payload.sub);
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return authUser.user;
  }
}