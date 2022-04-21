import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../database/entities/user.entity.js';
import UserService from '../database/user.service.js';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../database/jwt.service.js';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret', 'secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const username = payload.username;
    const user = await this.userService.getUser(username);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
