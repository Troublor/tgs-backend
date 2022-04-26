import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../database/entities/user.entity.js';
import UserService from '../database/user.service.js';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super();
  }

  async validate(username: string, password?: string): Promise<User> {
    const user = await this.userService.getUser(username);
    if (!user || (!!user.password && !user.verify(password)))
      throw new UnauthorizedException();
    return user;
  }
}
