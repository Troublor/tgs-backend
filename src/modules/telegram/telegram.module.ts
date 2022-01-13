import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import UserChatMapService from './user-chat-map.service';
import NotifierBotService from './notifier-bot.service';

@Module({
  controllers: [TelegramController],
  providers: [UserChatMapService, NotifierBotService],
})
export class TelegramModule {}
