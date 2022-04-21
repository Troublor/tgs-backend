import { Module } from '@nestjs/common';
import DatabaseModule from '../database/database.module.js';
import UrlController from './url.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [UrlController],
})
export default class UrlModule {}
