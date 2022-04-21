import { Module } from '@nestjs/common';
import DatabaseModule from '../database/database.module.js';
import MessageService from './message.service.js';
import MessageController from './message.controller.js';
import { TelegramModule } from '../telegram/telegram.module.js';

@Module({
  imports: [DatabaseModule, TelegramModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export default class MessageModule {}
