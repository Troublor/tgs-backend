import { Module } from '@nestjs/common';
import DatabaseModule from '../database/database.module.js';
import MessageService from './message.service.js';
import MessageController from './message.controller.js';
import { TelegramModule } from '../telegram/telegram.module.js';
import LegacyController from './legacy.controller.js';

@Module({
  imports: [DatabaseModule, TelegramModule],
  providers: [MessageService],
  controllers: [MessageController, LegacyController],
})
export default class MessageModule {}
