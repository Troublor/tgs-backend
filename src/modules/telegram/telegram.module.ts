import { Module } from '@nestjs/common';
import NotifierBotService from './notifier-bot.service.js';
import DatabaseModule from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  providers: [NotifierBotService],
  exports: [NotifierBotService],
})
export class TelegramModule {}
