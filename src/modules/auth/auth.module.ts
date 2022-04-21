import { Module } from '@nestjs/common';
import DatabaseModule from '../database/database.module.js';
import { PassportModule } from '@nestjs/passport';
import LocalStrategy from './local.strategy.js';
import AuthController from './auth.controller.js';
import JwtStrategy from './jwt.strategy.js';

@Module({
  imports: [DatabaseModule, PassportModule],
  providers: [LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
