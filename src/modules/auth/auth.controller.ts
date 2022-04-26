import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request as Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import LocalAuthGuard from './local-auth.guard.js';
import JwtAuthGuard from './jwt-auth.guard.js';
import NewUserDto from './dtos/NewUser.dto.js';
import UserService from '../database/user.service.js';
import JwtService from '../database/jwt.service.js';
import User from '../database/entities/user.entity.js';
import Jwt from '../database/entities/jwt.entity.js';
import { ApiTags } from '@nestjs/swagger';
import { DtoValidationPipe } from '../dto-validation.pipe.js';
import RateLimitException from '../rate-limit.exception.js';

@Controller('/auth')
@ApiTags('auth')
export default class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/jwt/:description')
  async generateJwt(@Req() req: Request, @Param('description') desp: string) {
    const user = req.user as User;
    if (!desp || desp.length <= 0)
      throw new BadRequestException('description cannot be empty');
    try {
      const jwt = await this.jwtService.generate(user, desp);
      return jwt.jsonObject;
    } catch (e) {
      if (e instanceof RateLimitException) {
        throw new ForbiddenException('request too frequent');
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/jwts')
  async getTokens(@Req() req: Request) {
    const user = req.user as User;
    const jwts = await this.jwtService.get(user);
    return jwts.map((j: Jwt) => j.jsonObject);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/jwt/all')
  async deleteAllTokens(@Req() req: Request) {
    const user = req.user as User;
    const jwts = await this.jwtService.get(user);
    for (const jwt of jwts) {
      await this.jwtService.delete(jwt.token);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/jwt/:jwt')
  async deleteToken(@Req() req: Request, @Param('jwt') jwt: string) {
    const user = req.user as User;
    const success = await this.jwtService.delete(jwt, user);
    if (!success) throw new BadRequestException('jwt does not exist');
  }

  @Post('/signup')
  async signup(@Body(DtoValidationPipe) newUserDto: NewUserDto) {
    if (newUserDto.username.length <= 0)
      throw new BadRequestException('username cannot be empty');
    const user = await this.userService.getUser(newUserDto.username);
    if (user)
      throw new ConflictException(
        `username '${newUserDto.username}' already exists`,
      );
    await this.userService.createUser(newUserDto.username, newUserDto.password);
  }
}
