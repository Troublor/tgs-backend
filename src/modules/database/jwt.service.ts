import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import Jwt from './entities/jwt.entity.js';
import { AppData } from './data-source.js';
import User from './entities/user.entity.js';
import { JwtService as JwtExtService } from '@nestjs/jwt';
import RateLimitException from '../rate-limit.exception.js';

export interface JwtPayload {
  username: string;
}

@Injectable()
export default class JwtService {
  readonly repo: Repository<Jwt>;
  constructor(private readonly jwtService: JwtExtService) {
    this.repo = AppData.getRepository(Jwt);
  }

  async generate(user: User, description: string): Promise<Jwt> {
    const payload: JwtPayload = { username: user.username };
    const token = this.jwtService.sign(payload);
    const jwt = this.repo.create({
      token: token,
      description: description,
      user: user,
    });
    const exist = await this.repo.findOne({ where: { token: token } });
    if (exist) {
      throw new RateLimitException();
    }
    try {
      await this.repo.save(jwt);
    } catch (e) {}
    return jwt;
  }

  async get(user?: User): Promise<Jwt[]> {
    if (user) {
      return await this.repo.find({
        where: {
          user: { username: user.username },
        },
        relations: {
          user: true,
        },
      });
    } else {
      return await this.repo.find({
        relations: {
          user: true,
        },
      });
    }
  }

  async delete(token: string, user?: User): Promise<boolean> {
    let r: DeleteResult;
    if (user) {
      r = await this.repo.delete({
        token: token,
        user: { username: user.username },
      });
    } else {
      r = await this.repo.delete(token);
    }
    return !!r.affected && r.affected > 0;
  }
}
