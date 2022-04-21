import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller.js';
import NotifierBotService from './notifier-bot.service.js';
import DatabaseModule from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [TelegramController],
  providers: [NotifierBotService],
  exports: [NotifierBotService],
})
export class TelegramModule {}
